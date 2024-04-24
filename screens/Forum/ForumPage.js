import * as React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ClubPage from './ClubForumPage';
import CommunautePage from './CommunauteForumPage';
import { Image, ImageBackground, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native';

const Tab = createMaterialTopTabNavigator();

const ForumPage = () => {
    return (
        <ImageBackground source={require('../../assets/background.png')} style={styles.background}>
            <View style={styles.logoContainer}>
                <Image source={require('../../assets/logo.png')} style={styles.logo} />
            </View>
            <ScrollView style={styles.tabsContainer}>
                <Tab.Navigator
                    screenOptions={{
                        tabBarStyle: {
                            ...styles.tabBar,
                            elevation: 0, 
                            shadowOpacity: 0, 
                        },
                        tabBarIndicatorContainerStyle: {
                            backgroundColor: "#D9D9D9",
                        },
                        tabBarActiveTintColor: 'black',
                        tabBarInactiveTintColor: 'gray',
                        tabBarIndicatorStyle: { backgroundColor: 'green' },
                    }}
                >
                    <Tab.Screen name="Club" component={ClubPage} />
                    <Tab.Screen name="Communaute" component={CommunautePage} />
                </Tab.Navigator>
            </ScrollView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1
    },
    logoContainer: {
        marginLeft: "4%",
        marginTop: "5%",
    },
    logo: {
        width: "50%",
        height: "50%", 
        resizeMode: 'contain' 
    },
    tabsContainer: {
        flex: 1,
        marginTop: "-50%",
        marginLeft: "4%",
        marginRight: "4%", 
        backgroundColor: 'transparent' 
    },
    tabBar: {
        marginRight:"18%"   
    }
});

export default ForumPage;
