import React, { useState } from 'react';
import { View, Text, Image, TextInput, ImageBackground, Alert, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import URLS from '../../urlConfig.js';

const ModificationProfilPage = ({ route }) => {
  const { user } = route.params;
  const navigation = useNavigation();

  const [updatedUser, setUpdatedUser] = useState(user);

  const handleUpdate = async () => {
    try {
      await axios.put(`${URLS.url}/user/${user.idUser}`, updatedUser);
      const response = await axios.get(`${URLS.url}/user/${user.idUser}`);
      const userData = response.data;
      navigation.navigate('ProfilPage', { userData });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil :', error);
    }
  };

  const deleteProfile = async () => {
    Alert.alert(
      "Suppression du compte",
      "Êtes-vous sûr ? Votre compte sera définitivement supprimé.",
      [
        {
          text: "Non",
          style: "cancel"
        },
        { 
          text: "Oui", onPress: async () => {
            try {
              await axios.delete(`${URLS.url}/user/${user.idUser}`);
              navigation.navigate('Login');
            }
            catch (error) {
              console.error('Erreur lors de la suppression du profil :', error);
            }
          } 
        }
      ]
    );
  };

  return (
    <ImageBackground source={require('../../assets/background.png')} style={styles.container}>
      <ScrollView>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonContainer}>
            <AntDesign name="arrowleft" size={26} color="#BD4F6C" />
          </TouchableOpacity>
          <TouchableOpacity onPress={deleteProfile}> 
            <Text style={styles.deleteProfileText}>Supprimer</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.headerContainer}>
          <Image source={require('../../assets/avatar.png')} style={styles.avatar} />
          <View style={styles.modifcontainer}>
            <Text style={styles.inputLabel}>Pseudo</Text>
            <TextInput
              style={styles.input}
              value={updatedUser.pseudo}
              onChangeText={(text) => setUpdatedUser({ ...updatedUser, pseudo: text })}
              placeholder="Pseudo"
            />
            <Text style={styles.inputLabel}>Biographie</Text>
            <TextInput
              style={styles.input}
              value={updatedUser.biographie}
              onChangeText={(text) => setUpdatedUser({ ...updatedUser, biographie: text })}
              placeholder="Biographie"
            />
            <Text style={styles.inputLabel}>Nom</Text>
            <TextInput
              style={styles.input}
              value={updatedUser.nom}
              onChangeText={(text) => setUpdatedUser({ ...updatedUser, nom: text })}
              placeholder="Nom"
            />
            <Text style={styles.inputLabel}>Prénom</Text>
            <TextInput
              style={styles.input}
              value={updatedUser.prenom}
              onChangeText={(text) => setUpdatedUser({ ...updatedUser, prenom: text })}
              placeholder="Prenom"
            />
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              value={updatedUser.mail}
              onChangeText={(text) => setUpdatedUser({ ...updatedUser, mail: text })}
              placeholder="Adresse e-mail"
            />
            <Text style={styles.inputLabel}>Téléphone</Text>
            <TextInput
              style={styles.input}
              value={updatedUser.tel}
              onChangeText={(text) => setUpdatedUser({ ...updatedUser, tel: text })}
              placeholder="Numéro de téléphone"
            />
            <Text style={styles.inputLabel}>Adresse Postale</Text>
            <TextInput
              style={styles.input}
              value={updatedUser.adresse}
              onChangeText={(text) => setUpdatedUser({ ...updatedUser, adresse: text })}
              placeholder="Adresse"
            />
            <TouchableOpacity onPress={handleUpdate} style={styles.button}>
              <Text style={styles.buttonText}>Valider</Text>
              <FontAwesome name="send" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    headerContainer: {
        alignItems: 'center',
        padding: 20,
        paddingTop: 40
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        position: 'absolute', 
        top: 40, 
        alignSelf: 'center', 
        zIndex: 1, 
    },
    modifcontainer: {
        width: '112%', 
        backgroundColor: '#D9D9D9',
        borderRadius: 20,
        padding: 20,
        paddingTop: 60,
        marginTop: 50,
        position: 'relative',
    },
    input: {
        height: 40,
        backgroundColor: 'white', 
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderWidth: 0, 
    },
    inputGroup: {
        marginBottom: 15, 
    },
    inputLabel: {
        fontWeight: 'bold',
        marginBottom: 5, 
    },
    icon: {
        width: 20,
        height: 20,
        marginRight: 5,
    },
    button: {
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#008900', 
        borderRadius: 10,
        padding: 10,
    },
    buttonText: {
        color: 'white', 
        marginRight: 5,
        fontSize: 17 
    },
    backButtonContainer: {
        marginLeft: "4%",
        marginTop: "8%",
    },
    deleteProfileText: {
        color: '#5D2E46',
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: "25%",
    },
    topBar: {
        position: 'absolute',
        left: 20,
        right: 20, 
        flexDirection: 'row',
        justifyContent: 'space-between', 
        alignItems: 'center', 
    },
});

export default ModificationProfilPage;
