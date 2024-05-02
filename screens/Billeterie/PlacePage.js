import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground,  Modal, TextInput, Button  } from 'react-native';
import LottieView from 'lottie-react-native';
import AppLoader from '../../components/AppLoader';
import axios from 'axios'; 
import ProgressBar from '../../components/ProgressBar';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';


export default function PlacePage({ route }) {
  const { selectedTribune } = route.params;
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placesByRow, setPlacesByRow] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestLastName, setGuestLastName] = useState('');
  const [currentSelectedPlace, setCurrentSelectedPlace] = useState(null);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const rangeeResponse = await axios.get(`http://10.0.2.2:4000/api/rangee/tribune/${selectedTribune.idTribune}`);
        const rangees = rangeeResponse.data;
  
        const placesResponse = await Promise.all(
          rangees.map((rangee) => axios.get(`http://10.0.2.2:4000/api/place/rangee/${rangee.idRangee}`))
        );
        const placesData = placesResponse.map((response) => response.data).flat();
  
        const placesByRowData = {};
        
        const ticketResponse = await Promise.all(
          placesData.map((place) => axios.get(`http://10.0.2.2:4000/api/billet/place/${place.idPlace}`))
        );
        const ticketData = ticketResponse.map((response) => response.data).flat();
  
        const ticketMap = {};
        ticketData.forEach((ticket) => {
          ticketMap[ticket.idPlace] = ticket;
        });
  
        const placeDetailsPromises = placesData.map(async (place) => {
        const ticket = ticketData.find((ticket) => ticket.idPlace === place.idPlace);
        const typePlaceResponse = await axios.get(`http://10.0.2.2:4000/api/typePlace/${place.idType}`);
        const typePlace = typePlaceResponse.data;

        const rangeeResponse = await axios.get(`http://10.0.2.2:4000/api/rangee/${place.idRangee}`);
        const rangee = rangeeResponse.data;

        const isReserved = ticket && ticket.reservee == 1;
        const placeWithDetails = {
          ...place,
          isReserved,
          price: ticket ? ticket.prix : null,
          type: typePlace ? typePlace.nom : null,
          numRangee : rangee? rangee.numero : null,
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
  

  const handlePlaceSelection = (place) => {
    const isSelected = selectedPlaces.some((selectedPlace) => selectedPlace.idPlace === place.idPlace);
    if (isSelected) {
      const filteredPlaces = selectedPlaces.filter((selectedPlace) => selectedPlace.idPlace !== place.idPlace);
      setSelectedPlaces(filteredPlaces);
    } else {
      if (selectedPlaces.length > 0) {
        setCurrentSelectedPlace(place); 
        setSelectedPlaces([...selectedPlaces, { ...place, guestName: '', guestLastName: '' }]);
        setIsModalVisible(true);
      }
      else{
        setSelectedPlaces([...selectedPlaces, place]);
      }
    }
  };

  const handleConfirmGuestInfo = () => {
    if (!guestName.trim() || !guestLastName.trim()) {
      alert('Veuillez saisir le nom et le prénom du titulaire de la place.');
      return; 
    }
  
    if (currentSelectedPlace) {
      const updatedPlaces = selectedPlaces.map((place) => {
        if (place.idPlace == currentSelectedPlace.idPlace) {
          return { ...place, guestName, guestLastName };
        }
        return place;
      });
      setSelectedPlaces(updatedPlaces);
      setIsModalVisible(false);
      setCurrentSelectedPlace(null); 
    }
  };

  const handleCancelSelection = () => {
    setIsModalVisible(false); 
    if (currentSelectedPlace) {
      const filteredPlaces = selectedPlaces.filter((place) => place.idPlace !== currentSelectedPlace.idPlace);
      setSelectedPlaces(filteredPlaces);
      setCurrentSelectedPlace(null);
    }
  };
  

  const handleRemovePlace = (idPlace) => {
    const filteredPlaces = selectedPlaces.filter((place) => place.idPlace !== idPlace);
    setSelectedPlaces(filteredPlaces);
  };

  const calculateTotalPrice = () => {
    const totalPrice = selectedPlaces.reduce((accumulator, place) => {
      return accumulator + (place.price || 0); 
    }, 0);
    return totalPrice;
  };

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
                  disabled={!place.isReserved}

                >
                   {place.isReserved ? ( 
                      <MaterialIcons 
                        name="chair" 
                        size={30} 
                        color={selectedPlaces.some((selectedPlace) => selectedPlace.idPlace === place.idPlace) ? '#BD4F6C' : '#008900'}
                        />
                    ) : (
                      <MaterialIcons 
                        name="chair" 
                        size={30} 
                        color='#D9D9D9'
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
              <View key={index} style={styles.Detcontainer}>
                <View style={styles.detailsContainer}>
                  <View style={styles.textContainer} >
                  <Text style={styles.textPlace}>Rang {place.numRangee} - Siège {place.numero} </Text>
                  <Text style={styles.textPrix}>{place.type} - {place.price}€</Text>
                  </View>
                  { (place.guestName !=='' && place.guestLastName!== '') &&(
                  <Text style={styles.textGuestInfo}>{place.guestLastName} {place.guestName}</Text>
                  )}
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
                value={guestLastName}
                onChangeText={(text) => setGuestLastName(text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Nom"
                value={guestName}
                onChangeText={(text) => setGuestName(text)}
              />
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
    marginTop:20,
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
  Detcontainer:{
    position: 'relative', 
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
    backgroundColor:'#D9D9D9',
    borderRadius:15,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal:20,
    paddingVertical:10,
    marginRight:5,
    marginLeft:15,
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
    marginLeft:10,
  },
  textGuestInfo: {
    fontSize:15,
    fontStyle:'italic',
    marginTop: 5,
  },
  trashIcon:{
    zIndex:3,
    marginTop:25,
    marginRight:15,
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
    marginTop: 10,

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
  }
  
  
  
  
});
