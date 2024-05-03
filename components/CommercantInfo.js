import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const CommercantInfo = ({ selectedCommercant, toggleFavorite }) => {

    if (!selectedCommercant) {
        return (
          <View style={styles.container}>
            <Text style={styles.infoText}>Veuillez sélectionner un commerçant</Text>
          </View>
        );
      }

  return (
    <View style={styles.infoContainer}>
      <View style={styles.commercantDetails}>
        <Image
          source={{ uri: selectedCommercant.image }}
          style={styles.commercantImage}
        />
        <View style={styles.commercantText}>
          <Text style={styles.commercantName}>{selectedCommercant.nom}</Text>
          <Text style={styles.italicText}>{`+ 33 ${selectedCommercant.tel}`}</Text>
          <Text style={styles.italicText}>{selectedCommercant.adresse}</Text>
          <View style={styles.cashbackContainer}>
            <MaterialCommunityIcons name="flag-checkered" size={24} color="#008900" style={styles.palierImage} />
            <Text style={styles.commercantCashback}>{`Cashback : ${selectedCommercant.cashback}%`}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.favoriteIcon} onPress={() => toggleFavorite(selectedCommercant)}>
          {selectedCommercant.isFavorite ? (
            <FontAwesome name="heart" size={22} color="#BD4F6C" />
          ) : (
            <FontAwesome5 name="heart" size={22} color="white" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    padding: 10,
    margin: 10,
    backgroundColor: '#D9D9D9',
    borderRadius: 10,
    flexDirection: 'row',
  },
  container: {
    padding : 60,
    margin : 10,
    borderRadius: 10,
    backgroundColor: '#D9D9D9'
  },
  infoText: {
    fontSize: 15, 
    fontStyle: 'italic',
    color: '#444', 
  },
  commercantDetails: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cashbackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    },
  commercantImage: {
    width: 150,
    height: 110,
    marginRight: 20 
  },
  commercantText: {
    flex: 1,
    flexDirection: 'column', 
  },
  commercantName: {
    fontWeight: 'bold',
    fontSize: 16
  },
  commercantCashback: {
    color: '#008900',
    fontSize: 16,
    fontWeight: "bold"
  },
  palierImage: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  favoriteIcon: {
    position: 'absolute',
    top: 1,
    right: 4
  },
  italicText: {
    fontStyle: 'italic', 
  },
});

export default CommercantInfo;
