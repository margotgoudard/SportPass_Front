import React, {useState,useEffect} from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import LottieView from 'lottie-react-native';
import AppLoader from '../../components/AppLoader';
import axios from 'axios'; 
import ProgressBar from '../../components/ProgressBar';


export default function PlacePage({route}){
const { selectedTribune } = route.params;
const [selectedPlace, setSelectedPlace] = useState(null);
const [loading, setLoading] = useState(true);
const [places, setPlaces] = useState([]);
const [tickets, setTickets] = useState([]);


useEffect(() => {
  const fetchData = async () => {
    try {
      const rangeeResponse = await axios.get(`http://10.0.2.2:4000/api/rangee/tribune/${selectedTribune.idTribune}`);
      const rangees = rangeeResponse.data;
      //console.log(rangees);

      const placesResponse = await Promise.all(
        rangees.map((rangee) => axios.get(`http://10.0.2.2:4000/api/place/rangee/${rangee.idRangee}`))
      );
      const placesData = placesResponse.map((response) => response.data);
      //console.log(placesData);

      const allPlaces = placesData.flat();
      //console.log(allPlaces);
      setPlaces(allPlaces);

      const ticketResponse = await Promise.all(
        allPlaces.map((place)=> axios.get(`http://10.0.2.2:4000/api/billet/place/${place.idPlace}`))
      );
      const ticketData = ticketResponse.map((response) => response.data);
      console.log(ticketData);

      setTickets(ticketData);

      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des places :', error);
      setLoading(false);
    }
  };
  fetchData();
  }, [selectedTribune]);


  if (loading) {
    return (
        <AppLoader/>
    );
  }

  return (
    <ImageBackground source={require('../../assets/background.png')} style={styles.background}>
      <ScrollView>
        <ProgressBar currentPage={3} />
      {places.map((place,index) => (
        <TouchableOpacity
          key={index}
          style={[styles.place, selectedPlace === index && styles.selectedPlace]}
          onPress={() => setSelectedPlace(place)}
        >
          <Text>Rang {place.idRangee} - Siège {place.numero}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
    </ImageBackground>
  );
  };

  const styles = StyleSheet.create({
    background: {
      flex: 1,
      resizeMode: 'cover',
      justifyContent: 'center',
    },
    container: {
      padding: 20,
    },
    place: {
      padding: 10,
      marginVertical: 5,
      backgroundColor: 'lightgrey',
      borderRadius: 5,
    },
    selectedPlace: {
      backgroundColor: 'blue',
    },
  });