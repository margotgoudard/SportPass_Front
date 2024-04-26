import React, { useState, useCallback } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ForumPage from '../screens/Forum/ForumPage';
import PostDetailsPage from '../screens/Profil/PostDetailsPage';
import LoginPage from '../screens/Profil/LoginPage';
import PostClubDetailsPage from '../screens/Forum/PostClubDetailsPage';
import ProfileUserPage from '../screens/Forum/ProfilUserPage';

const Stack = createStackNavigator();

export default function ForumNavigator() {
  const [initialRoute, setInitialRoute] = useState('Login');

  useFocusEffect(
    useCallback(() => {
      const checkToken = async () => {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          setInitialRoute('ForumPage');
        } else {
          setInitialRoute('Login');
        }
      };

      checkToken();
    }, [])
  );

  return (
    <Stack.Navigator initialRouteName={initialRoute}>
      <Stack.Screen 
        name="ForumPage" 
        component={ForumPage} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen
        name="PostDetails"
        component={PostDetailsPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Login" 
        component={LoginPage} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen
        name="PostClubDetails"
        component={PostClubDetailsPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProfilUser"
        component={ProfileUserPage}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
