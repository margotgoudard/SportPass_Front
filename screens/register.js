import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const RegisterPage = () => {
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [mail, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [numTel, setNumTel] = useState('');
  const [adresse, setAdresse] = useState('');

  const handleRegister = () => {
    // Remplacez par l'adresse de votre serveur
    const apiUrl = 'http://10.0.2.2:4000/api/registration';
    axios.post(apiUrl, { prenom, nom, mail, password, numTel, adresse })
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
       <TextInput
              placeholder="Adresse Postale"
              value={adresse}
              onChangeText={setAdresse}
              style={styles.input}
       />
      <TextInput
        placeholder="Numéro de téléphone"
        value={numTel}
        onChangeText={setNumTel}
        style={styles.input}
        keyboardType="phone-pad"
      />
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
