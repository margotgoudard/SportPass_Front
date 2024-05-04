import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


import Navbar from './components/Navbar.js';
import AuthNavigator from './Navigation/AuthNavigator.js';
import ForumNavigator from './Navigation/ForumNavigator.js';
import CommercantNavigator from './Navigation/CommercantNavigator.js';

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
        <Stack.Screen
          name="Forum"
          component={ForumNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Commercant"
          component={CommercantNavigator}
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
