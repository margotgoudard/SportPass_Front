import React, { useState, useEffect } from 'react';
import { Image, ImageBackground, StyleSheet, View, TextInput, Text, Alert } from 'react-native';
import { ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Entypo, FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import MessageModal from '../../components/MessageModal.js';
import URLS from '../../urlConfig.js';
import ClubForumPage from './ClubForumPage.js';
import CommunauteForumPage from './CommunauteForumPage.js';

const ForumPage = () => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [messageText, setMessageText] = useState('');
    const [inputHeight, setInputHeight] = useState(0);
    const [isBlurEffect, setIsBlurEffect] = useState(false);
    const [postComponentHeight, setPostComponentHeight] = useState(0); 
    const [reloadKey, setReloadKey] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [refreshPage, setRefreshPage] = useState(false);
    const [activePage, setActivePage] = useState('Club'); 

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setRefreshPage(true);
        setTimeout(() => {
          setRefreshing(false);
          setRefreshPage(false);
        }, 1000);
      }, []);

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
                const response = await axios.post(`${URLS.url}/publicationUser`, messageData);
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

    const renderActivePage = () => {
        if (activePage === 'Club') {
            return <ClubForumPage searchTerm={searchTerm} refreshTrigger={refreshPage} />;
        } else {
            return <CommunauteForumPage searchTerm={searchTerm} refreshTrigger={refreshPage} />;
        }
    };

    return (
        <ImageBackground source={require('../../assets/background.png')} style={styles.background}>
            {renderBlurOverlay()}
            {renderMessageModal()}
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
                <ScrollView
                style={styles.tabsContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#BD4F6C', 'green']}
                        progressBackgroundColor="#B1B1B1"
                        tintColor="#4A90E2"
                    />
                }
            >
                <View style={styles.tabButtonsContainer}>
                    <TouchableOpacity
                        onPress={() => setActivePage('Club')}
                        style={[styles.tabButton, activePage === 'Club' && styles.activeTabButton]}
                    >
                        <Text style={[styles.tabButtonText, activePage === 'Club' && styles.activeTabButtonText]}>Club</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setActivePage('Communauté')}
                        style={[styles.tabButton, activePage === 'Communauté' && styles.activeTabButton]}
                    >
                        <Text style={[styles.tabButtonText, activePage === 'Communauté' && styles.activeTabButtonText]}>Communauté</Text>
                    </TouchableOpacity>
                </View>
                {renderActivePage()}
            </ScrollView>
            <TouchableOpacity
                onPress={() => openModal('')}
                style={styles.newMessageIcon}
            >
                <Entypo name="new-message" size={30} color="white" />
            </TouchableOpacity>
        </ImageBackground>
    );
}    

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    logoContainer: {
        marginLeft: "4%",
        marginTop: "-12%",
    },
    logo: {
        width: "50%",
        height: "50%", 
        resizeMode: 'contain' 
    },
    tabsContainer: {
        zIndex: 1,
        backgroundColor: 'transparent',
        marginTop: "-6%"
    },
    newMessageIcon: {
        position: 'absolute',
        bottom: 90,
        right: 20,
        padding: 10,
        borderRadius: 50,
        backgroundColor: "#BD4F6C",
        zIndex: 7
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
        zIndex: 6,
    },
    searchContainer: {
        padding: 10,
        marginTop: "-76%",
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
    },
    tabButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        zIndex: 6
    },
    tabButton: {
        width: '50%',
        paddingVertical: 15,
        backgroundColor: '#D9D9D9',
        alignItems: 'center',
        borderBottomWidth: 2, 
        borderBottomColor: 'transparent', 
    },
    activeTabButton: {
        borderBottomColor: '#008900', 
    },
    tabButtonText: {
        color: 'black', 
        fontSize: 16,
    },
    activeTabButtonText: {
        color: 'black',
    },
});

export default ForumPage;
