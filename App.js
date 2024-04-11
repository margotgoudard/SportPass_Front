import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import LoginPage from './screens/Login.js';
import RegisterPage from './screens/Register.js';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Navbar from './screens/Navbar.js';

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
  console.log(LoginPage, RegisterPage);

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
