import React from 'react';
import { View, Modal, Text, TouchableOpacity, StyleSheet } from 'react-native';

const EditModal = ({ isVisible, onClose, onEdit, onDelete }) => {
    return (
        <Modal
            visible={isVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <TouchableOpacity onPress={onEdit} style={styles.button}>
                        <Text>Modifier</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onDelete} style={styles.button}>
                        <Text>Supprimer</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onClose} style={styles.button}>
                        <Text>Annuler</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        marginTop: 10,
        backgroundColor: "#DDDDDD",
        padding: 10,
        borderRadius: 20,
    }
});

export default EditModal;
