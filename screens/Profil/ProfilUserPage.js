import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, ImageBackground, Alert, ActivityIndicator} from 'react-native';
import axios from 'axios';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import moment from 'moment';
import 'moment/locale/fr';
import PostComponent from '../../components/PostComponent.js';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

moment.locale('fr');

const ProfileUserPage = ({ route }) => {
  const { userData } = route.params;
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingsCount, setFollowingsCount] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(0);

  const navigation = useNavigation();

  const getCurrentUserId = async () => {
    try {
      const idUser = await AsyncStorage.getItem('userId');
      setCurrentUserId(idUser);
      await checkSubscription();
    } catch (error) {
      console.error("Error getting current user id:", error);
      Alert.alert("Erreur", "Impossible de récupérer l'identifiant de l'utilisateur actuel.");
    }
  };
  
  
  useEffect(() => {
    getCurrentUserId();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`http://sp.cluster-ig4.igpolytech.fr/api/user/${userData.idUser}`);
      setUser(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur de chargement", "Le user n'ont pas pu être chargées.");
    }
  };

  const fetchUserPosts = async () => { 
    try {
      const response = await axios.get(`http://sp.cluster-ig4.igpolytech.fr/api/publicationUser/user/${userData.idUser}`);
      if (response.data.length > 0) {
        const sortedPosts = response.data.sort((a, b) => moment(a.date).diff(moment(b.date)));
        setPosts(sortedPosts);
      } else {
        setPosts(response.data);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur de chargement", "Les posts n'ont pas pu être chargés.");
    }
  };

  const toggleSubscription = async () => {
    if (isSubscribed) {
      try {
        await axios.delete(`http://sp.cluster-ig4.igpolytech.fr/api/abonnes/${currentUserId}/${userData.idUser}`);
        setIsSubscribed(false);
        setFollowersCount(followersCount - 1); 
      } catch (error) {
        console.error(error);
        Alert.alert("Erreur", "Le processus de désabonnement a échoué.");
      }
    } else {
      try {
        await axios.post(`http://sp.cluster-ig4.igpolytech.fr/api/abonnes/${currentUserId}/${userData.idUser}`);
        setIsSubscribed(true);
        setFollowersCount(followersCount + 1); 
      } catch (error) {
        console.error(error);
        Alert.alert("Erreur", "Le processus d'abonnement a échoué.");
      }
    }
  };
  const checkSubscription = async () => {
    try {
        const response = await axios.get(`http://sp.cluster-ig4.igpolytech.fr/api/abonnes/isFollower/${currentUserId}/${userData.idUser}`);
        setIsSubscribed(response.data);
    } catch (error) {
        console.error("Error checking subscription status:", error);
        if (error.response) {
            console.error("Server responded with status:", error.response.status);
            console.error("Response data:", error.response.data);
            console.error("Response headers:", error.response.headers);
        } else if (error.request) {
            console.error("No response received from the server:", error.request);
        } else {
            console.error("Error setting up the request:", error.message);
        }
        Alert.alert("Erreur de vérification", "Impossible de vérifier l'état d'abonnement.");
    }
};


  useFocusEffect(
    useCallback(() => {

        const fetchUserFollowersAndFollowings = async () => {
            try {
              const followersResponse = await axios.get(`http://sp.cluster-ig4.igpolytech.fr/api/abonnes/followers/${userData.idUser}`);
              const followingsResponse = await axios.get(`http://sp.cluster-ig4.igpolytech.fr/api/abonnes/following/${userData.idUser}`);
              setFollowersCount(followersResponse.data.length);
              setFollowingsCount(followingsResponse.data.length);
            } catch (error) {
              console.error(error);
              Alert.alert("Erreur de chargement", "Les données d'abonnés n'ont pas pu être chargées.");
            }
          };
      
      getCurrentUserId();
      fetchUserDetails();
      fetchUserPosts();
      fetchUserFollowersAndFollowings();
    }, [userData.idUser, currentUserId])
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
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonContainer}>
        <AntDesign name="arrowleft" size={26} color="#BD4F6C" />
      </TouchableOpacity>
      <ScrollView style={styles.scrollview}>
      <View style={styles.headerContainer}>
            <Image source={require('../../assets/avatar.png')} style={styles.avatar} />
            <View style={styles.userInfoContainer}>
                <Text style={styles.bold}>{user.pseudo}</Text>
                <Text style={styles.teamName}>{user.Equipe?.nom}</Text>
                <Text style={styles.center}>{user.biographie || "Veuillez saisir votre biographie..."}</Text>
                <View style={styles.subscriptionContainer}>
                <View style={styles.followersInfo}>
                    <Text style={styles.boldNumbers}>{followersCount}</Text>
                    <Text>abonnés</Text>
                </View>
                <View style={styles.followingsInfo}>
                    <Text style={styles.boldNumbers}>{followingsCount}</Text>
                    <Text>abonnements</Text>
                </View>
                <TouchableOpacity style={isSubscribed ? styles.unsubscribeButton : styles.subscribeButton} onPress={toggleSubscription}>
                    <Text style={styles.buttonText}>{isSubscribed ? 'Se désabonner' : 'S\'abonner'}</Text>
                </TouchableOpacity>
                </View>
                <View style={styles.postItemList}>
                    {posts.map((post, index) => (
                        <PostComponent
                        key={index}
                        post={post}
                        onPostPress={() => navigation.navigate('PostDetails', { post })}
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
  scrollview: {
    marginTop: "-15%"
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
  bold: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center',
    fontWeight: 'bold'
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
    textAlign: 'center',
    color: '#333333'  
  },
  boldNumbers: {
    fontWeight: 'bold',
    marginRight: "5%" 
  },
  backButtonContainer: {
    marginLeft: "4%",
    marginTop: "8%",
    zIndex: 100
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  subscriptionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: "3%"
  },
  followersInfo: {
    flex: 1,
    flexDirection: 'row', 
    justifyContent: 'center',
    alignItems: 'center', 
  },
  followingsInfo: {
    flex: 1,
    flexDirection: 'row', 
    justifyContent: 'center',
    alignItems: 'center', 
  },
  subscribeButton: {
    flex: 1,
    backgroundColor: '#008900',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 15,
    marginLeft: "10%"
  },
  unsubscribeButton: {
    flex: 1,
    backgroundColor: '#5D2E46',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 15,
    marginLeft: "8%",
  },
});

export default ProfileUserPage;
