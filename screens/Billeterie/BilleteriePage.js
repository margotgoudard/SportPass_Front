import React, { useState, useEffect } from 'react';
import { View, Text, Image,StyleSheet,ScrollView,ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Checkbox from '../../components/Checkbox';
import ProgressBar from '../../components/ProgressBar';
import { Ionicons } from '@expo/vector-icons';


export default function Billeterie({ navigation}){
    const [matchs, setMatchs] = useState([]);
    const [matchsUser, setMatchsUser] = useState([]);
    const [matchsUserId, setMatchsUserId] = useState([]);

    const [loading, setLoading] = useState(true);
    const [showAllMatches, setShowAllMatches] = useState(false);


    const formateDate = (dateString) => {
        const dateObj = new Date(dateString);
        const mois = [
          "janv.",
          "févr.",
          "mars",
          "avr.",
          "mai",
          "juin",
          "juil.",
          "août",
          "sept.",
          "oct.",
          "nov.",
          "déc.",
        ];
      
        const jour = dateObj.getDate();
        const moisIndex = dateObj.getMonth();
        const dateFormatee = `${jour} ${mois[moisIndex]}`;
        return dateFormatee;
      }

      const formateHeure = (heureString) => {
        const [heure, minutes] = heureString.split(':');
        const heureFormatee = `${heure}h${minutes}`;
        return heureFormatee;
      };
      
      

      useEffect(() => {
        const fetchMatchs = async () => {
          try {
            const userId = await AsyncStorage.getItem('userId');
            const response = await axios.get(`http://10.0.2.2:4000/api/user/${userId}`);
            const userData = response.data;

            const matchResponse = await axios.get('http://10.0.2.2:4000/api/matchs');
            const allMatchs = matchResponse.data;
            setMatchs(allMatchs);

            const filteredMatchs = allMatchs.filter(match => showAllMatches || match.idEquipeDomicile === userData.Equipe.idEquipe || match.idEquipeExterieure === userData.Equipe.idEquipe);
            setMatchsUserId(allMatchs.filter(match => match.idEquipeDomicile === userData.Equipe.idEquipe || match.idEquipeExterieure === userData.Equipe.idEquipe));

            setMatchsUser(filteredMatchs);
            setLoading(false);

          } catch (error) {
            console.error('Erreur lors de la récupération des matchs :', error);
            setLoading(false);
          }
        };
    
        fetchMatchs();
      }, [showAllMatches]);

    if (loading) {
        return (
            <View>
                <Text>Chargement en cours...</Text>
            </View>
        );
    }

    return (
        <ImageBackground source={require('../../assets/background.png')} style={styles.background}>
        <ScrollView>
        <ProgressBar currentPage={1} />
            <Checkbox 
            text="Voir tous les matchs" 
            isChecked={showAllMatches} 
            onPress={()=> setShowAllMatches(!showAllMatches)}
            container = {styles.checkbox}
            />
        
        {matchsUser
        .sort((a, b) => {
            //trie des matchs par ordre chronologique
            const dateA = new Date(a.date + 'T' + a.heure_debut);
            const dateB = new Date(b.date + 'T' + b.heure_debut);
        
            if (dateA < dateB) return -1;
            if (dateA > dateB) return 1;
        
            const heureA = a.heure_debut.split(':').map(Number);
            const heureB = b.heure_debut.split(':').map(Number);
        
            if (heureA[0] < heureB[0]) return -1;
            if (heureA[0] > heureB[0]) return 1;
        
            if (heureA[1] < heureB[1]) return -1;
            if (heureA[1] > heureB[1]) return 1;
        
            return 0;
        })
              
        .map((matchItem, index) => (
            <View key={index} style={[styles.container, matchsUserId.includes(matchItem) ? styles.newMatch : null]}>
            <View style={styles.teamContainerDomicile}>
                <Text style={styles.teamNameDomicile}>{matchItem.EquipeDomicile.nom}</Text>
                <Image 
                    source={{ uri: matchItem.EquipeDomicile.logo }}
                    style={styles.teamLogoDomicile} 
                />
    
    
            <View style={styles.dateContainer}>
                <Text style={styles.time}>
                        {formateHeure(matchItem.heure_debut)}
                </Text>
                <Text style={styles.date}>
                    {formateDate(matchItem.date)}
                </Text>
            </View>
    
    
            <View style={styles.teamContainerExterieur}>
                <Image
                    source={{ uri: matchItem.EquipeExterieure.logo }}
                    style={styles.teamLogoExterieur} 
                />
                <Text style={styles.teamNameExterieur}>{matchItem.EquipeExterieure.nom}</Text>
                </View>
            </View>
    
        <View style={styles.billetterie}>
            {matchItem.billeterieOuverte == 1 ? (
                <Ionicons name="lock-open" size={16} color="#008900" />
            ) : (
                <Ionicons name="lock-closed" size={16} color="#5D2E46" />            
                )}
        </View>
    </View>


        ))}
      </ScrollView>
      </ImageBackground>

    ) 
};
const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    checkbox:{
        marginHorizontal:10,
        margin:35,
    },
    container: {
        padding: 15,
        borderRadius: 20, 
        backgroundColor: '#D9D9D9',
        margin : 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:'center'
    },
    newMatch: {
        padding: 15,
        borderRadius: 20, 
        backgroundColor: '#FFFFFF',
        margin : 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:'center',
        shadowColor: '#000', 
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25, 
            shadowRadius: 3.84, 
            elevation: 5, 
    },
    teamContainerDomicile: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    teamLogoDomicile: {
        width: 50,
        height: 50,
        marginRight : 10,
    },
    teamNameDomicile: {
        marginLeft: 10,
        fontWeight: 'bold', 
        marginRight: 10,
    },
    teamContainerExterieur: {
        flexDirection: 'row',
        alignItems: 'center',
    },    
    teamLogoExterieur: {
        width: 50,
        height: 50,
        marginLeft: 10, 
    },
    teamNameExterieur: {
        marginLeft: 10,
        fontWeight: 'bold',
        textAlign: 'right', 
    },
    dateContainer: {
        justifyContent: 'center',

    },
    date: {
        textAlign: 'center',
        color: '#5C5C5C', 

    },
    time: {
        textAlign: 'center',
        fontWeight: 'bold', 
        color:'#BD4F6C',

    },
    billetterie: {
        marginTop: 10,
    },
    billetterie: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        marginRight: 10, 
        marginBottom: 10,
    },
    
});