import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ImageBackground,TouchableOpacity } from 'react-native';
import axios from 'axios';
import ProgressBar from '../../components/ProgressBar';

export default function Tribune({ route, navigation }) {
  const { selectedMatch } = route.params;
  const [stade, setStade] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tribunes, setTribunes] = useState([]);
  const [selectedTribune, setSelectedTribune] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stade data
        const idStade = selectedMatch.idStade
        const stadeResponse = await axios.get(`http://10.0.2.2:4000/api/stade/${idStade}`);
        const stadeData = stadeResponse.data;
        setStade(stadeData);

        // Fetch tribunes data
        const tribunesResponse = await axios.get(`http://10.0.2.2:4000/api/tribune/stade/${idStade}`);
        const tribunesData = tribunesResponse.data;
        setTribunes(tribunesData);
        setLoading(false);

      } catch (error) {
        console.error('Erreur lors de la récupération des informations :', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedMatch.idStade]);

  const handleNextButton = () => {
    navigation.navigate('Place', { selectedTribune: selectedTribune });
  }

  return (
    <ImageBackground source={require('../../assets/background.png')} style={styles.background}>
      <ScrollView>
        <ProgressBar currentPage={2} />
        <View style={styles.container}>
          {stade && (
            <View style ={styles.containerStade}>
              <Image source={require('../../assets/stade/stade_globale.png')}  style={styles.stadeImage} />
            </View>
          )}
          {tribunes.length > 0 && (
            <View style={styles.containerTribunes}>
              {tribunes.map((tribune, index) => (
                <TouchableOpacity 
                key={index} 
                onPress={() => selectedTribune!= tribune ? setSelectedTribune(tribune) : setSelectedTribune(null)}
                >
                  <View style={[styles.containerTribune, index !== tribunes.length - 1 && styles.separator, selectedTribune === tribune && styles.selectedTribune]}>
                    {selectedTribune == tribune &&(
                    <View style={styles.selectionIndicator} />
                    )}
                      <Text key={tribune.id} style={styles.textTribune}>{tribune.nom}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
      {selectedTribune && (
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNextButton}
            >
            <Text style={styles.nextButtonText}>Suivant</Text>
            </TouchableOpacity>
        )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    marginBottom: 55,
  },
  containerStade: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 10,
  },
  stadeImage: {
    width: 400,
    height: 400,
    borderRadius: 30,
  },
  containerTribunes:{
    justifyContent: 'start',
    backgroundColor: '#FFFFFF',
    borderRadius: 20, 
    paddingRight:15,
    paddingLeft:15,
    margin : 15,
  },
  containerTribune:{
    padding: 15,
    flexDirection: 'row',
    position: 'relative', 
  },
  textTribune:{
    fontSize:20,
    fontWeight:'bold'
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#CED0CE',
  },
  nextButton: {
    position: 'absolute',
    bottom: 80,
    right: 15,
    backgroundColor: '#008900',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 10,
    zIndex:4,
  },
  nextButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize:20,
  },
  selectedTribune: {
    shadowColor: '#000', 
    shadowOpacity: 0.25, 
    },
  selectionIndicator: {
    width: 7,
    backgroundColor: '#008900', 
    position: 'absolute', 
    top: 0,
    bottom: 0,
    left: 0, 
    marginBottom : 10,
    marginTop:10,
    marginRight:25,
    borderRadius:5,

  },

});
