import React, { useState, useCallback } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';

import Accueil from'../screens/Accueil/AccueilPage.js';
import ForumNavigation from'../Navigation/ForumNavigator.js';
import AuthNavigator from '../Navigation/AuthNavigator.js';
import BilleterieNavigation from '../Navigation/BilleterieNavigator.js';
import CommercantNavigator from '../Navigation/CommercantNavigator.js';

//icons
import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import AccueilNavigator from '../Navigation/AccueilNavigator.js';


const Tab = createBottomTabNavigator();

const screenOptions = {
  tabBarShowLabel: false,
  headerShown: false,
  tabBarStyle: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    elevation: 0,
    height: 60,
    backgroundColor: "#D9D9D9"
  }
}

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigation = useNavigation();


  useFocusEffect(() => {
    const checkUserToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        setIsLoggedIn(!!token);
      } catch (error) {
        console.error('Erreur lors de la récupération du token:', error);
        setIsLoggedIn(false);
      }
    };

    checkUserToken();
  });

  const checkTokenAndNavigateForum = useCallback(async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      navigation.navigate('Navbar', {screen:'Forum',params: { screen: 'ForumPage' }});
    } else {
      navigation.navigate('Navbar', {screen:'Profil',params: { screen: 'Login' }});
    }
  }, [navigation]);

  const checkTokenAndNavigateCommercant = useCallback(async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      navigation.navigate('Navbar', {screen:'Commercant',params: { screen: 'CommercantPage' }});
    } else {
      navigation.navigate('Navbar', {screen:'Profil',params: { screen: 'Login' }});
    }
  }, [navigation]);

  const checkTokenAndNavigateAccueil = useCallback(async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      navigation.navigate('Navbar', {screen:'Accueil',params: { screen: 'AccueilPage' }});
    } else {
      navigation.navigate('Navbar', {screen:'Profil',params: { screen: 'Login' }});
    }
  }, [navigation]);

  const checkTokenAndNavigateProfil = useCallback(async () => {

    const token = await AsyncStorage.getItem('userToken');
    const userId = await AsyncStorage.getItem('userId');

    if (token) {
      const response = await axios.get(`http://10.0.2.2:4000/api/user/${userId}`);
      const user = response.data;
      navigation.navigate('Navbar', {screen:'Profil',params: { screen: 'ProfilPage', params: {userData : user} }});
    } else {
      navigation.navigate('Navbar', {screen:'Profil',params: { screen: 'Login' }});
    }
  }, [navigation]);

  return (
    <Tab.Navigator screenOptions={screenOptions} >
      <Tab.Screen
        name="Accueil"
        component={AccueilNavigator}
        listeners={({ navigation }) => ({
          tabPress: async (e) => {
            e.preventDefault();
            checkTokenAndNavigateAccueil(navigation);
          },
        })}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Entypo name="home" size={30} color={focused ? "#008900" : "#111"} />
            </View>
          )
        }}
      />

      <Tab.Screen
        name="Commercant"
        component={CommercantNavigator}
        listeners={({ navigation }) => ({
          tabPress: async (e) => {
            e.preventDefault();
            checkTokenAndNavigateCommercant(navigation);
          },
        })}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <FontAwesome5 name="map-marker-alt" size={25} color={focused ? "#008900" : "#111"} />
            </View>
          )
        }}
      />

      <Tab.Screen
        name="Billeterie"
        component={BilleterieNavigation}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <MaterialCommunityIcons name="ticket-confirmation" size={30} color={focused ? "#008900" : "#111"} />
            </View>
          )
        }}
      />
      <Tab.Screen
        name="Forum"
        component={ForumNavigation}
        listeners={({ navigation }) => ({
          tabPress: async (e) => {
            e.preventDefault();
            checkTokenAndNavigateForum(navigation);
          },
        })}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <MaterialIcons name="forum" size={30} color={focused ? "#008900" : "#111"} />
            </View>
          )
        }}
      />
      <Tab.Screen
        name="Profil"
        component={AuthNavigator}
        listeners={({ navigation }) => ({
          tabPress: async (e) => {
            e.preventDefault();
            checkTokenAndNavigateProfil(navigation);
          },
        })}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <FontAwesome5 name={isLoggedIn ? "user-alt" : "sign-in-alt"} size={25} color={focused ? "#008900" : "#111"} />
            </View>
          )
        }}
      />
    </Tab.Navigator>
  );
}
