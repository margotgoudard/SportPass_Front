import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ImageBackground, TouchableOpacity } from 'react-native';
import { downloadPdf } from '../../Service/pdf/pdfService';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


export default function ResumePage({ route }) {
  const { selectedMatch, selectedPlaces, selectedTribune, totalPrice } = route.params;
  const homeTeam = selectedMatch.EquipeDomicile;
  const awayTeam = selectedMatch.EquipeExterieure;
  const navigation = useNavigation(); 

  const handleDownload = () => {
    downloadPdf(pdfUrl); 
  };

  const formatTeamName = (teamName) => {
    return teamName
      .split(' ')
      .map((word) => word[0].toUpperCase())
      .join('');
  };

  const formatDate = (date) => {
    const months = [
      'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
      'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
    ];
    const dateObj = new Date(date);
    return `${dateObj.getDate()} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
  };

  
const getUserById = async () => {
  const idUser = await AsyncStorage.getItem('userId');
  try {
    const response = await axios.get(`http://10.0.2.2:4000/api/user/${idUser}`);
    return response.data;
  } catch (error) {
    console.error('Error getting user', error);
    return false; 
  }
};

const navigateToProfile = async () => {
  const user = await getUserById();        
  navigation.navigate('ProfilPage', { userData: user });
};

  return (
    <ImageBackground source={require('../../assets/background.png')} style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.thankYou}>Merci pour votre achat !</Text>
        <View style={styles.summaryContainer}>
          <Text style={styles.title}>Résumé de votre billet</Text>
          <View style={styles.ticketContainer}>
            <View style={styles.teamContainer}>
              <Text style={styles.teamName}>{formatTeamName(homeTeam.nom)}</Text>
              <Image source={{ uri: homeTeam.logo }} style={styles.logo} />
              <Text style={styles.vsText}>-</Text>
              <Image source={{ uri: awayTeam.logo }} style={styles.logo} />
              <Text style={styles.teamName}>{formatTeamName(awayTeam.nom)}</Text>
            </View>
            <Text style={styles.matchTime}>{formatDate(selectedMatch.date)} à {selectedMatch.heure_debut} - {selectedMatch.Stade.nom}</Text>
            <Text style={{ fontStyle: "italic" }}>{selectedPlaces.length} billet(s)</Text>
            {selectedPlaces.map((place, index) => (
              <Text key={index} style={{ fontWeight: "bold", fontSize: 15 }}>
                {selectedTribune.nom} - Rang {place.numRangee} - Siège {place.numero}
              </Text>
            ))}
            <View style={styles.totalPriceContainer}>
              <Text>Prix Total <Text style={styles.totalPrice}>{totalPrice}€</Text></Text>
            </View>
            <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
              <Feather name="download" size={24} color="#BD4F6C" />
              <Text style={styles.downloadText}>Télécharger mes billets</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.centeredText}>
          <Text style={styles.regularText}>Vos billets seront toujours accessibles sur </Text>
          <Text style={styles.profileText} onPress={() => navigateToProfile()}>
            votre profil
          </Text>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: "10%"
  },
  thankYou: {
    fontSize: 24,
    color: 'green',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  summaryContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    width: '100%',
    marginTop: "5%"
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    marginBottom: 10,
    marginLeft: 15
  },
  ticketContainer: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  teamContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    position: 'relative',
  },
  logo: {
    width: 40,
    height: 40,
    marginHorizontal: '4%',
    resizeMode: 'contain',
  },
  teamName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginHorizontal: 5,
  },
  vsText: {
    position: 'absolute',
    left: '50%',
    fontSize: 20,
    fontWeight: 'bold',
  },
  matchTime: {
    fontSize: 14,
    marginBottom: 10,
  },
  totalPriceContainer: {
    alignItems: 'flex-end',
  },
  totalPrice: {
    fontSize: 16,
    color: 'green',
    fontWeight: 'bold',
    marginLeft: 10
  },
  downloadButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  downloadText: {
    color: '#BD4F6C',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: "bold"
  },
  centeredText: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginTop: 10,
    flexWrap: "wrap"
  },
  profileText: {
    textDecorationLine: 'underline',
    color: '#BD4F6C',
    fontWeight: "bold",
    fontSize: 16
  },
  regularText: {
    textAlign: 'center',
    fontWeight: "bold",
    fontSize: 16
  }
});
