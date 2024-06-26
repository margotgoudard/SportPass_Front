import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Map from '../../components/Map';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';  
import DropDownPicker from 'react-native-dropdown-picker';
import CheckBox from '../../components/Checkbox';
import CommercantInfo from '../../components/CommercantInfo';
import URLS from '../../urlConfig.js';
import AppLoader from '../../components/AppLoader.js';

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
    const [selectedCommercant, setSelectedCommercant] = useState(null);
    const [loading, setLoading] = useState(true);

    const getUserId = async () => {
        const idUser = await AsyncStorage.getItem('userId');
        return idUser;
    };

    const toggleFavorite = async (commercant) => {
        try {
            const userId = await getUserId();
            if (commercant.isFavorite) {
                await axios.delete(`${URLS.url}/avoirFavoris/${commercant.idCommercant}/${userId}`);
            } else {
                await axios.post(`${URLS.url}/avoirFavoris`, {
                    idUser: userId,
                    idCommercant: commercant.idCommercant
                });
            }
            fetchCommercants(); 
        } catch (error) {
            console.error('Error updating favorite status:', error);
        }
        commercant.isFavorite = !commercant.isFavorite;
    };

    const handleMarkerPress = (commercant) => {
        setSelectedCommercant(commercant);
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
            const response = await axios.get(`${URLS.url}/user/${userId}`);
            const data = await axios.get(`${URLS.url}/commercant/${response.data.idEquipe}`);
            const commercantsWithCoordsAndCashback = await Promise.all(data.data.map(async (commercant) => {
                const coords = await getCoordinates(commercant.adresse);
                const cashbackResponse = await axios.get(`${URLS.url}/cashbackCommercant/${commercant.idCashbackCommercant}`);
                return { ...commercant, ...coords, cashback: cashbackResponse.data.montant };
            }));
    
            const favoritesResponse = await axios.get(`${URLS.url}/avoirFavoris/user/${userId}`);
            const favorisIds = favoritesResponse.data.map(favori => favori.idCommercant);
    
            const updatedCommercants = commercantsWithCoordsAndCashback.map(commercant => ({
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
        updateMapRegion(selectedCity);
        setLoading(false)
    }, [selectedTypeCommercant, selectedCity, applyFilters]);
    

    const fetchTypes = async () => {
        try {
            const response = await axios.get(`${URLS.url}/typeCommercant`);
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
    
    useEffect(() => {
        if (selectedCity) {
            updateMapRegion(selectedCity);
        }
    }, [selectedCity]);    
    

    const getCoordinates = async (address) => {
        try {
            if (address) {
                const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${'ac4c9067aba1497e97eb4b556b5683f0'}`;
                const response = await axios.get(url);
                const { lat, lng } = response.data.results[0].geometry;
                return { latitude: lat, longitude: lng };
            }
        } catch (error) {
            console.error('Erreur de géocodage:', error);
            return { latitude: 0, longitude: 0 };
        }
    };

    const updateMapRegion = async (city) => {
        if (city && city !== 'Tout sélectionner') {
            const coords = await getCoordinates(city);
            setRegion({
                latitude: coords.latitude,
                longitude: coords.longitude,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
            });
        } else {
            initializeMap();
        }
    };    

    const initializeMap = useCallback(async () => {
        try {
            const userId = await getUserId();
            const responseUser = await axios.get(`${URLS.url}/user/${userId}`);
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
    

    const resetFilters = () => {
        setShowFavorites(false);
        setSelectedTypeCommercant(null);
        setSelectedCity(null);
        setSelectedCommercant(null)
    };

    useFocusEffect(
        useCallback(() => {
            resetFilters();
            initializeMap();
            fetchCommercants();
            return () => {};
        }, [initializeMap, fetchCommercants])
    );

    if (loading) {
        return (
        <AppLoader/>
        );
      }    

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
                placeholder="Selectionnez une catégorie"
                containerStyle={styles.dropdown}
                style={{ ...styles.drop, zIndex: 3 }}
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
                placeholder="Selectionnez une ville"
                containerStyle={styles.dropdown2}
                style={{ ...styles.drop, zIndex: -1 }}
                disableBorderRadius={true}
                autoScroll={true}
                textStyle={{ fontSize: 16, fontWeight: "bold" }}
                dropDownContainerStyle={styles.list}
            />
            <View style={styles.checkboxContainer2}>
            <CheckBox
                text="Afficher seulement mes favoris"
                onPress={() => setShowFavorites(!showFavorites)}
                isChecked={showFavorites}
                containerStyle={styles.checkboxContainer}
                textStyle={styles.checkboxText}
                checkboxStyle={styles.checkbox}
            />
            </View>
            </View>
            <View style={styles.map}>
                {region && (
                    <Map region={region} commercants={displayedCommercants} onMarkerPress={handleMarkerPress} />
                )}
            </View>
            <View style={styles.info}>
                <CommercantInfo
                    selectedCommercant={selectedCommercant}
                    toggleFavorite={toggleFavorite}
                    />
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    info: {
        width: "100%",
        marginBottom: "20%"
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        margin: 10,
    },
    checkboxContainer: {
        zIndex: 1
    },
    map: {
        flex: 1,
        zIndex: -1
    },
    filtersContainer: {
        marginTop: "13%",
        width: '80%'
    },
    dropdown: {
        zIndex: 4,
        marginBottom: 20,
        height: 40
    },
    dropdown2: {
        zIndex: 2,
        marginBottom: 20,
        height: 40
    },
    list: {
        backgroundColor: "#D9D9D9",
        borderWidth: 0,
    },
    drop: {
        backgroundColor: '#D9D9D9',
        borderRadius: 10,
        borderWidth: 0,
    },
    checkboxText: {
        color: "black",
        marginRight:20,
    },
    checkboxContainer2 : {
        backgroundColor:"#D9D9D9",
        paddingVertical:5,
        paddingHorizontal:10,
        borderRadius:10,
    }
});

export default CommercantPage;