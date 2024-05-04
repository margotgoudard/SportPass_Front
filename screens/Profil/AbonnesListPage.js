import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'; 
import { useNavigation } from '@react-navigation/native';

const AbonnesListPage = ({ route }) => {
  const { followers, followings, type } = route.params;
  const [selectedTab, setSelectedTab] = useState(type);
  const navigation = useNavigation();
  const [currentUserId, setCurrentUserId] = useState(0);
  const [subscriptionStatus, setSubscriptionStatus] = useState({});

  const navigateToProfile = async (follower) => {
    const userId = await getUserId();
    if (follower.idUser == userId) {
      navigation.navigate('ProfilPage', { userData: follower });
    } else {
      navigation.navigate('ProfilUser', { userData: follower });
    }
  };

  const getUserId = async () => {
    const idUser = await AsyncStorage.getItem('userId');
    return idUser;
  };

  const toggleSubscription = async (user) => {
    const currentUserId = await AsyncStorage.getItem('userId');
    const isUserSubscribed = subscriptionStatus[user.idUser];
    try {
      if (isUserSubscribed) {
        await axios.delete(`http://10.0.2.2:4000/api/abonnes/${currentUserId}/${user.idUser}`);
      } else {
        await axios.post(`http://10.0.2.2:4000/api/abonnes/${currentUserId}/${user.idUser}`);
      }
      setSubscriptionStatus(prevStatus => ({
        ...prevStatus,
        [user.idUser]: !isUserSubscribed
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const getCurrentUserId = async () => {
    try {
      const idUser = await AsyncStorage.getItem('userId');
      setCurrentUserId(idUser);
      await checkSubscription();
    } catch (error) {
      console.error("Error getting current user id:", error);
    }
  };

  useEffect(() => {
    getCurrentUserId();
  }, []);

  const checkSubscription = async () => {
    const currentUserId = await AsyncStorage.getItem('userId');
    const newSubscriptionStatus = {};
    try {
      const responses = await Promise.all(
        followers.map(async follower => {
          const response = await axios.get(`http://10.0.2.2:4000/api/abonnes/isFollower/${currentUserId}/${follower.idUser}`);
          newSubscriptionStatus[follower.idUser] = response.data;
        })
      );
      setSubscriptionStatus(newSubscriptionStatus);
    } catch (error) {
      console.error("Error checking subscription status:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonContainer}>
        <AntDesign name="arrowleft" size={26} color="#BD4F6C" />
      </TouchableOpacity>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabItem, selectedTab === 'followers' ? styles.selectedTab : null]}
          onPress={() => setSelectedTab('followers')}
        >
          <Text style={styles.tabText}>Abonnés</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabItem, selectedTab === 'followings' ? styles.selectedTab : null]}
          onPress={() => setSelectedTab('followings')}
        >
          <Text style={styles.tabText}>Abonnements</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.listContainer}>
        {selectedTab === 'followers' && followers.map((follower, index) => (
          <TouchableOpacity onPress={() => navigateToProfile(follower)} key={index} style={styles.userContainer}>
            <View style={styles.userInfo}>
              <MaterialCommunityIcons name="account-circle-outline" size={32} color="black" style={styles.postProfileImage} />
              <Text style={styles.username}>{follower.pseudo}</Text>
            </View>
            <TouchableOpacity style={subscriptionStatus[follower.idUser] ? styles.unsubscribeButton : styles.subscribeButton} onPress={() => toggleSubscription(follower)}>
              <Text style={styles.buttonText}>{subscriptionStatus[follower.idUser] ? 'Se désabonner' : 'S\'abonner'}</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
        {selectedTab === 'followings' && followings.map((following, index) => (
          <TouchableOpacity onPress={() => navigateToProfile(following)} key={index} style={styles.userContainer}>
            <View style={styles.userInfo}>
              <MaterialCommunityIcons name="account-circle-outline" size={32} color="black" style={styles.postProfileImage} />
              <Text style={styles.username}>{following.pseudo}</Text>
            </View>
            <TouchableOpacity style={subscriptionStatus[following.idUser] ? styles.unsubscribeButton : styles.subscribeButton} onPress={() => toggleSubscription(following)}>
              <Text style={styles.buttonText}>{subscriptionStatus[following.idUser] ? 'Se désabonner' : 'S\'abonner'}</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  backButtonContainer: {
    marginLeft: "4%",
    marginTop: "8%",
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  selectedTab: {
    borderBottomColor: '#008900',
  },
  tabText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  listContainer: {
    marginLeft: "5%"
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postProfileImage: {
    marginRight: 10,
  },
  username: {
    fontSize: 16,
  },
  subscribeButton: {
    backgroundColor: '#008900',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  unsubscribeButton: {
    backgroundColor: '#5D2E46',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default AbonnesListPage;
