import React, { useState, useCallback } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ForumPage from '../screens/Forum/ForumPage';
import PostDetailsPage from '../screens/Profil/PostDetailsPage';
import PostClubDetailsPage from '../screens/Forum/PostClubDetailsPage';
import ProfileUserPage from '../screens/Profil/ProfilUserPage';
import ProfilePage from '../screens/Profil/ProfilPage';

const Stack = createStackNavigator();

export default function ForumNavigator() {
 
  return (
    <Stack.Navigator>
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
        name="PostClubDetails"
        component={PostClubDetailsPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProfilUser"
        component={ProfileUserPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProfilPage"
        component={ProfilePage}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
