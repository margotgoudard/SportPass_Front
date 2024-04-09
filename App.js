import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import LoginPage from './screens/login.js';
import RegisterPage from './screens/register.js';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Accueil from'./screens/Accueil.js';
import Billeterie from'./screens/Billeterie.js';
import Commercant from'./screens/Commercant.js';
import Forum from'./screens/Forum.js';

//icons
import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

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


function AuthNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginPage} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen name="Register" component={RegisterPage}  options={{ headerShown: false }}  />
        </Stack.Navigator>
  );
}

function HomeTabNavigator() {
  return (
    <Tab.Navigator screenOptions={screenOptions} >
          <Tab.Screen 
          name="Accueil" 
          component={Accueil}
          options={{
            tabBarIcon : ({focused}) => {
              return(
                <View style={{alignItems:"center", justifyContent:"center"}}>
                  <Entypo name="home" size={30} color={focused? "#008900":"#111"} />
                </View>
              )
            }
          }}
          />

          <Tab.Screen 
          name="Commercant" 
          component={Commercant} 
          options={{
            tabBarIcon : ({focused}) => {
              return(
                <View style={{alignItems:"center", justifyContent:"center"}}>
                  <FontAwesome5 name="map-marker-alt" size={25} color={focused? "#008900":"#111"} />
                </View>
              )
            }
          }}
          />

          <Tab.Screen 
          name="Billeterie" 
          component={Billeterie} 
          options={{
            tabBarIcon : ({focused}) => {
              return(
                <View style={{alignItems:"center", justifyContent:"center"}}>
                  <MaterialCommunityIcons name="ticket-confirmation" size={30} color={focused? "#008900":"#111"} />
                </View>
              )
            }
          }}
          />
          <Tab.Screen name="Forum" 
          component={Forum} 
          options={{
            tabBarIcon : ({focused}) => {
              return(
                <View style={{alignItems:"center", justifyContent:"center"}}>
                  <MaterialIcons name="forum"  size={30} color={focused? "#008900":"#111"} />
                </View>
              )
            }
          }}
          />
          <Tab.Screen 
          name="Profil" 
          component={LoginPage}
          options={{
            tabBarIcon : ({focused}) => {
              return(
                <View style={{alignItems:"center", justifyContent:"center"}}>
                  <FontAwesome5 name="user-alt" size={25} color={focused? "#008900":"#111"} />
                </View>
              )
            }
          }}
          /> 
        </Tab.Navigator>
  );
}

export default function App() {
  console.log(LoginPage, RegisterPage);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="Register" component={RegisterPage} />
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
