import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import LottieView from 'lottie-react-native';
import AppLoader from '../../components/AppLoader';
import axios from 'axios'; 
import ProgressBar from '../../components/ProgressBar';
import { MaterialIcons } from '@expo/vector-icons';

export default function PlacePage({ route }) {
  const { selectedTribune } = route.params;
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placesByRow, setPlacesByRow] = useState([]);
  const [tickets, setTickets] = useState([]);


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
        
        // Fetch tickets for all places
        const ticketResponse = await Promise.all(
          placesData.map((place) => axios.get(`http://10.0.2.2:4000/api/billet/place/${place.idPlace}`))
        );
        const ticketData = ticketResponse.map((response) => response.data).flat();
        console.log('réponse2',ticketData);
  
        // Map tickets to placeId for quick lookup
        const ticketMap = {};
        ticketData.forEach((ticket) => {
          ticketMap[ticket.idPlace] = ticket;
        });
  
        // Populate placesByRowData with reservation info
        placesData.forEach((place) => {
          const rowId = place.idRangee;
          if (!placesByRowData[rowId]) {
            placesByRowData[rowId] = [];
          }
          
          const ticket = ticketData.find((ticket) => ticket.idPlace == place.idPlace);
          //console.log('ticket',ticket);
          const isReserved = ticket && ticket.reservee == 1;
          //console.log(isReserved);
          
          placesByRowData[rowId].push({ ...place, isReserved });
        });
        
        console.log(placesByRowData);

        setPlacesByRow(placesByRowData);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des places :', error);
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedTribune]);
  

   const getreservee = (billet) => {
    return billet.reservee == 1 ? 'green' : 'red';
  };

  const getTicketByPlaceId = (placeId) => {
    return tickets.find((ticket) => ticket.idPlace = placeId);
  };

  const handlePlaceSelection = (place) => {
    const isSelected = selectedPlaces.some((selectedPlace) => selectedPlace.idPlace === place.idPlace);
    if (isSelected) {
      const filteredPlaces = selectedPlaces.filter((selectedPlace) => selectedPlace.idPlace !== place.idPlace);
      setSelectedPlaces(filteredPlaces);
    } else {
      setSelectedPlaces([...selectedPlaces, place]);
    }
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
                    styles.place, 
                    selectedPlaces.some((selectedPlace) => selectedPlace.idPlace === place.idPlace) && styles.selectedPlace
                  ]}
                  onPress={() => handlePlaceSelection(place)}
                >
                   {place.isReserved ? ( 
                      <MaterialIcons 
                        name="chair" 
                        size={24} 
                        color='green'
                      />
                    ) : (
                      <MaterialIcons 
                        name="chair" 
                        size={24} 
                        color='red'
                      />
                    )}
                  
                </TouchableOpacity>
              ))}
            </View>
            
          </View>
          
        ))}
        </View>
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
  rowHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    marginTop: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent:'center',
  },
  place: {
    margin: 5,
    backgroundColor: 'lightgrey',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedPlace: {
    backgroundColor: 'blue',
  },
});
