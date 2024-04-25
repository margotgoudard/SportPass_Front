import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

const EditActions = ({ onEdit, onDelete }) => {
    const editColor = "#008900";
    const deleteColor = "#5D2E46";

    return (
        <View style={styles.centeredView}>
            <View style={styles.actionView}>
                <TouchableOpacity onPress={onEdit} style={styles.button}>
                    <View style={styles.iconWithText}>
                        <Feather name="edit" size={20} color={editColor} />
                        <Text style={{ color: editColor, marginLeft: 5 }}>Modifier</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={onDelete} style={styles.button}>
                    <View style={styles.iconWithText}>
                        <FontAwesome6 name="trash" size={20} color={deleteColor} />
                        <Text style={{ color: deleteColor, marginLeft: 5 }}>Supprimer</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        alignItems: "center",
        marginTop: 20, 
    },
    actionView: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 10,
        alignItems: "center",
        justifyContent: 'space-around',
        flexDirection: 'row',
        width: "90%",
    },
    button: {
        backgroundColor: "white",
        padding: 10,
        borderRadius: 20,
    },
    iconWithText: {
        flexDirection: 'row',
        alignItems: 'center',
    }
});

export default EditActions;
