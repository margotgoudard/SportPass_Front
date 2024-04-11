import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


import Navbar from './screens/Navbar.js';
import LoginPage from './screens/LoginPage.js';
import RegisterPage from './screens/RegisterPage.js';
import UserProfilePage from './screens/ProfilPage.js';
import PostDetailsPage from './screens/PostDetailsPage.js';
import ModificationProfilPage from './screens/ModificationProfilPage.js';
import PassPage from './screens/PassPage.js'
import BilletPage from './screens/BilletsPage.js'
import CommercantPage from './screens/CommercantPage.js'

const screenOptions = {
  tabBarShowLabel : false,
  headerShown : false,
  tabBarStyle : {
    position: "absolue",
    bottom : 0,
    right : 0,
    left : 0,
    elevation : 0,
    height : 60,
    backgroundColor : "#D9D9D9"
  }
}

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
        <Stack.Screen name="Register" component={RegisterPage}  options={{ headerShown: false }}  />
        <Stack.Screen name="Profil" component={UserProfilePage}  options={{ headerShown: false }}  />
        <Stack.Screen name="PostDetails" component={PostDetailsPage}  options={{ headerShown: false }} />
        <Stack.Screen name="ModificationProfil" component={ModificationProfilPage}  options={{ headerShown: false }} />
        <Stack.Screen name="Pass" component={PassPage}  options={{ headerShown: false }}  />
        <Stack.Screen name="Billet" component={BilletPage}  options={{ headerShown: false }}  />
        <Stack.Screen name="Commercant" component={CommercantPage}  options={{ headerShown: false }}  />
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
