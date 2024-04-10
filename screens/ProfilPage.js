import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ImageBackground,
  Alert
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import moment from 'moment';
import 'moment/locale/fr';
import PostComponent from '../components/PostComponent';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { ActivityIndicator } from 'react-native';
import EditModal from '../components/EditModal.js';
import MessageModal from '../components/MessageModal.js';

moment.locale('fr');

const UserProfilePage = ({ route }) => {
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

  const handleLongPressOnPost = (post) => {
    setSelectedPost(post);
    setEditModalVisible(true);
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
        const response = await axios.delete(`http://10.0.2.2:4000/api/publicationUser/${idPublication}`);
        fetchUserPosts();
      } catch (error) {
        console.error('Error delete post', error);
        return false; 
      }
    };


  const handleLogOut = async () => {
    try {
      await AsyncStorage.removeItem('@userToken');
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

  useFocusEffect(
    useCallback(() => {
      const fetchUserDetails = async () => {
        try {
          const response = await axios.get(`http://10.0.2.2:4000/api/user/${userData.idUser}`);
          setUser(response.data);
        } catch (error) {
          console.error(error);
          Alert.alert("Erreur de chargement", "Le user n'ont pas pu être chargées.");
        }
      };

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
        <ImageBackground source={require('../assets/background.png')} style={styles.container}>
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        </ImageBackground>
    );
}

  const navigateToModifyProfile = () => {
    navigation.navigate('ModificationProfil', { user });
  };

  return (
    <ImageBackground source={require('../assets/background.png')} style={styles.container}>
      <ScrollView>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={handleLogOut}>
            <Text style={styles.logoutText}>Se déconnecter</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={navigateToModifyProfile}>
            <Text style={styles.editProfileText}>Modifier</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.headerContainer}>
          <Image source={require('../assets/avatar.png')} style={styles.avatar} />
          <View style={styles.userInfoContainer}>
            <View style={styles.vipStatusContainer}>
              <Text style={styles.vipStatus}>
                Palier {user.Palier?.nom}
              </Text>
              <Image source={require('../assets/palier.png')} style={styles.palierImage} />
            </View>
            <Text style={styles.bold}>{user.pseudo}</Text>
            <Text style={styles.teamName}>{user.Equipe?.nom}</Text>
            <Text style={styles.center}>{user.biographie || "Veuillez saisir votre biographie..."}</Text>
            <Text style={styles.center}>
              <Text style={styles.boldNumbers}>{followersCount}</Text> abonnés | <Text style={styles.boldNumbers}>{followingsCount}</Text> abonnements
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
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${calculateProfileCompletion(user)}%` }]} />
            </View>
            <TouchableOpacity onPress={navigateToModifyProfile}>
              <Text style={[styles.progressBarText, calculateProfileCompletion(user) === 100 ? styles.profileCompleted : {}]}>
                {`${Math.round(calculateProfileCompletion(user))}% de votre profil est complet`}
              </Text>
            </TouchableOpacity>
            <View style={styles.listContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('Pass', { userId: userData.idUser })}>

            <View style={styles.listItem}>
                <Text style={styles.listItemText}>Mon abonnement</Text>
              
              <Text style={styles.listItemArrow}>›</Text>
            </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Billet', { userId: userData.idUser })}>

              <View style={styles.listItem}>
                <Text style={styles.listItemText}>Mes billets</Text>
                <Text style={styles.listItemArrow}>›</Text>
              </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Commercant', { userId: userData.idUser })}>

              <View style={styles.listItem}>
                <Text style={styles.listItemText}>Mes favoris</Text>
                <Text style={styles.listItemArrow}>›</Text>
              </View>
              </TouchableOpacity>

            </View>
          </View>
          <View style={styles.postItemList}>
          {posts.map((post, index) => (
        <PostComponent
          key={index}
          post={post}
          onPostPress={() => navigation.navigate('PostDetails', { post })}
          onLongPress={() => handleLongPressOnPost(post)}
        />
      ))}
      <EditModal
        isVisible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        onEdit={() => {
          setEditModalVisible(false); 
          setMessageText(selectedPost.contenu);
          setMessageModalVisible(true);
          modifyPost(selectedPost.idPublication, selectedPost.contenu );
        }}
        onDelete={() => {
          setEditModalVisible(false);
          deletePost(selectedPost.idPublication);
        }}
      />
      <MessageModal
          isModalVisible={messageModalVisible}
          closeModal={() => setMessageModalVisible(false)}
          messageText={messageText}
          setMessageText={setMessageText}
          sendMessage={() => {
              modifyPost(selectedPost.idPublication, messageText);
              setMessageModalVisible(false);
          }}
          adjustInputHeight={adjustInputHeight}
          inputHeight={inputHeight}
      />
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
        color: 'green',
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
        color: 'green', 
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
        backgroundColor: 'green',
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
        width: '111%'
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
        color: 'green',
        fontWeight: 'bold',
        fontSize: 16,
    },
    profileCompleted: {
        textDecorationLine: 'underline',
        color: 'green',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },    
});

export default UserProfilePage;