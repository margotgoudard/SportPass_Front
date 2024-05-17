import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ImageBackground, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import moment from 'moment';
import 'moment/locale/fr';
import PostComponent from '../../components/PostComponent.js';
import EditActions from '../../components/EditActionsComponent.js';
import MessageModal from '../../components/MessageModal.js';
import ProfileHeader from '../../components/Profil/ProfilHeader.js';
import URLS from '../../urlConfig.js';
import AppLoader from '../../components/AppLoader';

moment.locale('fr');

const ProfilPage = ({ route }) => {
  const { userData } = route.params;
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingsCount, setFollowingsCount] = useState(0);
  const navigation = useNavigation();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [inputHeight, setInputHeight] = useState(0); 
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [blurEffect, setBlurEffect] = useState(false);
  const [postComponentVisible, setPostComponentVisible] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);
  const [loading, setLoading] = useState(true);

  const adjustInputHeight = (event) => {
    setInputHeight(event.nativeEvent.contentSize.height);
  };

  const calculateProfileCompletion = (user) => {
    const fields = [
      user.pseudo,
      user.Equipe?.nom,
      user.biographie,
      user.nom,
      user.mail,
      user.tel,
      user.adresse,
      user.Palier?.nom
    ];
    const filledFields = fields.filter(Boolean);
    return (filledFields.length / fields.length) * 100;
  };

  const modifyPost = async (idPublication, newContent) => {
    const updatedPost = {
      contenu: newContent,
      date: new Date().toISOString(), 
    };
  
    try {
      await axios.put(`${URLS.url}/publicationUser/${idPublication}`, updatedPost);
      fetchUserPosts();
    } catch (error) {
      console.error('Error updating post:', error);
      Alert.alert('Error', 'An error occurred while updating the post');
    }
  };

  const deletePost = async (idPublication) => {
    try {
      await axios.delete(`${URLS.url}/publicationUser/${idPublication}`);
      fetchUserPosts();
      setBlurEffect(false); 
    } catch (error) {
      console.error('Error delete post', error);
      return false; 
    }
  };

  const handleLongPressOnPost = (post) => {
    setSelectedPost(post);
    setEditModalVisible(true);
    setPostComponentVisible(true);
    setBlurEffect(true);
  };

  const disableBlurAndEditModal = () => {
    setBlurEffect(false);
    setEditModalVisible(false);
    setPostComponentVisible(true);
    setSelectedPost(null);
    renderSelectedPost();
  };

  const renderBlurOverlay = () => (
    <TouchableOpacity
      style={[styles.blurOverlay, { display: blurEffect ? 'flex' : 'none' }]}
      onPress={disableBlurAndEditModal} 
      activeOpacity={1}
    />
  );

  const renderSelectedPost = () => {
    if (!selectedPost || !blurEffect) return null;
    return (
      <View style={styles.view}>
        <View style={styles.selectedPostContainer}>
          {postComponentVisible && (
            <PostComponent
              post={selectedPost}
              onPostPress={() => {}}
              onLongPress={() => {}}
            />
          )}
          {editModalVisible && (
            <EditActions
              onClose={() => {
                setEditModalVisible(false);
                setPostComponentVisible(false);
              }}
              onEdit={() => {
                setEditModalVisible(false);
                setPostComponentVisible(false); 
                setMessageText(selectedPost.contenu);
                setMessageModalVisible(true);
              }}
              onDelete={() => {
                setEditModalVisible(false);
                setPostComponentVisible(false);
                deletePost(selectedPost.idPublication);
                setBlurEffect(false); 
              }}
            />
          )}
        </View>
        <MessageModal
          isModalVisible={messageModalVisible}
          closeModal={() => {
            setMessageModalVisible(false);
            setEditModalVisible(false); 
            setPostComponentVisible(false);
            setBlurEffect(false); 
            setSelectedPost(null);
          }}
          messageText={messageText}
          setMessageText={setMessageText}
          sendMessage={() => {
            modifyPost(selectedPost.idPublication, messageText);
            setMessageModalVisible(false);
            setPostComponentVisible(false);
            setEditModalVisible(false); 
            setBlurEffect(false);
            setSelectedPost(null); 
          }}
          adjustInputHeight={adjustInputHeight}
          inputHeight={inputHeight}
        />
      </View>
    );
  };

  const handleLogOut = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userId');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Log out failed', error);
      Alert.alert("Erreur de déconnexion", "La déconnexion a échoué. Veuillez réessayer.");
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await axios.get(`${URLS.url}/publicationUser/user/${userData.idUser}`);
      const sortedPosts = response.data.sort((a, b) => moment(a.date).diff(moment(b.date)));
      setPosts(sortedPosts);
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur de chargement", "Les posts n'ont pas pu être chargées.");
    }
  };

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`${URLS.url}/user/${userData.idUser}`);
      setUser(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur de chargement", "Le user n'ont pas pu être chargées.");
    }
  };

  useFocusEffect(
    useCallback(() => {      
      const fetchUserFollowersAndFollowings = async () => {
        try {
          const followersResponse = await axios.get(`${URLS.url}/abonnes/followers/${userData.idUser}`);
          const followingsResponse = await axios.get(`${URLS.url}/abonnes/following/${userData.idUser}`);
          setFollowersCount(followersResponse.data.length);
          setFollowingsCount(followingsResponse.data.length);
          setFollowers(followersResponse.data);
          setFollowings(followingsResponse.data)
        } catch (error) {
          console.error(error);
          Alert.alert("Erreur de chargement", "Les données d'abonnés n'ont pas pu être chargées.");
        }
      };

      setLoading(false);
      fetchUserDetails();
      fetchUserPosts();
      fetchUserFollowersAndFollowings();
    }, [userData.idUser])
  );


  if (!user || loading) {
    return (
      <ImageBackground source={require('../../assets/background.png')} style={styles.container}>
        <View style={styles.loadingContainer}>
        <AppLoader/>

        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={require('../../assets/background.png')} style={styles.container}>
      {renderBlurOverlay()}
      {renderSelectedPost()}
  
      <ScrollView>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={handleLogOut}>
            <Text style={styles.logoutText}>Se déconnecter</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Navbar', {
            screen: 'Profil',
            params: { screen: 'ModificationProfil', params: { user } }
          })}>
            <Text style={styles.editProfileText}>Modifier</Text>
          </TouchableOpacity>
        </View>
  
        <View style={styles.userInfoContainer}>
          <ProfileHeader
            user={user}
            handleNavigation={(type) => navigation.navigate('AbonnesList', {
              userId: userData.idUser,
              followers,
              followings,
              type
            })}
            followersCount={followersCount}
            followingsCount={followingsCount}
            followers={followers}
            followings={followings}
            calculateProfileCompletion={calculateProfileCompletion}
          />
  
          <View style={styles.listContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('Navbar', {
              screen: 'Profil',
              params: { screen: 'Pass', params: { userId: userData.idUser } }
            })}>
              <View style={styles.listItem}>
                <Text style={styles.listItemText}>Mon abonnement</Text>
                <Text style={styles.listItemArrow}>›</Text>
              </View>
            </TouchableOpacity>
  
            <TouchableOpacity onPress={() => navigation.navigate('Navbar', {
              screen: 'Profil',
              params: { screen: 'Billet', params: { userId: userData.idUser } }
            })}>
              <View style={styles.listItem}>
                <Text style={styles.listItemText}>Mes billets</Text>
                <Text style={styles.listItemArrow}>›</Text>
              </View>
            </TouchableOpacity>
  
            <TouchableOpacity onPress={() => navigation.navigate('Navbar', {
              screen: 'Profil',
              params: { screen: 'CommercantFavoris', params: { userId: userData.idUser } }
            })}>
              <View style={styles.listItem}>
                <Text style={styles.listItemText}>Mes favoris</Text>
                <Text style={styles.listItemArrow}>›</Text>
              </View>
            </TouchableOpacity>
  
            <View style={styles.postItemList}>
              {posts.map((post, index) => (
                <PostComponent
                  key={index}
                  post={post}
                  onPostPress={() => navigation.navigate('PostDetails', { post })}
                  onLongPress={() => handleLongPressOnPost(post)}
                  style={styles.postComponentStyle}
                />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};  

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userInfoContainer: {
    width: '100%', 
    backgroundColor: '#D9D9D9',
    borderRadius: 20,
    padding: 20,
    marginTop: 100,
    position: 'relative',
    marginBottom: "11%"
  },
  text: {
    marginLeft: "10%"
  },
  details: {
    fontSize: 16,
  },
  center: {
    fontSize: 16,
    textAlign: 'center'
  },
  bold: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  listContainer: {
    marginTop: 20,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 10
  },
  listItemText: {
    fontSize: 16,
  },
  listItemArrow: {
    fontSize: 16,
    color: 'grey', 
  },
  postItemList: {
    width: '100%',
    marginBottom: 20
  },
  topBar: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20, 
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center', 
  },
  logoutText: {
    color: '#BD4F6C',
    fontWeight: 'bold',
    fontSize: 16
  },
  editProfileText: {
    color: '#008900',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },   
  blurOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1, 
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  view: {
    zIndex: 3
  },
  selectedPostContainer: {
    position: 'absolute',
    width: '90%',
    alignSelf: "center",
    marginTop: "70%",
    zIndex: 2
  }
});

export default ProfilPage;
