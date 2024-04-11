import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Alert, 
  Text, 
  TouchableOpacity, 
  ImageBackground, 
  Image, 
  StyleSheet 
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const LoginPage = () => {
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    const apiUrl = 'http://10.0.2.2:4000/api/login';
    try {
      const response = await axios.post(apiUrl, { mail, password });
      const token = response.data.token;
      await AsyncStorage.setItem('userToken', token); // Save the token to AsyncStorage
      navigation.navigate('Profil', { userData: response.data });
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur de connexion", "Une erreur est survenue lors de la tentative de connexion.");
    }
  };

  return (
    <ImageBackground source={require('../../assets/background.png')} style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
      </View>
      <Text style={styles.header}>Connexion</Text>
      <TextInput
        style={styles.input}
        onChangeText={setMail}
        value={mail}
        placeholder="Adresse mail"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        placeholder="Mot de passe"
        secureTextEntry
      />
      <TouchableOpacity onPress={handleLogin} style={styles.buttonContainer}>
        <Text style={styles.buttonText}>Se connecter</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Navbar', {screen:'Profil',params: { screen: 'Register' }})}style={styles.signUpTextContainer}>
        <Text style={styles.signUpText}>
          Vous n'avez pas encore de compte? <Text style={styles.signUpLink}>S'inscrire</Text>
        </Text>
      </TouchableOpacity>
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
    marginBottom: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    margin: 10,
  },
  input: {
    height: 40,
    margin: 10,
    marginBottom: 12,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10, 
    borderWidth: 0, 
  },
  buttonContainer: {
    backgroundColor: 'green', 
    borderRadius: 5,
    padding: 10,
    margin: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  signUpText: {
    marginTop: 20,
    textAlign: 'center',
  },
  signUpLink: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default LoginPage;
