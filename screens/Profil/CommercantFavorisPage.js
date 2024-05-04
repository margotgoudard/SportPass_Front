import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, ImageBackground, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { AntDesign } from '@expo/vector-icons';
import CommercantInfo from '../../components/CommercantInfo';

const CommercantFavoris = ({ route, navigation }) => {
  const { userId } = route.params;
  const [favorites, setFavorites] = useState([]);
  const [userInfo, setUserInfo] = useState();

  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    try {
        const userResponse = await axios.get(`http://10.0.2.2:4000/api/user/${userId}`);
        setUserInfo(userResponse.data);

        const favoritesResponse = await axios.get(`http://10.0.2.2:4000/api/avoirFavoris/user/${userId}`);
        const commercantsData = favoritesResponse.data;

        const updatedCommercants = await Promise.all(commercantsData.map(async (commercant) => {
            const cashbackResponse = await axios.get(`http://10.0.2.2:4000/api/cashbackCommercant/${commercant.idCashbackCommercant}`);
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
    }
};


const toggleFavorite = (commercant) => {
  try {
    if (commercant.isFavorite) {
      axios.delete(`http://10.0.2.2:4000/api/avoirFavoris/${commercant.idCommercant}/${userId}`);
    } else {
      axios.post(`http://10.0.2.2:4000/api/avoirFavoris`, {
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



  return (
    <ImageBackground source={require('../../assets/background.png')} style={styles.container}>
      <ScrollView>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonContainer}>
          <AntDesign name="arrowleft" size={26} color="#BD4F6C" />
        </TouchableOpacity>
        {favorites.map((favorite, index) => (
            <CommercantInfo
            key={favorite.idCommercant}
            selectedCommercant={favorite}
            toggleFavorite={toggleFavorite}
            />
        ))}
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
    marginTop: "8%",
  }
});

export default CommercantFavoris;
