import React, { useState, useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function Billeterie({ navigation}){
    const [matchs, setMatchs] = useState([]);
    const [matchsUser, setMatchsUser] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAllMatches, setShowAllMatches] = useState(true);


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
            

        <Text>Liste des matchs :</Text>
        {matchsUser.map((matchItem, index) => (
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
}