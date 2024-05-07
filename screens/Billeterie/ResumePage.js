import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ImageBackground } from 'react-native';
import { downloadPdf } from '../../Service/pdf/pdfService';

export default function ResumePage({ route }) {
  const { selectedMatch, selectedPlaces, selectedTribune, totalPrice } = route.params;
  const homeTeam = selectedMatch.EquipeDomicile;
  const awayTeam = selectedMatch.EquipeExterieure;

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
            <TouchableOpacity onPress={handleDownload}>
              <Text>Télécharger mes billets</Text>
            </TouchableOpacity>
          </View>
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
    borderRadius: 5,
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
    marginLeft: 5
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
  },
});
