import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from '../screens/Profil/LoginPage';
import RegisterPage from '../screens/Profil/RegisterPage';
import UserProfilPage from '../screens/Profil/ProfilPage';
import PostDetailsPage from '../screens/Profil/PostDetailsPage.js';
import ModificationProfilPage from '../screens/Profil/ModificationProfilPage.js';
import PassPage from '../screens/Profil/PassPage.js'
import BilletPage from '../screens/Profil/BilletsPage.js'
import CommercantFavoris from '../screens/Profil/CommercantFavorisPage.js'

const Stack = createStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen 
        name="Login" 
        component={LoginPage} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterPage}  
        options={{ headerShown: false }}  
      />
      <Stack.Screen 
        name="Profil" 
        component={UserProfilPage}  
        options={{ headerShown: false }}  
      />
        <Stack.Screen name="PostDetails" component={PostDetailsPage}  options={{ headerShown: false }} />
        <Stack.Screen name="ModificationProfil" component={ModificationProfilPage}  options={{ headerShown: false }} />
        <Stack.Screen name="Pass" component={PassPage}  options={{ headerShown: false }}  />
        <Stack.Screen name="Billet" component={BilletPage}  options={{ headerShown: false }}  />
        <Stack.Screen name="CommercantFavoris" component={CommercantFavoris}  options={{ headerShown: false }}  />
    </Stack.Navigator>
  );
}
