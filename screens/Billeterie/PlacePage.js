import React, {useState,useEffect} from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import AppLoader from '../../components/AppLoader';
import axios from 'axios'; 

export default function PlacePage({route}){
const { selectedTribune } = route.params;
const [selectedPlace, setSelectedPlace] = useState(null);
const [loading, setLoading] = useState(true);
const [places, setPlaces] = useState([]);

useEffect(() => {
  const fetchData = async () => {
    try {
      const rangeeResponse = await axios.get(`http://10.0.2.2:4000/api/rangee/tribune/${selectedTribune.id}`);
      const rangees = rangeeResponse.data;

      const placesResponse = await Promise.all(
        rangees.map((rangee) => axios.get(`http://10.0.2.2:4000/api/place/rangee/${rangee.id}`))
      );
      const placesData = placesResponse.map((response) => response.data);

      const allPlaces = placesData.flat();
      setPlaces(allPlaces);
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
    <ScrollView contentContainerStyle={styles.container}>
      {places.map((place) => (
        <TouchableOpacity
          key={place.id}
          style={[styles.place, selectedPlace === place.id && styles.selectedPlace]}
          onPress={() => setSelectedPlace(place.id)}
        >
          <Text>{place.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
  };

  const styles = StyleSheet.create({
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