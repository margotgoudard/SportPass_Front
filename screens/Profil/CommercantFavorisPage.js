import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, ImageBackground, Alert, TouchableOpacity, Text } from 'react-native';
import axios from 'axios';
import { AntDesign } from '@expo/vector-icons';
import CommercantInfo from '../../components/CommercantInfo';
import URLS from '../../urlConfig.js';
import AppLoader from '../../components/AppLoader.js';

const CommercantFavoris = ({ route, navigation }) => {
  const { userId } = route.params;
  const [favorites, setFavorites] = useState([]);
  const [userInfo, setUserInfo] = useState();
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    try {
        const userResponse = await axios.get(`${URLS.url}/user/${userId}`);
        setUserInfo(userResponse.data);

        const favoritesResponse = await axios.get(`${URLS.url}/avoirFavoris/user/${userId}`);
        const commercantsData = favoritesResponse.data;

        const updatedCommercants = await Promise.all(commercantsData.map(async (commercant) => {
            const cashbackResponse = await axios.get(`${URLS.url}/cashbackCommercant/${commercant.idCashbackCommercant}`);
            return {
                ...commercant,
                isFavorite: true,
                cashback: cashbackResponse.data.montant
            };
        }));

        setFavorites(updatedCommercants);
    } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert("Erreur", "Impossible de charger les données.");
  } finally {
    setLoading(false);
  }
};


const toggleFavorite = (commercant) => {
  try {
    if (commercant.isFavorite) {
      axios.delete(`${URLS.url}/avoirFavoris/${commercant.idCommercant}/${userId}`);
    } else {
      axios.post(`${URLS.url}/avoirFavoris`, {
        idUser: userId,
        idCommercant: commercant.idCommercant
      });
    }
    commercant.isFavorite = !commercant.isFavorite; 
    setFavorites([...favorites]); 
  } catch (error) {
    console.error('Error updating favorite status:', error);
  }
};
  if (loading) {
    return (
        <AppLoader/>
    );
  }


  return (
    <ImageBackground source={require('../../assets/background.png')} style={styles.container}>
      <ScrollView>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonContainer}>
          <AntDesign name="arrowleft" size={26} color="#BD4F6C" />
        </TouchableOpacity>
        {favorites.length > 0 ? (
        favorites.map((favorite, index) => (
            <CommercantInfo
            key={favorite.idCommercant}
            selectedCommercant={favorite}
            toggleFavorite={toggleFavorite}
            />
        ))
      ) : (
        <Text style={styles.noAbonnementText}>Pas de favoris.</Text>
      )}
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButtonContainer: {
    marginLeft: "4%",
    marginTop: "12%",
  },
  noAbonnementText: {
    textAlign: 'center',
    marginTop: 20,
  },
});

export default CommercantFavoris;
