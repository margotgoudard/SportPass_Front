import React, { useState } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ClubPage from './ClubForumPage';
import CommunautePage from './CommunauteForumPage';
import { Image, ImageBackground, StyleSheet, View } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MessageModal from '../../components/MessageModal.js';
import axios from 'axios';


const Tab = createMaterialTopTabNavigator();

const ForumPage = () => {

    const [isModalVisible, setModalVisible] = useState(false);
    const [messageText, setMessageText] = useState('');
    const [inputHeight, setInputHeight] = useState(0);
    const [isBlurEffect, setIsBlurEffect] = useState(false);
    const [postComponentHeight, setPostComponentHeight] = useState(0); 
    const [reloadKey, setReloadKey] = useState(0);

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

    return (
        <ImageBackground source={require('../../assets/background.png')} style={styles.background}>
            {renderMessageModal()}
            <View style={styles.logoContainer}>
                <Image source={require('../../assets/logo.png')} style={styles.logo} />
            </View>
            <ScrollView style={styles.tabsContainer}>
                <Tab.Navigator
                    screenOptions={{
                        tabBarStyle: styles.tabBar,
                        tabBarIndicatorContainerStyle: {
                            backgroundColor: "#D9D9D9",
                        },
                        tabBarActiveTintColor: 'black',
                        tabBarInactiveTintColor: 'gray',
                        tabBarIndicatorStyle: { backgroundColor: 'green' },
                    }}
                >
                    <Tab.Screen name="Club" children={() => <ClubPage key={reloadKey} />} />
                    <Tab.Screen name="Communaute" children={() => <CommunautePage key={reloadKey} />} />
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
        marginTop: "5%",
    },
    logo: {
        width: "50%",
        height: "50%", 
        resizeMode: 'contain' 
    },
    tabsContainer: {
        flex: 1,
        marginTop: "-50%",
        marginLeft: "4%",
        marginRight: "4%", 
        backgroundColor: 'transparent' 
    },
    tabBar: {
        marginRight:"18%"   
    },
    newMessageIcon: {
        position: 'absolute',
        bottom: 80,
        right: 20,
        padding: 10,
        borderRadius: 50,
        backgroundColor: "#BD4F6C",
    },
    messageModalStyle: {
        zIndex: 100,
    },
});

export default ForumPage;
