import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ImageBackground, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Checkbox from '../../components/Checkbox';
import ProgressBar from '../../components/ProgressBar';
import { Ionicons } from '@expo/vector-icons';
import AppLoader from '../../components/AppLoader';

export default function Billeterie({ navigation }) {
    const [matchs, setMatchs] = useState([]);
    const [matchsUser, setMatchsUser] = useState([]);
    const [matchsUserId, setMatchsUserId] = useState([]);
    const [match, setMatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAllMatches, setShowAllMatches] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [userEquipeId, setUserEquipeId] = useState(null);

    const formatDate = (dateString) => {
        const dateObj = new Date(dateString);
        const months = [
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

        const day = dateObj.getDate();
        const monthIndex = dateObj.getMonth();
        return `${day} ${months[monthIndex]}`;
    }

    const formatTime = (timeString) => {
        const [hour, minutes] = timeString.split(':');
        return `${hour}h${minutes}`;
    };

    const formatInitials = (name) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('');
    };

    useEffect(() => {
        const fetchMatchs = async () => {
            try {
                const userId = await AsyncStorage.getItem('userId');
                const response = await axios.get(`http://10.0.2.2:4000/api/user/${userId}`);
                const userData = response.data;
                setUserEquipeId(userData.Equipe.idEquipe);

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
    }, [showAllMatches, userEquipeId]);

    const handleNextButton = () => {
        navigation.navigate('Tribune', { selectedMatch: selectedMatch });
    }

    if (loading) {
        return (
            <AppLoader />
        );
    }

    return (
        <ImageBackground source={require('../../assets/background.png')} style={styles.background}>
            <ScrollView>
                <View style={styles.matchs}>
                    <ProgressBar currentPage={1} />
                    <View style={styles.checkboxcontainer}>
                        <Checkbox
                            text="Voir tous les matchs"
                            isChecked={showAllMatches}
                            onPress={() => setShowAllMatches(!showAllMatches)}
                            container={styles.checkbox}
                        />
                    </View>
                    {matchsUser
                        .sort((a, b) => {
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
                            <TouchableOpacity
                                key={index}
                                onPress={() => selectedMatch !== matchItem ? setSelectedMatch(matchItem) : setSelectedMatch(null)}
                                disabled={(matchItem.idEquipeDomicile !== userEquipeId && matchItem.idEquipeExterieure !== userEquipeId) || matchItem.billeterieOuverte !== true}
                            >
                                <View style={[styles.container, matchsUserId.includes(matchItem) ? styles.newMatch : null]}>
                                    <View style={styles.teamContainerDomicile}>
                                        <Text style={styles.teamNameDomicile}>{formatInitials(matchItem.EquipeDomicile.nom)}</Text>
                                        <Image
                                            source={{ uri: matchItem.EquipeDomicile.logo }}
                                            style={styles.teamLogoDomicile}
                                        />
                                    </View>

                                    <View style={styles.centeredDateContainer}>
                                        <View style={styles.dateContainer}>
                                            <Text style={styles.time}>
                                                {formatTime(matchItem.heure_debut)}
                                            </Text>
                                            <Text style={styles.date}>
                                                {formatDate(matchItem.date)}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.teamContainerExterieur}>
                                        <Image
                                            source={{ uri: matchItem.EquipeExterieure.logo }}
                                            style={styles.teamLogoExterieur}
                                        />
                                        <Text style={styles.teamNameExterieur}>{formatInitials(matchItem.EquipeExterieure.nom)}</Text>
                                    </View>

                                    <View style={styles.billetterie}>
                                        {matchItem.billeterieOuverte === true ? (
                                            <Ionicons name="lock-open" size={16} color="#008900" />
                                        ) : (
                                            <Ionicons name="lock-closed" size={16} color="#5D2E46" />
                                        )}
                                    </View>

                                    {selectedMatch === matchItem && (
                                        <View style={styles.selectedIndicator} />
                                    )}
                                </View>
                            </TouchableOpacity>
                        ))}
                </View>
            </ScrollView>

            {selectedMatch && (
                <TouchableOpacity
                    style={styles.nextButton}
                    onPress={handleNextButton}
                >
                    <Text style={styles.nextButtonText}>Suivant</Text>
                </TouchableOpacity>
            )}

        </ImageBackground>

    )
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    checkbox: {
        marginHorizontal: 10,
        marginLeft: 20,
    },
    checkboxcontainer: {
        marginLeft: 15,
        marginVertical: 10,
    },
    matchs: {
        marginBottom: 60,
    },
    container: {
        padding: 15,
        borderRadius: 20,
        backgroundColor: '#D9D9D9',
        margin: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
    },
    newMatch: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    selectedIndicator: {
        position: 'absolute',
        bottom: 0,
        left: 4,
        right: 0,
        height: 7,
        width: '106%',
        backgroundColor: '#008900',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        zIndex: 1,
    },
    centeredDateContainer: {
        flex: 2,
        alignItems: 'center',
    },
    dateContainer: {
        alignItems: 'center',
    },
    teamContainerDomicile: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flex: 1,
    },
    teamNameDomicile: {
        flex: 1,
        fontWeight: 'bold',
        textAlign: 'right',
        paddingRight: 10,
    },
    teamLogoDomicile: {
        width: 50,
        height: 50,
        marginRight: "-50%"
    },
    teamContainerExterieur: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    teamLogoExterieur: {
        width: 50,
        height: 50,
        marginLeft: "-40%"
    },
    teamNameExterieur: {
        marginLeft: 10,
        fontWeight: 'bold',
        textAlign: 'right',
    },
    date: {
        textAlign: 'center',
        color: '#5C5C5C',
    },
    time: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#BD4F6C',
    },
    billetterie: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        marginRight: 10,
        marginBottom: 10,
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
        zIndex: 4,
    },
    nextButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
    },
});
