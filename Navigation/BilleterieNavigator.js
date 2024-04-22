import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MatchsPage from '../screens/Billeterie/MatchsPage.js';
import TribunePage from '../screens/Billeterie/TribunePage.js';
import PlacePage from '../screens/Billeterie/PlacePage.js';
import PaiementPage from '../screens/Billeterie/PaiementPage.js';
import ResumePage from '../screens/Billeterie/ResumePage.js';

const Stack = createStackNavigator();

export default function BilleterieNavigation() {
  return (
    <Stack.Navigator initialRouteName="Matchs">
      <Stack.Screen 
        name="Matchs" 
        component={MatchsPage} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Tribune" 
        component={TribunePage}  
        options={{ headerShown: false }}  
      />
      <Stack.Screen 
        name="Place" 
        component={PlacePage}  
        options={{ headerShown: false }}  
      />
      <Stack.Screen 
        name="Paiement" 
        component={PaiementPage}  
        options={{ headerShown: false }}  
      />
      <Stack.Screen 
        name="Résumé" 
        component={ResumePage}  
        options={{ headerShown: false }}  
      />
    </Stack.Navigator>
  );
}
