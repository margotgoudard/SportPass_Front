import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons, Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';

const ProfileHeader = ({ user, handleNavigation, followersCount, followingsCount, followers, followings, calculateProfileCompletion }) => {
  return (
    <View style={styles.headerContainer}>
      <Image source={require('../../assets/avatar.png')} style={styles.avatar} />
      <View style={styles.userInfoContainer}>
        <View style={styles.vipStatusContainer}>
          <Text style={styles.vipStatus}>
            Palier {user.Palier?.nom}
          </Text>
          <MaterialCommunityIcons name="flag-checkered" size={24} color="#008900" style={styles.palierImage} />
        </View>
        <Text style={styles.bold}>{user.pseudo}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "center" }}>
          {user.Equipe?.logo && (
            <Image source={{ uri: user.Equipe.logo }} style={{ width: 50, height: 50, marginRight: 10 }} />
          )}
          <Text style={styles.teamName}>{user.Equipe?.nom}</Text>
        </View>
        <Text style={styles.center}>{user.biographie || "Veuillez saisir votre biographie..."}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
          <TouchableOpacity onPress={() => handleNavigation('followers')}>
            <Text>
              <Text style={styles.boldNumbers}>{followersCount}</Text> abonnés
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleNavigation('followings')}>
            <Text style={styles.text}>
              <Text style={styles.boldNumbers}>{followingsCount}</Text> abonnements
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.details}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="mail" size={22} color="black" />
            <Text style={{ marginLeft: 15 }}>{user.mail}</Text>
          </View>
        </Text>
        <Text style={styles.details}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <FontAwesome name="phone" size={24} color="black" />
            <Text style={{ marginLeft: 17 }}>{user.tel || "Veuillez saisir votre téléphone..."}</Text>
          </View>
        </Text>
        <Text style={styles.details}>
          <View style={{ flexDirection: 'row', alignItems: 'center'}}>
            <MaterialIcons name="location-pin" size={24} color="black" />
            <Text style={{ marginLeft: 13 }}>{user.adresse || "Veuillez saisir votre adresse..."}</Text>
          </View>
        </Text>
        {calculateProfileCompletion(user) < 100 && (
          <>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${calculateProfileCompletion(user)}%` }]} />
            </View>
            <Text style={[styles.progressBarText, calculateProfileCompletion(user) === 100 ? styles.profileCompleted : {}]}>
              {`${Math.round(calculateProfileCompletion(user))}% de votre profil est complet`}
            </Text>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    headerContainer: {
      alignItems: 'center',
      paddingTop: 40, 
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      position: 'absolute', 
      top: -70, 
      alignSelf: 'center', 
      zIndex: 1, 
    },
    userInfoContainer: {
      width: '100%', 
      backgroundColor: '#D9D9D9',
      borderRadius: 20,
    },
    vipStatusContainer: {
      position: 'absolute',
      top: -50,
      right: 10,
      borderRadius: 20,
      flexDirection: 'row',
    },
    vipStatus: {
      color: '#008900',
      fontWeight: 'bold',
      fontSize: 15
    },
    text: {
      marginLeft: "10%"
    },
    details: {
      fontSize: 16,
    },
    teamName: {
      fontSize: 16,
      color: '#008900', 
      fontWeight: 'bold',
      textAlign: 'center'
    },
    center: {
      fontSize: 16,
      textAlign: 'center'
    },
    bold: {
      fontSize: 16,
      textAlign: 'center',
      fontWeight: 'bold'
    },
    progressBarContainer: {
      height: 10,
      width: '100%',
      backgroundColor: 'black',
      borderRadius: 10,
      marginTop: 10,
    },
    progressBar: {
      height: '100%',
      backgroundColor: '#008900',
      borderRadius: 10,
    },
    progressBarText: {
      textAlign: 'center',
      marginTop: 5,
    },
    palierImage: {
      width: 20, 
      height: 20, 
      marginLeft: 5, 
    },
    boldNumbers: {
      fontWeight: 'bold',
      fontSize: 16, 
    },
    profileCompleted: {
      textDecorationLine: 'underline',
      color: '#008900',
    }
  });

export default ProfileHeader;
