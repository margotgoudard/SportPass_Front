import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Modal, TextInput } from 'react-native';
import AppLoader from '../../components/AppLoader';
import axios from 'axios'; 
import ProgressBar from '../../components/ProgressBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Checkbox from '../../components/Checkbox';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import URLS from '../../urlConfig.js';

export default function PlacePage({ route, navigation }) {
  const { selectedTribune, selectedMatch } = route.params;
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placesByRow, setPlacesByRow] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [guestNom, setGuestNom] = useState('');
  const [guestPrenom, setGuestPrenom] = useState('');
  const [currentSelectedPlace, setCurrentSelectedPlace] = useState(null);
  const [optionBuvette, setOptionBuvette] = useState(false); 
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rangeeResponse = await axios.get(`${URLS.url}/rangee/tribune/${selectedTribune.idTribune}`);
        const rangees = rangeeResponse.data;
  
        const placesResponse = await Promise.all(
          rangees.map((rangee) => axios.get(`${URLS.url}/place/rangee/${rangee.idRangee}`))
        );
        const placesData = placesResponse.map((response) => response.data).flat();
  
        const placesByRowData = {};
        
        const ticketResponse = await Promise.all(
          placesData.map((place) => axios.get(`${URLS.url}/billet/place/${place.idPlace}`))
        );
        const ticketData = ticketResponse.map((response) => response.data).flat();
  
        const ticketMap = {};
        ticketData.forEach((ticket) => {
          ticketMap[ticket.idPlace] = ticket;
        });
  
        const placeDetailsPromises = placesData.map(async (place) => {
        const ticket = ticketData.find((ticket) => ticket.idPlace === place.idPlace);
        const typePlaceResponse = await axios.get(`${URLS.url}/typePlace/${place.idType}`);
        const typePlace = typePlaceResponse.data;

        const rangeeResponse = await axios.get(`${URLS.url}/rangee/${place.idRangee}`);
        const rangee = rangeeResponse.data;

        const isReserved = ticket && ticket.reservee == true;
        const optionBuvette = ticket && ticket.buvette == true;
        const placeWithDetails = {
          ...place,
          isReserved,
          price: ticket ? ticket.prix : null,
          type: typePlace ? typePlace.nom : null,
          numRangee : rangee? rangee.numero : null,
          optionBuvette,
        };

          return placeWithDetails;
        });

        const placesWithDetails = await Promise.all(placeDetailsPromises);

        placesWithDetails.forEach((place) => {
          const rowId = place.idRangee;
          if (!placesByRowData[rowId]) {
            placesByRowData[rowId] = [];
          }

          placesByRowData[rowId].push(place);
        });

      setPlacesByRow(placesByRowData);
      setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des places :', error);
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedTribune]);

  useEffect(() => {
    const allBuvettesSelected = selectedPlaces.every((place) => place.optionBuvette == 1);
    setOptionBuvette(allBuvettesSelected);
  }, [selectedPlaces]);
  

  const handlePlaceSelection = async (place) => {
    if (place.isReserved) {
      return; 
    }

    const isSelected = selectedPlaces.some((selectedPlace) => selectedPlace.idPlace === place.idPlace);
    if (isSelected) {
      const filteredPlaces = selectedPlaces.filter((selectedPlace) => selectedPlace.idPlace !== place.idPlace);
      setSelectedPlaces(filteredPlaces);
    } else {
      if (selectedPlaces.length === 0) {
        const userId = await AsyncStorage.getItem('userId');
        const userResponse = await axios.get(`${URLS.url}/user/${userId}`);
        const user = userResponse.data;

        setSelectedPlaces([{ ...place, guestNom: user.nom, guestPrenom: user.prenom }]);
      } else {
        setCurrentSelectedPlace(place);
        setSelectedPlaces([...selectedPlaces, { ...place, guestNom: '', guestPrenom: '' }]);
        setIsModalVisible(true);
      }
    }
  };

  const handleConfirmGuestInfo = () => {
    if (!guestNom.trim() || !guestPrenom.trim()) {
      setErrorMessage('Les champs ne doivent pas être vides.');
      return; 
    }
  
    if (currentSelectedPlace) {
      const updatedPlaces = selectedPlaces.map((place) => {
        if (place.idPlace == currentSelectedPlace.idPlace) {
          return { ...place, guestNom, guestPrenom };
        }
        return place;
      });
      setSelectedPlaces(updatedPlaces);
      setIsModalVisible(false);
      setCurrentSelectedPlace(null); 
      setErrorMessage(''); 
    }
  };

  const handleCancelSelection = () => {
    setIsModalVisible(false); 
    if (currentSelectedPlace) {
      const filteredPlaces = selectedPlaces.filter((place) => place.idPlace !== currentSelectedPlace.idPlace);
      setSelectedPlaces(filteredPlaces);
      setCurrentSelectedPlace(null);
      setErrorMessage(''); 
    }
  };
  

  const handleRemovePlace = (idPlace) => {
    const filteredPlaces = selectedPlaces.filter((place) => place.idPlace !== idPlace);
    setSelectedPlaces(filteredPlaces);
  };

  const calculateTotalPrice = () => {
    const totalPrice = selectedPlaces.reduce((accumulator, place) => {
      return accumulator + (place.price || 0); 
    }, 0).toFixed(2);

    return totalPrice;
  };
  

  const handleToggleBuvette = (place) => {
    const updatedPlaces = selectedPlaces.map((selectedPlace) => {
        if (selectedPlace.idPlace === place.idPlace) {
            const newOptionBuvette = !selectedPlace.optionBuvette;
            const updatedPrice = newOptionBuvette ? (selectedPlace.price + 9.99) : (selectedPlace.price - 9.99);
            return {
                ...selectedPlace,
                optionBuvette: newOptionBuvette,
                price: updatedPrice,
            };
        }
        return selectedPlace;
    });
    setSelectedPlaces(updatedPlaces);
  };

  const handlePanierButton = () => {
    navigation.navigate('Paiement', { selectedPlaces: selectedPlaces, selectedTribune: selectedTribune, selectedMatch });
  }

  if (loading) {
    return <AppLoader />;
  }

  return (
    <ImageBackground source={require('../../assets/background.png')} style={styles.background}>
      <ScrollView>
        <ProgressBar currentPage={3} />
        <View style={styles.container}>
        {Object.keys(placesByRow).map((rowId) => (
          <View key={rowId}>
            <View style={styles.rowContainer}>
              {placesByRow[rowId].map((place, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.place
                  ]}
                  onPress={() => handlePlaceSelection(place)}
                  disabled={place.isReserved}
                >
                   {place.isReserved ? ( 
                      <MaterialIcons 
                        name="chair" 
                        size={30} 
                        color='#D9D9D9'
                        />
                    ) : (
                      <MaterialIcons 
                        name="chair" 
                        size={30} 
                        color={selectedPlaces.some((selectedPlace) => selectedPlace.idPlace === place.idPlace) ? '#BD4F6C' : '#008900'}
                      />
                    )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
        <View>
        {selectedPlaces.length > 0 && (
          <View style={styles.selectedPlaceDetails}>
            <Text style={styles.textTribune}>{selectedTribune.nom}</Text>
            <Text style={styles.nombreBilletStyle}>{selectedPlaces.length} billets</Text>
            <Text style={styles.totalPriceStyle}>{calculateTotalPrice()}€</Text>
            {selectedPlaces.map((place, index) => (
              <View key={index} style={styles.containerPlace}>
              <View style={styles.Detcontainer}>
                <View style={styles.detailsContainer}>
                  <View style={styles.textContainer}>
                    <Text style={styles.textPlace}>Rang {place.numRangee} - Siège {place.numero}</Text>
                    <Text style={styles.textPrix}>{place.type} - {place.price}€</Text>
                  </View>
                  <Text style={styles.textGuestInfo}>Titulaire - {place.guestPrenom} {place.guestNom}</Text>
                </View>
              </View>
              <View style={styles.checkboxContainer}>
                <Checkbox
                  text="Option buvette"
                  isChecked={place.optionBuvette == 1}
                  onPress={() => handleToggleBuvette(place)} 
                  container={styles.checkbox}
                />
                <Text style={{fontStyle: 'italic'}}>*sandwich + boisson </Text>
              </View>
              <TouchableOpacity onPress={() => handleRemovePlace(place.idPlace)}>
                <FontAwesome6 style={styles.trashIcon} name="trash" size={20} color='#5D2E46' />
              </TouchableOpacity>
              </View>
            ))}
             
          </View>
        )}
        </View>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalContainer}>
          
            <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => handleCancelSelection()}>
            <Entypo name="cross" size={30} color="#BD4F6C" />            
            </TouchableOpacity> 
          </View>
              <Text style={styles.modalTitle}>Veuillez saisir les informations du titulaire de la place</Text>
              <TextInput
                style={styles.input}
                placeholder="Prénom"
                value={guestPrenom}
                onChangeText={(text) => setGuestPrenom(text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Nom"
                value={guestNom}
                onChangeText={(text) => setGuestNom(text)}
              />
              {errorMessage && !guestNom && (
                <Text style={styles.errorText}>{errorMessage}</Text>
              )}
              <TouchableOpacity
              style={styles.button}
              onPress={handleConfirmGuestInfo}
              >
                <Text style={styles.buttonText}>Confirmer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
      {selectedPlaces.length > 0 && (
        <View style={styles.PanierButtonContainer}>
            <TouchableOpacity
              style={styles.PanierButton}
              onPress={handlePanierButton}
            >
            <FontAwesome name="shopping-cart" size={24} color="white" />
            <Text style={styles.PanierButtonText}>Paiement</Text>
            </TouchableOpacity>
          </View>
        )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container:{
    marginBottom:60,
    marginTop:10,
  },
  rowContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent:'center',
  },
  place: {
    margin: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedPlaceDetails:{
    justifyContent: 'center',
    backgroundColor:'white',
    borderRadius:10,
    margin:10,
    padding:10,
    marginBottom:70,
  },
  textTribune:{
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft:15,
  },
  nombreBilletStyle:{
    marginLeft:15,
    fontStyle:'italic',
    marginBottom:5,
  },
  containerPlace:{
    backgroundColor:'#D9D9D9',
    borderRadius:20,
    paddingVertical:10,
    paddingHorizontal:20,
    marginBottom : 5,
  },
  Detcontainer:{
    flexDirection: 'row',
    justifyContent: 'center',
  },
  totalPriceStyle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#BD4F6C', 
    position:'absolute',
    zIndex:1,
    right:20,
    top:10,
  },
  detailsContainer : {
    borderRadius:15,
    flexDirection: 'row',
    marginRight:5,
    marginLeft:5,
    marginVertical:5,
    flexWrap: 'wrap',
    maxHeight: '100%', 
    maxWidth: '100%', 
    zIndex:2,
  },
  textPlace:{
    fontSize:17,
    fontWeight:'bold'
  },
  textPrix:{
    fontSize:17,
    fontWeight:'bold',
    color:'#008900',
    marginLeft: 10
  },
  textGuestInfo: {
    fontSize:15,
    fontStyle:'italic',
    marginTop: 5,
  },
  trashIcon:{
    zIndex:3,
    top:-20,
    right:-5,
    position:'absolute'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', 

  },
  modalHeader: {
    position: 'absolute',
    top: 5,
    left: 5,
    zIndex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 13,

  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#BD4F6C',
    color: 'white',
    fontSize: 16,
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText:{
    color: 'white',
    fontWeight: 'bold',
    fontSize:17,
  },
  textContainer:{
    flexDirection: 'row',
  },
  checkboxContainer:{
    justifyContent:'center',
    flexDirection: "column",
    marginLeft:5,
  },
  errorText: {
    color: '#5D2E46',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  PanierButtonContainer:{
    width: '100%', 
    justifyContent:'center',
    alignItems:'center',
  },
  PanierButton: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent:'center',
    alignItems:'center',
    bottom: 90,
    backgroundColor: '#BD4F6C',
    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 10,
    zIndex:4,
  },
  PanierButtonText: {
    color: 'white',
    fontSize: 24,
    marginLeft: 10,
  },
  
});
