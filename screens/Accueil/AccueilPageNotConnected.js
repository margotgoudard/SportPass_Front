import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, ScrollView, TouchableOpacity,Linking } from 'react-native';
import axios from 'axios';
import URLS from '../../urlConfig.js';
import AppLoader from '../../components/AppLoader';
import Video2 from '../../components/Accueil/Video.js';
import moment from 'moment';

export default function Accueil({ navigation }) {
    const [loading, setLoading] = useState(true);
    const [alaUnePublications, setAlaUnePublications] = useState([]);
    const [partenaires, setPartenaires] = useState([]);
    const scrollViewRef = useRef(null);


    useEffect(() => {
        const fetchAlaUnePublications = async () => {
            try {
                const alaUneResponse = await axios.get(`${URLS.url}/publicationClub/alaUne`);
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

        setLoading(false);

        fetchAlaUnePublications();
        fetchPartenaires();
    }, []); 

    const scrollToPublication = (index) => {
        if (scrollViewRef.current) {
            const offset = index * (342 + 15); 
            scrollViewRef.current.scrollTo({ x: offset, animated: true });
        }
    };

    const handlePartenairePress = (siteUrl) => {
        Linking.openURL(siteUrl);
    };


    const handleBilletteriePress = () => {
        navigation.navigate('Navbar', {screen:'Profil',params: { screen: 'Login' }});
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
                    {alaUnePublications.length > 0 && (
                        <View style={styles.uneContainer}>
                            <View style={styles.publicationsContainer}>
                                <ScrollView 
                                    horizontal={true}
                                    ref={scrollViewRef}
                                    pagingEnabled={true}
                                >
                                    {alaUnePublications.map((publication, index) => (
                                        <View key={index} style={styles.imageContainer}>
                                             <ImageBackground
                                                    source={{ uri: publication.image }}
                                                    style={styles.publicationImage} 
                                                >   
                                                    <View style={styles.postDetails}>
                                                        <Text style={styles.postContent}>{publication.contenu}</Text>
                                                        {publication.tag !== "" && (
                                                            <View style={styles.tagContainer}>
                                                                <Text style={styles.tagText}>{publication.tag}</Text>
                                                            </View>
                                                        )}
                                                    </View>
                                                    <Text style={styles.postTime}>{moment(publication.date).fromNow()}</Text>
                                                   

                                                </ImageBackground>
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


                    <View style={styles.partenairesContainer}>  
                        <Text style={styles.titlePartenaire}>Nos partenaires</Text>
                        <ScrollView horizontal={true}>
                            {partenaires.map((partenaire, index) => (
                                <TouchableOpacity 
                                    key={index} 
                                    style={styles.partenaireItem}
                                    onPress={() => handlePartenairePress(partenaire.site)}
                                >
                                    <Image source={{ uri: partenaire.logo }} style={styles.partenaireLogo} />
                                    <Text style={styles.partenaireNom}>{partenaire.nom}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    <View style={styles.videoContainer}>
                        <Video2/>
                    </View>

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
    logo: {
        width: 150, 
        height: 150, 
        resizeMode: 'contain', 
    },
    logoContainer: {
        justifyContent: 'flex-start', 
        alignItems: 'flex-start',
        marginTop: 10, 
        marginLeft: 15,    
    },
    container: {
        flex: 1,
        marginTop: "-15%"
    },
    bienvenue: {
        fontSize: 20,
        position: 'absolute',
        marginLeft: 15,
        fontWeight: 'bold',
    },
    publicationsContainer: {
        marginTop: 10,
        zIndex: 1, 
    },
    title: {
        fontSize: 18,
        marginBottom: 5,
        marginLeft: 15,
    },
    titlePartenaire: {
        fontSize: 18,
        marginBottom: 5,
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
        flex:1,
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
        fontWeight: 'bold',
        fontSize: 17,
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
        fontSize: 18,
        
        textShadowColor: 'rgba(0, 0, 0, 0.75)', 
        textShadowOffset: { width: 2, height: 2 }, 
        textShadowRadius: 5, 
    },
    postTime: {
        position: "absolute",
        top: 8,
        right : 8,
        color: 'white',
        textShadowColor: 'rgba(0, 0, 0, 0.75)', 
        textShadowOffset: { width: 2, height: 2 }, 
        textShadowRadius: 5, 
    },
    tagContainer: {
        backgroundColor: '#BD4F6C',
        padding: 5,
        borderRadius: 5,
        position:'relative',
        marginLeft: "62%",
        marginRight:"2%"
       
    },
    tagText: {
        color: 'white',
        fontWeight: 'bold',
    },
    postDetails:{
        position:'absolute',
        bottom: 10,  
        left: 10,
        paddingHorizontal: 10, 
        paddingBottom: 10,
    }
});
