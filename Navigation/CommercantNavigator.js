import React, { useState, useCallback } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginPage from '../screens/Profil/LoginPage';
import CommercantPage from '../screens/Commercant/CommercantPage';

const Stack = createStackNavigator();

export default function CommercantNavigator() {
  const [initialRoute, setInitialRoute] = useState('Login');

  useFocusEffect(
    useCallback(() => {
      const checkToken = async () => {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          setInitialRoute('CommercantPage');
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
        name="CommercantPage" 
        component={CommercantPage} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Login" 
        component={LoginPage} 
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );
}
