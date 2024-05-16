import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Alert, ImageBackground, Image } from 'react-native';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';
import URLS from '../../urlConfig.js';

const RegisterPage = () => {
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [mail, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [idEquipe, setIdEquipe] = useState(null);
  const [equipes, setEquipes] = useState([]);
  const [open, setOpen] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchEquipes = async () => {
      try {
        const response = await axios.get(`${URLS.url}/equipe`);
        setEquipes(response.data.map(equipe => ({ label: equipe.nom, value: equipe.idEquipe })));
      } catch (error) {
        console.error(error);
        Alert.alert("Erreur de chargement", "Les équipes n'ont pas pu être chargées.");
      }
    };
    fetchEquipes();
  }, []);

  const handleRegister = () => {
    const apiUrl = `${URLS.url}/registration`;
    axios.post(apiUrl, { prenom, nom, mail, password, idEquipe })
      .then(response => {
        Alert.alert("Inscription réussie", "Votre compte a été créé avec succès.");
      })
      .catch(error => {
        console.error(error);
        Alert.alert("Erreur d'inscription", "Une erreur est survenue lors de l'inscription.");
      });
  };

  return (
    <ImageBackground source={require('../../assets/background.png')} style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
      </View>
      <Text style={styles.header}>Inscription</Text>
      <View style={styles.container}>
        <TextInput
          placeholder="Prénom"
          value={prenom}
          onChangeText={setPrenom}
          style={styles.input}
        />
        <TextInput
          placeholder="Nom"
          value={nom}
          onChangeText={setNom}
          style={styles.input}
        />
        <TextInput
          placeholder="E-mail"
          value={mail}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Mot de passe"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
        />
        <View style={styles.pickerContainer}>
          <DropDownPicker
            open={open}
            value={idEquipe}
            items={equipes}
            setOpen={setOpen}
            setValue={setIdEquipe}
            setItems={setEquipes}
            placeholder="Sélectionnez une équipe"
            containerStyle={styles.dropdownContainer}
            style={styles.dropdown}
          />
        </View>
        <TouchableOpacity onPress={handleRegister} style={styles.buttonContainer}>
          <Text style={styles.buttonText}>S'inscrire</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Navbar', {screen:'Profil',params: { screen: 'Login' }})} style={styles.signUpTextContainer}>
          <Text style={styles.signUpText}>
            Vous avez déjà un compte? <Text style={styles.signUpLink}>Se Connecter</Text>
          </Text>
        </TouchableOpacity>    
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: "10%"
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: "20%"
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginLeft: 30,
    marginTop: "10%"
  },
  input: {
    height: 40,
    margin: 10,
    paddingLeft: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 10, 
    borderWidth: 0, 
  },
  buttonContainer: {
    backgroundColor: '#008900', 
    borderRadius: 5,
    padding: 10,
    margin: 10
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  signUpText: {
    marginTop: 20,
    textAlign: 'center',
    marginBottom: 40
  },
  signUpLink: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  pickerContainer: {
    margin: 10,
    zIndex: 5
  },
  dropdownContainer: {
    height: 40,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 10,
  },
});

export default RegisterPage;
