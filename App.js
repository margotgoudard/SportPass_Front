import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


import Navbar from './components/Navbar.js';
import UserProfilePage from './screens/Profil/ProfilPage.js';
import PostDetailsPage from './screens/Profil/PostDetailsPage.js';
import ModificationProfilPage from './screens/Profil/ModificationProfilPage.js';
import PassPage from './screens/Profil/PassPage.js'
import BilletPage from './screens/Profil/BilletsPage.js'
import CommercantFavoris from './screens/Profil/CommercantFavorisPage.js'
import AuthNavigator from './Navigation/AuthNavigator.js';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Navbar"
          component={Navbar}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Auth"
          component={AuthNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Profil" component={UserProfilePage}  options={{ headerShown: false }}  />
        <Stack.Screen name="PostDetails" component={PostDetailsPage}  options={{ headerShown: false }} />
        <Stack.Screen name="ModificationProfil" component={ModificationProfilPage}  options={{ headerShown: false }} />
        <Stack.Screen name="Pass" component={PassPage}  options={{ headerShown: false }}  />
        <Stack.Screen name="Billet" component={BilletPage}  options={{ headerShown: false }}  />
        <Stack.Screen name="CommercantFavoris" component={CommercantFavoris}  options={{ headerShown: false }}  />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
