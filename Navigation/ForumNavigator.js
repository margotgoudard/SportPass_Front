import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ForumPage from '../screens/Forum/ForumPage';
import PostDetailsPage from '../screens/Profil/PostDetailsPage';

const Stack = createStackNavigator();

export default function ForumNavigator() {
  return (
    <Stack.Navigator initialRouteName="ForumPage">
      <Stack.Screen 
        name="ForumPage" 
        component={ForumPage} 
        options={{ headerShown: false }} 
      />
        <Stack.Screen name="PostDetails" component={PostDetailsPage}  options={{ headerShown: false }} />
    </Stack.Navigator>
    
  );
}
