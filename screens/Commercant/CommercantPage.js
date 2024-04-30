import React, { useRef , useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet,  Button  } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Map from '../../components/Map';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';  

const CommercantPage = () => {
    const [allCommercants, setAllCommercants] = useState([]);
    const [displayedCommercants, setDisplayedCommercants] = useState([]);
    const [region, setRegion] = useState(null);
    const [selectedTypeCommercant, setSelectedTypeCommercant] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [typeCommercants, setTypesCommercants] = useState([]);
    const [villes, setVilles] = useState([]);

    const getUserId = async () => {
        const idUser = await AsyncStorage.getItem('userId');
        return idUser;
    };

    const fetchCommercants = useCallback(async () => {
        const userId = await getUserId();
        const response = await axios.get(`http://10.0.2.2:4000/api/user/${userId}`);
        const data = await axios.get(`http://10.0.2.2:4000/api/commercant/${response.data.idEquipe}`);
        const commercantsWithCoords = await Promise.all(data.data.map(async (commercant) => {
            const coords = await getCoordinates(commercant.adresse);
            return { ...commercant, ...coords };
        }));
        setAllCommercants(commercantsWithCoords);
        setDisplayedCommercants(commercantsWithCoords);
    }, []);

    const applyFilters = useCallback(() => {
        let filtered = [...allCommercants];
        if (selectedTypeCommercant) {
            filtered = filtered.filter(c => c.idTypeCommercant === selectedTypeCommercant.idTypeCommercant);
        }
        if (selectedCity) {
            filtered = filtered.filter(c => c.ville === selectedCity);
        }
        setDisplayedCommercants(filtered);
    }, [selectedTypeCommercant, selectedCity, allCommercants]);

    useEffect(() => {
        applyFilters();
    }, [selectedTypeCommercant, selectedCity, applyFilters]);


    const fetchTypes = async () => {
        try {
            const response = await axios.get('http://10.0.2.2:4000/api/typeCommercant');
            setTypesCommercants(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des types de commerçants:', error);
        }
    };

    const fetchCities = async () => {
        try {
            const citiesFromCommercants = allCommercants.map(commercant => commercant.ville);
            const uniqueCities = [...new Set(citiesFromCommercants)]; 
    
            setVilles(uniqueCities); 
            console.log("CITIES", uniqueCities);
    
        } catch (error) {
            console.error('Erreur lors de la récupération des villes:', error);
        }
    };

    useEffect(() => {
        fetchCities();
        fetchTypes();
    }, [allCommercants]);
    

    const getCoordinates = async (address) => {
        const apiKey = 'ac4c9067aba1497e97eb4b556b5683f0';
        try {
            if (address) {
                const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}`;
                const response = await axios.get(url);
                const { lat, lng } = response.data.results[0].geometry;
                return { latitude: lat, longitude: lng };
            }
        } catch (error) {
            console.error('Erreur de géocodage:', error);
            return { latitude: 0, longitude: 0 };
        }
    };

    const initializeMap = useCallback(async () => {
        try {
            const userId = await getUserId();
            const responseUser = await axios.get(`http://10.0.2.2:4000/api/user/${userId}`);
            const villeEquipe = responseUser.data.Equipe.ville;
            if (villeEquipe) {
                const coords = await getCoordinates(villeEquipe);
                setRegion({
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                    latitudeDelta: 1,
                    longitudeDelta: 1
                });
            }
        } catch (error) {
            console.error('Erreur lors de l’initialisation de la carte:', error);
        }
    }, []);


    useFocusEffect(
        useCallback(() => {
            initializeMap();
            fetchCommercants();
            return () => {};
        }, [initializeMap, fetchCommercants])
    );

    

    return (
        <View style={styles.container}>
            <View style={styles.filtersContainer}>
                <Picker
                    selectedValue={selectedTypeCommercant}
                    onValueChange={itemValue => setSelectedTypeCommercant(itemValue)}
                >
                    <Picker.Item label="All Types" value={null} />
                    {typeCommercants.map((type, index) => (
                        <Picker.Item key={index} label={type.nom} value={type.id} />
                    ))}
                </Picker>
                
                <Picker
                    selectedValue={selectedCity}
                    onValueChange={itemValue => setSelectedCity(itemValue)}
                >
                    <Picker.Item label="All Cities" value={null} />
                    {villes.map((city, index) => (
                        <Picker.Item key={index} label={city} value={city} />
                    ))}
                </Picker>
            </View>
            <View style={styles.map}>
                {region && displayedCommercants.length > 0 && (
                    <Map region={region} commercants={displayedCommercants} />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        margin: 10,
    },
    map: {
        flex: 1,
        width: '100%',
        height: '100%'
    },
   
});

export default CommercantPage;
