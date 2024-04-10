import React from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const MessageModal = ({ isModalVisible, closeModal, messageText, setMessageText, sendMessage, adjustInputHeight, inputHeight }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={closeModal}
        >
            <View style={styles.centeredView}>
                <View style={[styles.modalView, {height: Math.max(250, inputHeight + 160)}]}>
                    <TouchableOpacity
                        style={styles.buttonClose}
                        onPress={closeModal}
                    >
                        <Text style={styles.textStyleRose}>Annuler</Text>
                    </TouchableOpacity>
                    <TextInput
                        style={[styles.modalTextInput, {height: Math.max(35, inputHeight)}]}
                        placeholder="Ecrire un message..."
                        onChangeText={setMessageText}
                        value={messageText}
                        multiline={true}
                        onContentSizeChange={adjustInputHeight}
                    />
                    <TouchableOpacity
                        style={styles.buttonSend}
                        onPress={sendMessage}
                    >
                        <Text style={styles.textStyle}>Envoyer</Text>
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
        elevation: 5,
        width: '80%', 
        height: '40%', 
    },
    modalTextInput: {
        textAlignVertical: "top", 
        textAlign: "left",
        height: "70%",
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 10,
        width: "100%",
        borderRadius: 10,
        backgroundColor: '#F0F0F0', 
        marginTop: "10%"
    },
    buttonClose: {
        backgroundColor: "transparent", 
        padding: 10,
        position: 'absolute',
        top: "3%",
        left: "3%"
    },
    buttonSend: {
        backgroundColor: "green", 
        borderRadius : 10,
        padding: 10,
        position: 'absolute', 
        bottom: "5%", 
        right: "5%",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    textStyleRose: {
        color: "#BD4F6C",
        fontWeight: "bold",
        textAlign: "center",
    }
});

export default MessageModal;
