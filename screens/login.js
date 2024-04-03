import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const LoginPage = () => {
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // Remplacez l'URL par l'adresse de votre serveur et le port
        const apiUrl = 'http://10.0.2.2:4000/api/login';
        axios.post(apiUrl, { mail, password })
            .then(response => {
                // Gérez la réponse de votre serveur ici
                console.log(response.data);
                Alert.alert("Connexion réussie", "Vous êtes maintenant connecté.");
            })
            .catch(error => {
                // Gérez les erreurs ici
                console.error(error);
                Alert.alert("Erreur de connexion", "Une erreur est survenue lors de la tentative de connexion.");
            });
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Adresse e-mail"
                value={mail}
                onChangeText={setMail}
                style={styles.input}
                autoCapitalize="none"
            />
            <TextInput
                placeholder="Mot de passe"
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                secureTextEntry
            />
            <Button title="Se connecter" onPress={handleLogin} />
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

export default LoginPage;
