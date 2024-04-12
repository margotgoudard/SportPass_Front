import React, { useState, useEffect } from 'react';
import { View, Text, Image,StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Checkbox from '../../components/Checkbox';

export default function Billeterie({ navigation}){
    const [matchs, setMatchs] = useState([]);
    const [matchsUser, setMatchsUser] = useState([]);
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
        <View>
            <Checkbox 
            text="Voir tous les matchs" 
            isChecked={showAllMatches} 
            onPress={()=> setShowAllMatches(!showAllMatches)}
            container = {styles.checkbox}
            />
            

        <Text>Liste des matchs :</Text>
        
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
            <View key={index}>
            <Text>ID du match : {matchItem.idMatch}</Text>
            <Image
                source={{ uri: matchItem.EquipeDomicile.logo }}
                style={{ width: 50, height: 50 }} 
            />
            <Text>Equipe domicile : {matchItem.EquipeDomicile.nom}</Text>

            <Text>{formateHeure(matchItem.heure_debut)}</Text>
            <Text>{formateDate(matchItem.date)}</Text>


            <Image
                source={{ uri: matchItem.EquipeExterieure.logo }}
                style={{ width: 50, height: 50 }} 
            />
            <Text>Équipe externe : {matchItem.EquipeExterieure.nom}</Text>

            <Text>Billetterie : {matchItem.billeterieOuverte==1 ? 'Ouverte' : 'Fermée'}</Text>

            </View>
        ))}
      </View>
    ) 
};
const styles = StyleSheet.create({
    checkbox:{
        marginHorizontal:10,
        marginVertical:5,
    },
});