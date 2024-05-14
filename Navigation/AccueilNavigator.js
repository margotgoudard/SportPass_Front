import React, { useState, useCallback } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginPage from '../screens/Profil/LoginPage';
import Accueil from '../screens/Accueil/AccueilPage';
import AccueilPageNotConnected from '../screens/Accueil/AccueilPageNotConnected';

const Stack = createStackNavigator();

export default function AccueilNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="AccueilPage" 
        component={Accueil} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="AccueilPageNotConnected" 
        component={AccueilPageNotConnected} 
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );
}
