import React from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

import PostComponent from './PostComponent'; 

const MessageModal = ({
    isModalVisible,
    closeModal,
    messageText,
    setMessageText,
    sendMessage,
    adjustInputHeight,
    inputHeight,
    post,
}) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={closeModal}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                        {post && (
                            <PostComponent post={post} style={styles.postStyle}/>
                        )}
                        <TextInput
                            style={[styles.modalTextInput, {height: Math.max(150, inputHeight)}]}
                            placeholder="Ecrire un message..."
                            onChangeText={setMessageText}
                            value={messageText}
                            multiline={true}
                            onContentSizeChange={adjustInputHeight}
                        />
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.buttonClose}
                                onPress={closeModal}
                            >
                                <Text style={styles.textStyleRose}>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.buttonSend}
                                onPress={sendMessage}
                            >
                                <Text style={styles.textStyle}>Envoyer</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
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
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 20,
        shadowColor: "#000",
        width: '90%', 
        maxHeight: '80%',
    },
    scrollViewContainer: {
        flexGrow: 1,
        margin: "2%",
        justifyContent: "center"
    },
    postStyle: {
        flex: 1,
    },
    modalTextInput: {
        textAlignVertical: "top", 
        textAlign: "left",
        margin : "5%",
        marginTop: "10%",
        marginBottom: "10%",
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#F0F0F0', 
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    controlsContainer: {
        backgroundColor: "#008900"
    },
    buttonClose: {
        backgroundColor: "transparent", 
        padding: 10,
        margin: "4%"
    },
    buttonSend: {
        backgroundColor: "#008900", 
        borderRadius: 10,
        padding: 10,
        margin: "4%"
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
