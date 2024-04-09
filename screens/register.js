import React, { useState,  useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker'; 


const RegisterPage = () => {
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [mail, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [idEquipe, setIdEquipe] = useState('');

  const [equipes, setEquipes] = useState([]); 

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
       <Picker
        selectedValue={idEquipe}
        onValueChange={(itemValue, itemIndex) => setIdEquipe(itemValue)}
        style={styles.picker}
      >
        {equipes.map((uneEquipe, index) => (
          <Picker.Item key={index} label={uneEquipe.nom} value={uneEquipe.idEquipe} />
        ))}
      </Picker>
      <Button title="S'inscrire" onPress={handleRegister} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
  },
});

export default RegisterPage;
