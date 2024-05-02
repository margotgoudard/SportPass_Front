import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Alert, ImageBackground, Image } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

const RegisterPage = () => {
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [mail, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [idEquipe, setIdEquipe] = useState('');
  const [equipes, setEquipes] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchEquipes = async () => {
      try {
        const response = await axios.get('http://10.0.2.2:4000/api/equipe');
        console.log(response.data);
        setEquipes(response.data);
      } catch (error) {
        console.error(error);
        Alert.alert("Erreur de chargement", "Les équipes n'ont pas pu être chargées.");
      }
    };
    fetchEquipes();
  }, []);

  const handleRegister = () => {
    const apiUrl = 'http://10.0.2.2:4000/api/registration';
    axios.post(apiUrl, { prenom, nom, mail, password, idEquipe })
      .then(response => {
        console.log(response.data);
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
          <Picker
            selectedValue={idEquipe}
            onValueChange={(itemValue, itemIndex) => setIdEquipe(itemValue)}
            style={styles.picker}
          >
            {equipes.map((uneEquipe, index) => (
              <Picker.Item key={index} label={uneEquipe.nom} value={uneEquipe.idEquipe} />
            ))}
          </Picker>
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
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 100
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginLeft: 30,
    marginTop: 50
  },
  input: {
    height: 40,
    paddingTop:0,
    margin: 10,
    marginBottom: 12,
    padding: 10,
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
    borderRadius: 10, 
    overflow: 'hidden', 
    backgroundColor: '#fff',
    margin: 10,
    height: 40
  },
  picker: { 
    backgroundColor: '#fff', 
  },
});

export default RegisterPage;
