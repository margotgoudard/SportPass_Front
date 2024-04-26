import React, { useState, useEffect } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ClubPage from './ClubForumPage';
import CommunautePage from './CommunauteForumPage';
import { Image, ImageBackground, StyleSheet, View, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MessageModal from '../../components/MessageModal.js';
import axios from 'axios';
import { FontAwesome } from '@expo/vector-icons';

const Tab = createMaterialTopTabNavigator();

const ForumPage = () => {

    const [isModalVisible, setModalVisible] = useState(false);
    const [messageText, setMessageText] = useState('');
    const [inputHeight, setInputHeight] = useState(0);
    const [isBlurEffect, setIsBlurEffect] = useState(false);
    const [postComponentHeight, setPostComponentHeight] = useState(0); 
    const [reloadKey, setReloadKey] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    const openModal = (content) => {
        setMessageText(content);
        setModalVisible(true);
        setIsBlurEffect(true);
    };

    
    const closeModal = () => {
        setModalVisible(false);
        setIsBlurEffect(false);
    };

    const adjustInputHeight = (event) => {
        setInputHeight(event.nativeEvent.contentSize.height);
    };

    const adjustInputHeightPost = (event) => {
        setPostComponentHeight(event.nativeEvent.contentSize.height);
    };

    useEffect(() => {
        setIsBlurEffect(false);
    }, []);
    
    const renderMessageModal = () => {
        if (!isModalVisible) return null;
        return (
            <View style={styles.messageModalStyle}>
                <MessageModal
                    isModalVisible={isModalVisible}
                    closeModal={closeModal}
                    messageText={messageText}
                    setMessageText={setMessageText}
                    sendMessage={sendMessage}
                    adjustInputHeight={adjustInputHeight}
                    inputHeight={inputHeight}
                    adjustInputHeightPost={adjustInputHeightPost}
                    postComponentHeight={postComponentHeight}
                />
            </View>
        );
    };

    const sendMessage = async () => {
        if (messageText.trim() === '') {
            Alert.alert('Erreur', 'Le message ne peut pas être vide.');
            return;
        }

        const messageData = {
            contenu: messageText,
            date: new Date().toISOString(),
            idUser: await AsyncStorage.getItem('userId')
        };
            try {
                const response = await axios.post('http://10.0.2.2:4000/api/publicationUser', messageData);
                setMessageText('');
                closeModal();
                setReloadKey(prevKey => prevKey + 1);
            } catch (error) {
                console.error('Erreur lors de l\'envoi du message', error);
                Alert.alert('Erreur', 'Un problème est survenu lors de l\'envoi du message.');
            }

    };

    const renderBlurOverlay = () => (
        <TouchableOpacity
            style={[styles.blurOverlay, { display: isBlurEffect ? 'flex' : 'none' }]}
            onPress={() => {
                setIsBlurEffect(false);
            }}
            activeOpacity={1}
        />
    );

    return (
      
            <ImageBackground source={require('../../assets/background.png')} style={styles.background}>
                {renderBlurOverlay()}
                {renderMessageModal()}
                <View >
                <View style={styles.logoContainer}>
                    <Image source={require('../../assets/logo.png')} style={styles.logo} />

                </View>
                <View style={styles.searchContainer}>
                        <FontAwesome name="search" size={24} color="black" style={styles.searchIcon} />
                        <TextInput
                            placeholder="Rechercher ..."
                            value={searchTerm}
                            onChangeText={setSearchTerm}
                            style={styles.searchInput}
                            placeholderTextColor="gray" 
                        />
                    </View>
                    </View>
                <ScrollView style={styles.tabsContainer}>
                    <Tab.Navigator
                        screenOptions={{
                            tabBarStyle: {
                                elevation: 0, 
                                shadowOpacity: 0, 
                                shadowOffset: { height: 0, width: 0 },
                                shadowRadius: 0,
                                shadowColor: 'transparent',
                                height: 40,
                            },
                            tabBarLabelStyle: {
                                fontSize: 13, 
                                margin: 0, 
                                paddingBottom: 50,
                            },
                            tabBarIndicatorContainerStyle: {
                                backgroundColor: "#D9D9D9",
                            },
                            tabBarActiveTintColor: 'black',
                            tabBarInactiveTintColor: '#A4A5A2',
                            tabBarIndicatorStyle: { backgroundColor: '#008900'},
                        }}
                    >
                        <Tab.Screen name="Club">
                            {() => <ClubPage searchTerm={searchTerm} key={reloadKey} />}
                        </Tab.Screen>
                        <Tab.Screen name="Communaute">
                            {() => <CommunautePage searchTerm={searchTerm} key={reloadKey} />}
                        </Tab.Screen>
                    </Tab.Navigator>
                </ScrollView>
                <TouchableOpacity
                        onPress={() => openModal('')}
                        style={styles.newMessageIcon}
                    >
                        <Entypo name="new-message" size={24} color="white" />
                    </TouchableOpacity>
            </ImageBackground>
    );
};



const styles = StyleSheet.create({
    background: {
        flex: 1
    },
    logoContainer: {
        marginLeft: "4%",
        marginTop: "1%",
    },
    logo: {
        width: "50%",
        height: "50%", 
        resizeMode: 'contain' 
    },
    tabsContainer: {
        marginTop: "-60%", 
        backgroundColor: 'transparent',
    },
    newMessageIcon: {
        position: 'absolute',
        bottom: 80,
        right: 20,
        padding: 10,
        borderRadius: 50,
        backgroundColor: "#BD4F6C",
    },
    blurOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 5,
    },
    messageModalStyle: {
        zIndex: 100,
    },
    searchContainer: {
        padding: 10,
        marginTop: "-28%",
        margin: "4%",
        backgroundColor: "#f0f0f0", 
        marginBottom: "10%",
        borderRadius: 30, 
        borderWidth: 1,
        borderColor: "#E8E8E8",
        flexDirection: 'row', 
        alignItems: 'center', 
    },
    searchInput: {
        flex: 1, 
        height: 20,
        borderColor: 'transparent', 
        paddingLeft: 10,
        borderRadius: 30, 
        fontSize: 16, 
    },
    searchIcon: {
        marginRight: 10, 
    }
});

export default ForumPage;
