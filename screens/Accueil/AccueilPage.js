import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, ScrollView, TouchableOpacity,Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import URLS from '../../urlConfig.js';
import CustomRemainingAmountBar from '../../components/Accueil/CustomRemainingAmountBar';
import AppLoader from '../../components/AppLoader';
import Video2 from '../../components/Accueil/Video.js';

export default function Accueil({ navigation }) {

    const [userFirstName, setUserFirstName] = useState(null);
    const [userPalier, setUserPalier] = useState(null);
    const [userPalierPourcentage, setUserPalierPourcentage] = useState(null);
    const [userAmount, setUserAmount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [alaUnePublications, setAlaUnePublications] = useState([]);
    const [partenaires, setPartenaires] = useState([]);
    const [paliers, setPaliers] = useState([]);
    const [connected, setConnected] = useState(false);

    const scrollViewRef = useRef(null);


    useEffect(() => {

        const fetchUserData = async () => {
            try {
                const userId = await AsyncStorage.getItem('userId');
                if (!userId) {
                    setConnected(false);
                    return;
                }

                setConnected(true);

                const response = await axios.get(`${URLS.url}/user/${userId}`);
                const user = response.data;
                setUserFirstName(user.prenom);
                setUserPalier(user.Palier?.nom);
                setUserAmount(user.somme);
                setUserPalierPourcentage(user.Palier?.cashbackPalier);
            } catch (error) {
                console.error('Erreur lors de la récupération des informations de l\'utilisateur :', error);
            }
        };

        const fetchAlaUnePublications = async () => {
            try {
                const userId = await AsyncStorage.getItem('userId');
                if (!userId) {
                    const alaUneResponse = await axios.get(`${URLS.url}/publicationClub/alaUne`);
                    const alaUnePublications = alaUneResponse.data;
                    setAlaUnePublications(alaUnePublications);

                    const response = await axios.get('http://10.0.2.2:4000/api/partenaire');
                    const partenairesData = response.data;
                    setPartenaires(partenairesData);
                    return;
                }

                const response = await axios.get(`${URLS.url}/user/${userId}`);
                const user = response.data;
                const idEquipe = user.idEquipe; 

                const alaUneResponse = await axios.get(idEquipe ? `${URLS.url}/publicationClub/equipe/${idEquipe}/alaUne` : `${URLS.url}/publicationClub/alaUne`);
                const alaUnePublications = alaUneResponse.data;
                setAlaUnePublications(alaUnePublications);
            } catch (error) {
                console.error('Erreur lors de la récupération des publications à la une :', error);
            }
        };

        const fetchPartenaires = async () => {
            try {
                const response = await axios.get(`${URLS.url}/partenaire`);
                const partenairesData = response.data;
                setPartenaires(partenairesData);
            } catch (error) {
                console.error('Erreur lors de la récupération des partenaires :', error);
            }
        };

        const fetchPaliers = async () => {
            try {
                const userId = await AsyncStorage.getItem('userId');
                if (!userId) {
                    return;
                }

                const response = await axios.get(`${URLS.url}/palier`);
                const paliersData = response.data;
                setPaliers(paliersData);
            } catch (error) {
                console.error('Erreur lors de la récupération des paliers :', error);
            }
        };

        setLoading(false);

        fetchUserData();
        fetchAlaUnePublications();
        fetchPartenaires();
        fetchPaliers();
    }, [connected]); 

    const scrollToPublication = (index) => {
        if (scrollViewRef.current) {
            const offset = index * (342 + 15); 
            scrollViewRef.current.scrollTo({ x: offset, animated: true });
        }
    };

    const handleBilletteriePress = () => {
        navigation.navigate('Navbar', {screen:'Billeterie'});
    };

    const handlePartenairePress = (siteUrl) => {
        Linking.openURL(siteUrl);
    };

    const calculateRemainingAmount = (userAmount) => {
        const currentPalier = paliers.find((palier) => userAmount < palier.montantMin);
    
        if (currentPalier) {
            const nextPalierAmount = currentPalier.montantMin;
            const remainingAmount = nextPalierAmount - userAmount;
            const nextPalierName = currentPalier.nom;
            return { remainingAmount, nextPalierName };
        } else {
            return { remainingAmount: 0, nextPalierName: '' };
        }
    };
    
    if (loading) {
        return (
        <AppLoader/>
        );
    }
    

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
                                    {alaUnePublications.map((post, index) => (
                                            <View key={index} style={styles.imageContainer}>
                                                <TouchableOpacity onPress={() => navigation.navigate('Navbar', {
                                                    screen: 'Forum',
                                                    params: { screen: 'PostClubDetails', params: { post } }
                                                    })}>
                                                <Text style={styles.postContent}>{post.contenu}</Text>

                                                <Image
                                                    source={{ uri: post.image }}
                                                    style={styles.publicationImage} 
                                                />

                                                </TouchableOpacity>
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


                    {userPalier && (
                        <View style={styles.remainingAmountContainer}>
                        <View style={styles.cashbackContainer}>
                            <Text style={styles.cashbackText}>Cashback</Text>
                            {userAmount !== null && (
                                <Text style={styles.userAmountText}>{userAmount} €</Text>
                            )}
                        </View>
                        <View style={styles.vipStatusCashbackContainer}>
                            <MaterialCommunityIcons name="flag-checkered" size={30} color="black" style={styles.palierImageCashback} /> 
                            <Text style={styles.vipStatusCashback}>
                                {userPalier} : {userPalierPourcentage ? `${(userPalierPourcentage * 100).toFixed(0)}%` : ''}
                            </Text>
                        </View>
                        <Text style={styles.remainingAmountText}>
                            {calculateRemainingAmount(userAmount).remainingAmount} € avant le palier {calculateRemainingAmount(userAmount).nextPalierName}
                        </Text>
                        
                        <CustomRemainingAmountBar userAmount={userAmount} nextPalierAmount={calculateRemainingAmount(userAmount).remainingAmount} />
                    </View>
                    
                    )}


                    
                    <View style={styles.partenairesContainer}>  
                        <Text style={styles.titlePartenaire}>Cashback utilisable chez nos partenaires</Text>
                        <ScrollView horizontal={true}>
                        {partenaires.map((partenaire, index) => (
                            <TouchableOpacity 
                            key={index} 
                            style={styles.partenaireItem}
                            onPress={() => handlePartenairePress(partenaire.site)}
                            >
                                <Image source={{ uri: partenaire.logo }} style={styles.partenaireLogo} />
                                <Text style={styles.partenaireNom}>{partenaire.nom}   </Text>
                            </TouchableOpacity>
                        ))}
                        </ScrollView>
                    </View>
                </View>

                <View style={styles.videoContainer}>
                    <Video2/>
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
        marginTop: 30, 
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
    titlePartenaire: {
        fontSize: 18,
        marginBottom: 10,
        marginLeft: 5,
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
    partenairesContainer: {
        marginTop: 10,
        marginLeft: 5,
    },
    partenaireItem: {
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 10,
    },
    partenaireLogo: {
        width: 110,
        height: 110,
        marginRight: 10,
        borderRadius: 20,
    },
    partenaireNom:{
        fontSize: 17,
        fontStyle:'italic',
        color:'white',
        fontWeight:'bold',
    },
    remainingAmountContainer: {
        alignItems: 'center',
        marginTop: 15,
        backgroundColor: '#008900',
        borderRadius: 5,
        justifyContent: 'center',
        padding: 10,
        marginHorizontal:5,
    },
    cashbackContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    cashbackText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginLeft:10,
    },
    userAmountText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'white',
        marginRight:5,
    },
    remainingAmountText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 5,
        marginBottom:8,
    },
    vipStatusCashback: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 20,
        marginTop:1, 
    },
    vipStatusCashbackContainer:{
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'start',
    },
    palierImageCashback:{
        marginLeft:5,
        marginRight:2,
        marginBottom:3,
    },
    videoContainer:{
        marginTop:5,
        marginBottom: 70,
    },
    postContent: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        position:'absolute',
        bottom: 10,  
        left: 10,
    },
});
