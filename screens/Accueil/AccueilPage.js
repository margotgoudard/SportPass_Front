import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons, Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';

export default function Accueil({ navigation }) {
    const [userFirstName, setUserFirstName] = useState(null);
    const [userPalier, setUserPalier] = useState(null);
    const [alaUnePublications, setAlaUnePublications] = useState([]);
    const scrollViewRef = useRef(null);


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userId = await AsyncStorage.getItem('userId');
                const response = await axios.get(`http://10.0.2.2:4000/api/user/${userId}`);
                const user = response.data;
                setUserFirstName(user.prenom);
                setUserPalier(user.Palier?.nom);

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

    const scrollToPublication = (index) => {
        if (scrollViewRef.current) {
            const offset = index * (342 + 15); 
            scrollViewRef.current.scrollTo({ x: offset, animated: true });
        }
    };

    const handleBilletteriePress = () => {
        navigation.navigate('Navbar', {screen:'Billeterie'});
    };
    

    return (
        <ImageBackground source={require('../../assets/background.png')} style={styles.background}>
            <ScrollView>
                <View style={styles.logoContainer}>
                    <Image source={require('../../assets/logo.png')} style={styles.logo} />
                </View>
                <View style={styles.container}>
                    {userFirstName && (
                        <View>
                        <Text style={styles.bienvenue}>
                            Bonjour, {userFirstName} !
                        </Text>
                        <View style={styles.vipStatusContainer}>
                        <Text style={styles.vipStatus}> {userPalier} </Text>
                        <MaterialCommunityIcons name="flag-checkered" size={30} color="#008900" style={styles.palierImage} />
                        </View>
                        </View>
                    )}
                    {alaUnePublications.length > 0 && (
                        <View style={styles.uneContainer}>
                            <View style={styles.publicationsContainer}>
                                <Text style={styles.title}>À la Une</Text>
                                <ScrollView 
                                    horizontal={true}
                                    ref={scrollViewRef}
                                    pagingEnabled={true}
                                >
                                    {alaUnePublications.map((publication, index) => (
                                        <View key={index} style={styles.imageContainer}>
                                            <Image 
                                                source={{ uri: publication.image }}
                                                style={styles.publicationImage} 
                                            />
                                        </View>
                                    ))} 
                                </ScrollView>
                            </View>
                            <View style={styles.bandeau}></View>
                            <View style={styles.pointsContainer}>
                                {alaUnePublications.map((publication, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.pointNavigation}
                                        onPress={() => scrollToPublication(index)}
                                    >
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}
                    <TouchableOpacity style={styles.rectangleContainer} onPress={handleBilletteriePress}>
                        <View style={styles.greenRectangle}>
                            <Text style={styles.greenText}>1 000 €</Text>
                        </View>
                        <View style={styles.whiteRectangle}>
                        <Image source={require('../../assets/logo_carre.png')} style={styles.logoInRectangle} />

                            <Text style={styles.whiteText}> à gagner à chaque mi-temps ! </Text>
                            <Text style={styles.whiteText2}> Tente ta chance en prenant ton billet sur SportPass </Text>                            
                        </View>
                    </TouchableOpacity>
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
        marginTop: 20, 
        marginLeft: 15,       
    },
    container: {
        flex: 1,
    },
    bienvenue: {
        fontSize: 20,
        position: 'absolute',
        marginLeft: 15,
        fontWeight: 'bold',
    },
    publicationsContainer: {
        marginTop: 30,
        zIndex: 1, 
    },
    title: {
        fontSize: 18,
        marginBottom: 10,
        marginLeft: 15,
    },
    imageContainer: {
        marginLeft: 15,
        borderRadius: 10,
        overflow: 'hidden', 
        position: 'relative', 
    },
    publicationImage: {
        width: 342,
        height: 207,
    },
    bandeau: {
        backgroundColor: '#D9D9D9',
        height: 100, 
        position: 'absolute',
        bottom: 75, 
        left: 0,
        right: 0,
        zIndex: 0, 
    },
    uneContainer: {
        position: 'relative',
    },
    pointsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    pointNavigation: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'grey',
        marginHorizontal: 5,
        flexDirection:'row',
        marginHorizontal:2,
    },
    vipStatusContainer: {
        position: 'absolute',
        top: 0,
        right: 20,
        flexDirection: 'row',
        position:'absolute',
      },
      vipStatus: {
        color: '#008900',
        fontWeight: 'bold',
        fontSize: 20,
        marginLeft: 5,
        marginTop:1, 
      },
      rectangleContainer: {
        alignItems: 'center',
        marginTop: 10,
        paddingHorizontal: 5,
    },
    greenRectangle: {
        width: '99%',
        height: 40,
        backgroundColor: 'green',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        borderWidth: 5, 
        borderColor: 'white', 
        position: 'relative', 
    },
    logoInRectangle: {
        position: 'absolute',
        top: -34, 
        left: 5, 
        width: 71*0.9, 
        height: 66*0.9, 
    },
    whiteRectangle: {
        width: '99%',
        height: 50,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
    },
    greenText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 25,
    },
    whiteText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 17,
    },
    whiteText2: {
        color: 'black',
        fontStyle: 'italic',
    },
});
