import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ImageBackground, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const CommercantFavoris = ({ route, navigation }) => {
  const { userId } = route.params;
  const [favorites, setFavorites] = useState([]);
  const [userInfo, setUserInfo] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.get(`http://10.0.2.2:4000/api/user/${userId}`);
        setUserInfo(userResponse.data);
        console.log(userInfo)

        const favoritesResponse = await axios.get(`http://10.0.2.2:4000/api/avoirFavoris/user/${userId}`);
        setFavorites(favoritesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert("Erreur", "Impossible de charger les données.");
      }
    };

    fetchData();
  }, [userId]);

  return (
    <ImageBackground source={require('../../assets/background.png')} style={styles.container}>
      <ScrollView>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonContainer}>
          <AntDesign name="arrowleft" size={26} color="#BD4F6C" />
        </TouchableOpacity>
        {favorites.map((favorite, index) => (
          <View key={index} style={styles.favoriteItem}>
            <Image source={require('../../assets/boucherie.png')} style={styles.image} />
            <View style={styles.infoContainer}>
              <Text style={styles.name}>{favorite.nom}</Text>
              <Text style={styles.address}>{favorite.adresse}</Text>
              <Text style={styles.phone}>{favorite.tel}</Text>
              <View style={styles.cashbackContainer}>
              <MaterialCommunityIcons name="flag-checkered" size={24} color="green" style={styles.palierImage} />
                <Text style={styles.cashbackText}>Cashback : {userInfo.Palier.cashbackPalier}%</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  favoriteItem: {
    backgroundColor: '#D9D9D9',
    borderRadius: 10,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 20,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  address: {
    fontSize: 16,
    marginTop: 5,
  },
  phone: {
    fontSize: 16,
    marginTop: 5,
  },
  backButtonContainer: {
    marginLeft: "4%",
    marginTop: "8%",
  },
  cashbackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  palierImage: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  cashbackText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "green"
  },
});

export default CommercantFavoris;
