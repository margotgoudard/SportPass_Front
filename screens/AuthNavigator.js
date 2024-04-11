import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from './Login';
import RegisterPage from './Register';

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
    </Stack.Navigator>
  );
}
