import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function Accueil({ navigation }) {
    const [userFirstName, setUserFirstName] = useState(null);
    const [alaUnePublications, setAlaUnePublications] = useState([]);


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userId = await AsyncStorage.getItem('userId');
                const response = await axios.get(`http://10.0.2.2:4000/api/user/${userId}`);

                const user = response.data;
                setUserFirstName(user.prenom);
            } catch (error) {
                console.error('Erreur lors de la récupération des informations de l\'utilisateur :', error);
            }
        };

        const fetchAlaUnePublications = async () => {
            try {
                const userId = await AsyncStorage.getItem('userId');
                const response = await axios.get(`http://10.0.2.2:4000/api/user/${userId}`);
                
                const user = response.data;
                const idEquipe = user.idEquipe; 

                const alaUneResponse = await axios.get(`http://10.0.2.2:4000/api/publicationClub/equipe/${idEquipe}/alaUne`);
                const alaUnePublications = alaUneResponse.data;
                setAlaUnePublications(alaUnePublications);
            } catch (error) {
                console.error('Erreur lors de la récupération des publications à la une :', error);
            }
        };

        fetchUserData();
        fetchAlaUnePublications();
    }, []); 

    return (
        <ImageBackground source={require('../../assets/background.png')} style={styles.background}>
            <View style={styles.logoContainer}>
                <Image source={require('../../assets/logo.png')} style={styles.logo} />
            </View>
            <View style={styles.container}>
                {userFirstName && (
                    <Text style={styles.bienvenue}>
                        Bonjour, {userFirstName} !
                    </Text>
                )}

                {alaUnePublications.length > 0 && (
                    <View style={styles.publicationsContainer}>
                        <Text style={styles.title}>Publications à la Une</Text>
                        {alaUnePublications.map((publication, index) => (
                            <Text key={index}>{publication.contenu}</Text>
                        ))}
                    </View>
                )}

            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    logoContainer: {
        justifyContent: 'flex-start', 
        alignItems: 'flex-start',
        marginTop:20, 
        marginLeft:15,       
      },
   
    container: {
        flex: 1,
        justifyContent: 'flex-start', 
        alignItems: 'flex-start',
    },
    bienvenue: {
        fontSize: 20,
        position:'absolute',
        marginLeft:20,
        fontWeight: 'bold',
    },
});
