import React, { useRef , useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Map from '../../components/Map';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';  
import DropDownPicker from 'react-native-dropdown-picker';
import CheckBox from '../../components/Checkbox';


const CommercantPage = () => {
    const [allCommercants, setAllCommercants] = useState([]);
    const [displayedCommercants, setDisplayedCommercants] = useState([]);
    const [region, setRegion] = useState(null);
    const [selectedTypeCommercant, setSelectedTypeCommercant] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [typeCommercants, setTypesCommercants] = useState([]);
    const [villes, setVilles] = useState([]);
    const [openType, setOpenType] = useState(false);
    const [openCity, setOpenCity] = useState(false);
    const [typePickerZIndex, setTypePickerZIndex] = useState(5000);
    const [cityPickerZIndex, setCityPickerZIndex] = useState(4000);
    const [showFavorites, setShowFavorites] = useState(false);


    const getUserId = async () => {
        const idUser = await AsyncStorage.getItem('userId');
        return idUser;
    };

    const toggleTypeDropdown = (isOpen) => {
        setOpenType(isOpen);
        if (isOpen) {
            setTypePickerZIndex(5000);
            setCityPickerZIndex(4000); 
            setOpenCity(false);
        } else {
            setTypePickerZIndex(4000); 
        }
    };
    
    const toggleCityDropdown = (isOpen) => {
        setOpenCity(isOpen);
        if (isOpen) {
            setCityPickerZIndex(5000); 
            setTypePickerZIndex(4000); 
            setOpenType(false);
        } else {
            setCityPickerZIndex(4000); 
        }
    };


    const fetchCommercants = useCallback(async () => {
        const userId = await getUserId();
        try {
            const response = await axios.get(`http://10.0.2.2:4000/api/user/${userId}`);
            const data = await axios.get(`http://10.0.2.2:4000/api/commercant/${response.data.idEquipe}`);
            const commercantsWithCoords = await Promise.all(data.data.map(async (commercant) => {
                const coords = await getCoordinates(commercant.adresse);
                return { ...commercant, ...coords };
            }));
    
            const favoritesResponse = await axios.get(`http://10.0.2.2:4000/api/avoirFavoris/user/${userId}`);
            const favorisIds = favoritesResponse.data.map(favori => favori.idCommercant);
    
            const updatedCommercants = commercantsWithCoords.map(commercant => ({
                ...commercant,
                isFavorite: favorisIds.includes(commercant.idCommercant) 
            }));
    
            setAllCommercants(updatedCommercants);
            setDisplayedCommercants(updatedCommercants); 
        } catch (error) {
            console.error('Error fetching commercants:', error);
        }
    }, []);
    

    const applyFilters = useCallback(() => {
        let filtered = [...allCommercants];
        if (selectedTypeCommercant && selectedTypeCommercant !== 'all') {
            filtered = filtered.filter(c => c.idTypeCommercant === selectedTypeCommercant);
        }
        if (selectedCity && selectedCity !== 'Tout sélectionner') {
            filtered = filtered.filter(c => c.ville === selectedCity);
        }

        if (showFavorites) {
            filtered = filtered.filter(c => c.isFavorite); 
        }

        setDisplayedCommercants(filtered);
    }, [selectedTypeCommercant, selectedCity, allCommercants, showFavorites]);

    useEffect(() => {
        applyFilters();
    }, [selectedTypeCommercant, selectedCity, applyFilters]);


    const fetchTypes = async () => {
        try {
            const response = await axios.get('http://10.0.2.2:4000/api/typeCommercant');
            const typesWithData = [{ idTypeCommercant: 'all', nom: 'Tout sélectionner' }, ...response.data];
            setTypesCommercants(typesWithData);
        } catch (error) {
            console.error('Erreur lors de la récupération des types de commerçants:', error);
        }
    };

    const fetchCities = async () => {
        try {
            const citiesFromCommercants = allCommercants.map(commercant => commercant.ville);
            const uniqueCities = ['Tout sélectionner', ...new Set(citiesFromCommercants)];
            setVilles(uniqueCities); 
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
            <DropDownPicker
                open={openType}
                value={selectedTypeCommercant}
                items={typeCommercants.map(type => ({label: type.nom, value: type.idTypeCommercant}))}
                setOpen={toggleTypeDropdown}
                setValue={setSelectedTypeCommercant}
                setItems={setTypesCommercants}
                placeholder="Select a type"
                containerStyle={styles.dropdown}
                style={{ ...styles.drop, zIndex: typePickerZIndex }}
                disableBorderRadius={true}
                autoScroll={true}
                textStyle={{ fontSize: 16, fontWeight: "bold" }}
                dropDownContainerStyle={styles.list}
            />
            <DropDownPicker
                open={openCity}
                value={selectedCity}
                items={villes.map(ville => ({label: ville, value: ville}))}
                setOpen={toggleCityDropdown}
                setValue={setSelectedCity}
                setItems={setVilles}
                placeholder="Select a city"
                containerStyle={styles.dropdown}
                style={{ ...styles.drop, zIndex: cityPickerZIndex }}
                disableBorderRadius={true}
                autoScroll={true}
                textStyle={{ fontSize: 16, fontWeight: "bold" }}
                dropDownContainerStyle={styles.list}
            />
            <CheckBox
                text="Show Only My Favorites"
                onPress={() => setShowFavorites(!showFavorites)}
                isChecked={showFavorites}
                containerStyle={styles.checkboxContainer}
                textStyle={styles.checkboxText}
                checkboxStyle={styles.checkbox}
            />
            </View>
            <View style={styles.map}>
                {region && (
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
    filtersContainer: {
        marginTop: "13%",
        width: '80%',
    },
    dropdown: {
        height: 40,
        marginBottom: 20,
    },
    list: {
        backgroundColor: "#D9D9D9",
        borderWidth: 0,
    },
    drop: {
        zIndex: 5000,  
        backgroundColor: '#D9D9D9',
        borderRadius: 10,
        borderWidth: 0,
    }
});

export default CommercantPage;
