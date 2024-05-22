import React, { useState, useCallback } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Accueil from '../screens/Accueil/AccueilPage';
import AccueilPageNotConnected from '../screens/Accueil/AccueilPageNotConnected';
import PostClubDetailsPage from '../screens/Forum/PostClubDetailsPage';

const Stack = createStackNavigator();

export default function AccueilNavigator() {
  return (
    <Stack.Navigator >
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
      <Stack.Screen
        name="PostClubDetails"
        component={PostClubDetailsPage}
        options={{ headerShown: false }}
      />

 
    </Stack.Navigator>
  );
}
