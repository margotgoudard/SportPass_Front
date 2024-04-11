import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';


import LoginPage from './Login.js';
import RegisterPage from './Register.js';
import Accueil from'./Accueil.js';
import Billeterie from'./Billeterie.js';
import Commercant from'./Commercant.js';
import Forum from'./Forum.js';
import AuthNavigator from './AuthNavigator.js';

//icons
import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const screenOptions = {
  tabBarShowLabel: false,
  headerShown: false,
  tabBarStyle: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    elevation: 0,
    height: 60,
    backgroundColor: "#D9D9D9"
  }
}

export default function Navbar() {
  return (
    <Tab.Navigator screenOptions={screenOptions} >
      <Tab.Screen
        name="Accueil"
        component={Accueil}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Entypo name="home" size={30} color={focused ? "#008900" : "#111"} />
            </View>
          )
        }}
      />

      <Tab.Screen
        name="Commercant"
        component={Commercant}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <FontAwesome5 name="map-marker-alt" size={25} color={focused ? "#008900" : "#111"} />
            </View>
          )
        }}
      />

      <Tab.Screen
        name="Billeterie"
        component={Billeterie}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <MaterialCommunityIcons name="ticket-confirmation" size={30} color={focused ? "#008900" : "#111"} />
            </View>
          )
        }}
      />
      <Tab.Screen name="Forum"
        component={Forum}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <MaterialIcons name="forum" size={30} color={focused ? "#008900" : "#111"} />
            </View>
          )
        }}
      />
      <Tab.Screen
        name="Profil"
        component={AuthNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <FontAwesome5 name="user-alt" size={25} color={focused ? "#008900" : "#111"} />
            </View>
          )
        }}
      />
    </Tab.Navigator>
  );
}
