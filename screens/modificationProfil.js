import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const ModificationProfilPage = ({ route }) => {
    const { user } = route.params;
    const navigation = useNavigation();

    const [updatedUser, setUpdatedUser] = useState(user);

    const handleUpdate = async () => {
        try {
            await axios.put(`http://10.0.2.2:4000/api/user/${user.idUser}`, updatedUser);
            const response = await axios.get(`http://10.0.2.2:4000/api/user/${user.idUser}`);
            const userData = response.data;
            navigation.navigate('Profil', { userData });
        } catch (error) {
            console.error('Erreur lors de la mise à jour du profil :', error);
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Modifier le profil</Text>
            <TextInput
                style={styles.input}
                value={updatedUser.pseudo}
                onChangeText={(text) => setUpdatedUser({ ...updatedUser, pseudo: text })}
                placeholder="Pseudo"
            />
            <TextInput
                style={styles.input}
                value={updatedUser.biographie}
                onChangeText={(text) => setUpdatedUser({ ...updatedUser, biographie: text })}
                placeholder="Biographie"
            />
            <TextInput
                style={styles.input}
                value={updatedUser.nom}
                onChangeText={(text) => setUpdatedUser({ ...updatedUser, nom: text })}
                placeholder="Nom"
            />
             <TextInput
                style={styles.input}
                value={updatedUser.prenom}
                onChangeText={(text) => setUpdatedUser({ ...updatedUser, prenom: text })}
                placeholder="Prenom"
            />
            <TextInput
                style={styles.input}
                value={updatedUser.mail}
                onChangeText={(text) => setUpdatedUser({ ...updatedUser, mail: text })}
                placeholder="Adresse e-mail"
            />
            <TextInput
                style={styles.input}
                value={updatedUser.tel}
                onChangeText={(text) => setUpdatedUser({ ...updatedUser, tel: text })}
                placeholder="Numéro de téléphone"
            />
            <TextInput
                style={styles.input}
                value={updatedUser.adresse}
                onChangeText={(text) => setUpdatedUser({ ...updatedUser, adresse: text })}
                placeholder="Adresse"
            />
            <Button title="Enregistrer les modifications" onPress={handleUpdate} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
});

export default ModificationProfilPage;
