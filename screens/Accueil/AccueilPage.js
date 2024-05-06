import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, ScrollView } from 'react-native';
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
            <ScrollView>

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
                        <Text style={styles.title}>À la Une</Text>
                        <ScrollView horizontal={true}>
                        {alaUnePublications.map((publication, index) => (
                                <View key={index}>
                                    <Image 
                                        source={{ uri: publication.image }}
                                        style={styles.publicationImage} 
                                    />
                                </View>
                        ))} 
                        </ScrollView>

                    </View>
                )}

            </View>
            </ScrollView>
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
    },
    bienvenue: {
        fontSize: 20,
        position:'absolute',
        marginLeft:20,
        fontWeight: 'bold',
    },
    publicationsContainer: {
        marginTop: 30,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    publicationImage: {
        width: 100,
        height: 100,
        marginRight : 10,
    },
});
