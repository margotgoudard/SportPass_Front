import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ImageBackground,TouchableOpacity } from 'react-native';
import axios from 'axios';
import ProgressBar from '../../components/ProgressBar';
import AppLoader from '../../components/AppLoader';
import LottieView from 'lottie-react-native';
import { MaterialIcons } from '@expo/vector-icons';


export default function Tribune({ route, navigation }) {
  const { selectedMatch } = route.params;
  const [stade, setStade] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tribunes, setTribunes] = useState([]);
  const [selectedTribune, setSelectedTribune] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const idStade = selectedMatch.idStade
        const stadeResponse = await axios.get(`http://sp.cluster-ig4.igpolytech.fr/api/stade/${idStade}`);
        const stadeData = stadeResponse.data;
        setStade(stadeData);

        const tribunesResponse = await axios.get(`http://sp.cluster-ig4.igpolytech.fr/api/tribune/stade/${idStade}`);
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

  const formatNom = (nom) => {
    let formattedNom = nom.toLowerCase();
    formattedNom = formattedNom.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    formattedNom = formattedNom.replace(/\s/g, "_");
    return formattedNom;
  };
  

  const handleNextButton = () => {
    navigation.navigate('Place', { selectedTribune: selectedTribune, selectedMatch });
  }

  const images = {
    stade_globale: require('../../assets/stade/stade_globale.png'),
    corbiere: require('../../assets/stade/corbiere.png'),
    aigoual : require('../../assets/stade/aigoual.png'),
    canigou : require('../../assets/stade/canigou.png'),
    cevennes : require('../../assets/stade/cevennes.png'),
    etang_de_thau : require('../../assets/stade/etang_de_thau.png'),
    gevaudan : require('../../assets/stade/gevaudan.png'),
    haut_languedoc : require('../../assets/stade/haut_languedoc.png'),
    larzac : require('../../assets/stade/larzac.png'),
    mediterranee : require('../../assets/stade/mediterannee.png'),
    minervoi : require('../../assets/stade/minervoi.png'),
    petite_camargue : require('../../assets/stade/petite_camargue.png'),
    roussillon : require('../../assets/stade/roussillon.png'),
  };

  if (loading) {
    return (
      <AppLoader/>
    );
  }
  

  return (
    <>
    <ImageBackground source={require('../../assets/background.png')} style={styles.background}>
      <View>
      <ProgressBar currentPage={2} />
      {stade && (
            <View>
            <TouchableOpacity style={styles.rotateButton} onPress={() => navigation.navigate('Visualisation3D')}>
            <MaterialIcons name="3d-rotation" size={40} color="#5D2E46"/>
          </TouchableOpacity>
            <View style ={styles.containerStade}>
              <Image source={selectedTribune ? images[formatNom(selectedTribune.nom)] : images['stade_globale']} style={styles.stadeImage} />
              <LottieView source={require('../../assets/loading_ball.json')}
                  style={{width: "100%", height: "100%", zindex:5, bottom:5,position:'absolute'
                }}
                  autoPlay
                  loop
                  />
            </View>
            </View>

          )}
      </View>
      <ScrollView>
        <View style={styles.container}>
          
          {tribunes.length > 0 && (
            <ScrollView>
              <View style={styles.containerTribunes}>
                {tribunes.map((tribune, index) => (
                  <TouchableOpacity 
                    key={index}  
                    onPress={() => selectedTribune == tribune ? setSelectedTribune(null) : setSelectedTribune(tribune) }
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
            </ScrollView>

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
    </>
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
    zIndex:1,
  },
  containerStade: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  stadeImage: {
    width: 350,
    height: 350,
    borderRadius: 20,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    marginTop: 10,
    zIndex:5,
    bottom:0,
    right: 0,
  },
  
  containerTribunes:{
    justifyContent: 'start',
    backgroundColor: '#FFFFFF',
    borderRadius: 20, 
    paddingRight:15,
    paddingLeft:15,
    marginRight : 20,
    marginLeft : 20,
    marginBottom : 20,
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
  rotateButton: {
    position: 'absolute',
    top: -50,
    right: 5,
    zIndex: 6,
    borderRadius: 20,
    padding: 10,
  },

});
