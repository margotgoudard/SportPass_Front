import React, { useState, useCallback } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginPage from '../screens/Profil/LoginPage';
import CommercantPage from '../screens/Commercant/CommercantPage';

const Stack = createStackNavigator();

export default function CommercantNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="CommercantPage" 
        component={CommercantPage} 
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );
}
