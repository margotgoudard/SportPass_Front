import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ImageBackground,
  Alert,
  ActivityIndicator
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import moment from 'moment';
import 'moment/locale/fr';
import PostComponent from '../../components/PostComponent.js';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import EditActions from '../../components/EditActionsComponent.js';
import MessageModal from '../../components/MessageModal.js';
import { MaterialCommunityIcons } from '@expo/vector-icons';

moment.locale('fr');

const ProfilePage = ({ route }) => {
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
      await axios.put(`http://10.0.2.2:4000/api/publicationUser/${idPublication}`, updatedPost);
      fetchUserPosts();
    } catch (error) {
      console.error('Error updating post:', error);
      Alert.alert('Error', 'An error occurred while updating the post');
    }
  };

  const deletePost = async (idPublication) => {
    try {
      await axios.delete(`http://10.0.2.2:4000/api/publicationUser/${idPublication}`);
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
      <View>
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
      const response = await axios.get(`http://10.0.2.2:4000/api/publicationUser/user/${userData.idUser}`);
      const sortedPosts = response.data.sort((a, b) => moment(a.date).diff(moment(b.date)));
      setPosts(sortedPosts);
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur de chargement", "Les posts n'ont pas pu être chargées.");
    }
  };

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`http://10.0.2.2:4000/api/user/${userData.idUser}`);
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
          const followersResponse = await axios.get(`http://10.0.2.2:4000/api/abonnes/followers/${userData.idUser}`);
          const followingsResponse = await axios.get(`http://10.0.2.2:4000/api/abonnes/following/${userData.idUser}`);
          setFollowersCount(followersResponse.data.length);
          setFollowingsCount(followingsResponse.data.length);
        } catch (error) {
          console.error(error);
          Alert.alert("Erreur de chargement", "Les données d'abonnés n'ont pas pu être chargées.");
        }
      };

      fetchUserDetails();
      fetchUserPosts();
      fetchUserFollowersAndFollowings();
    }, [userData.idUser])
  );

  if (!user) {
    return (
      <ImageBackground source={require('../../assets/background.png')} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
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
        <View style={styles.headerContainer}>
          <Image source={require('../../assets/avatar.png')} style={styles.avatar} />
          <View style={styles.userInfoContainer}>
            <View style={styles.vipStatusContainer}>
              <Text style={styles.vipStatus}>
                Palier {user.Palier?.nom}
              </Text>
              <MaterialCommunityIcons name="flag-checkered" size={24} color="#008900" style={styles.palierImage} />
            </View>
            <Text style={styles.bold}>{user.pseudo}</Text>
            <Text style={styles.teamName}>{user.Equipe?.nom}</Text>
            <Text style={styles.center}>{user.biographie || "Veuillez saisir votre biographie..."}</Text>
            <Text style={styles.center}>
              <Text style={styles.boldNumbers}>{followersCount}</Text> abonnés <Text style={styles.boldNumbers}>{followingsCount}</Text> abonnements
            </Text>
            <Text style={styles.details}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="mail" size={22} color="black" />
                <Text style={{ marginLeft: 5 }}>{user.mail}</Text>
              </View>
            </Text>
            <Text style={styles.details}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <FontAwesome name="phone" size={24} color="black" />
                <Text style={{ marginLeft: 5 }}>{user.tel || "Veuillez saisir votre téléphone..."}</Text>
              </View>
            </Text>
            <Text style={styles.details}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <FontAwesome name="home" size={24} color="black" />
                <Text style={{ marginLeft: 5 }}>{user.adresse || "Veuillez saisir votre adresse..."}</Text>
              </View>
            </Text>
            {calculateProfileCompletion(user) < 100 && (
              <>
                <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBar, { width: `${calculateProfileCompletion(user)}%` }]} />
                </View>
                <Text style={[styles.progressBarText, calculateProfileCompletion(user) === 100 ? styles.profileCompleted : {}]}>
                  {`${Math.round(calculateProfileCompletion(user))}% de votre profil est complet`}
                </Text>
              </>
            )}
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
                    onPostPress={() =>  navigation.navigate('PostDetails', { post })}
                    onLongPress={() => handleLongPressOnPost(post)}
                    style={styles.postComponentStyle}
                  />
                ))}
              </View>
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
  headerContainer: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 50, 
    marginBottom: "15%"
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    position: 'absolute', 
    top: 70, 
    alignSelf: 'center', 
    zIndex: 1, 
  },
  userInfoContainer: {
    width: '112%', 
    backgroundColor: '#D9D9D9',
    borderRadius: 20,
    padding: 20,
    paddingTop: 60,
    marginTop: 70,
    position: 'relative',
  },
  vipStatusContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    flexDirection: 'row',
  },
  vipStatus: {
    color: '#008900',
    fontWeight: 'bold',
    fontSize: 15
  },
  details: {
    fontSize: 16,
    marginBottom: "4%",
  },
  teamName: {
    fontSize: 16,
    marginBottom: 5,
    color: '#008900', 
    fontWeight: 'bold',
    textAlign: 'center'
  },
  center: {
    fontSize: 16,
    marginBottom: "5%",
    textAlign: 'center'
  },
  bold: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  progressBarContainer: {
    height: 10,
    width: '100%',
    backgroundColor: 'black',
    borderRadius: 10,
    marginTop: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#008900',
    borderRadius: 10,
  },
  progressBarText: {
    textAlign: 'center',
    marginTop: 5,
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
  palierImage: {
    width: 20, 
    height: 20, 
    marginLeft: 5, 
  },
  boldNumbers: {
    fontWeight: 'bold', 
  },
  postItemList: {
    width: '100%'
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
  profileCompleted: {
    textDecorationLine: 'underline',
    color: '#008900',
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1, 
  },
  selectedPostContainer: {
    position: 'absolute',
    zIndex: 2, 
    width: '90%',
    alignSelf: "center",
    marginTop: "70%"
  }
});

export default ProfilePage;
