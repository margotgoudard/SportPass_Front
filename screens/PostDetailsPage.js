import React, { useState, useEffect } from 'react';
import { View, Modal, Alert, TextInput, SafeAreaView, Text, StyleSheet, Button, ScrollView,TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/fr';
import PostComponent from '../components/PostComponent';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import EditModal from '../components/EditModal.js';
import MessageModal from '../components/MessageModal.js';

moment.locale('fr');

const PostDetailsPage = ({ route, navigation }) => {
    const { post } = route.params;
    const [comments, setComments] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [messageText, setMessageText] = useState('');
    const [updateTrigger, setUpdateTrigger] = useState(0); 
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [inputHeight, setInputHeight] = useState(0); 
    const [editDeleteModalVisible, setEditDeleteModalVisible] = useState(false);
    const [selectedComment, setSelectedComment] = useState(null);

    
    const openModal = (edit = false, commentId = null, content = '') => {
        setIsEditMode(edit);
        setEditingCommentId(commentId);
        setMessageText(content);
        setModalVisible(true);
    };
    
    const closeModal = () => setModalVisible(false);
    const sendMessage = async () => {
        if (messageText.trim() === '') {
            Alert.alert('Erreur', 'Le message ne peut pas être vide.');
            return;
        }
    
        const messageData = {
            contenu: messageText,
            date: new Date().toISOString(), 
            idPublication: post.idPublication,
            idUser: post.User.idUser 
        };

        if (isEditMode) {
            editComment(editingCommentId, messageText);
            closeModal();
        }
        else {
        try {
            const response = await axios.post('http://10.0.2.2:4000/api/commentaireUser', messageData);
            
            Alert.alert('Succès', 'Le message a été envoyé avec succès.');
            setMessageText(''); 
            closeModal(); 
            fetchCommentsAndUsers();
            setUpdateTrigger(updateTrigger + 1); 

        } catch (error) {
            console.error('Erreur lors de l\'envoi du message', error);
            Alert.alert('Erreur', 'Un problème est survenu lors de l\'envoi du message.');
        }
    }
    };

    const adjustInputHeight = (event) => {
        setInputHeight(event.nativeEvent.contentSize.height);
    };
    
    const fetchCommentsAndUsers = async () => {
        try {
            const commentsResponse = await axios.get(`http://10.0.2.2:4000/api/commentaireUser/publication/${post.idPublication}`);
            let commentsWithDetails = await Promise.all(commentsResponse.data.map(async (comment) => {
                try {
                    const userResponse = await axios.get(`http://10.0.2.2:4000/api/user/${comment.idUser}`);
                    const likesResponse = await axios.get(`http://10.0.2.2:4000/api/likeCommentaireUser/commentaire/${comment.idCommentaire}`);
                    const isLikedByCurrentUser = await checkIfLikedByCurrentUser(comment.idCommentaire, post.User.idUser); 
                    return {
                        ...comment,
                        likes: likesResponse.data.length,
                        userPseudo: userResponse.data.pseudo,
                        isLikedByCurrentUser: isLikedByCurrentUser.exists,
                    };
                } catch (error) {
                    console.error('Error fetching user details for comments', error);
                    return comment;
                }
            }));

            commentsWithDetails.sort((a, b) => moment(b.date).valueOf() - moment(a.date).valueOf());

            setComments(commentsWithDetails);
        } catch (error) {
            console.error('Error fetching comments', error);
        }
    };

    const handleCommentLongPress = (comment) => {
        setSelectedComment(comment);
        setEditDeleteModalVisible(true);
    };
    
    const editComment = async (commentId, newContent) => {
        const updatedComment = {
          contenu: newContent,
          date: new Date().toISOString(), 
        };
      
        try {
          await axios.put(`http://10.0.2.2:4000/api/commentaireUser/${commentId}`, updatedComment);
          fetchCommentsAndUsers();
        } catch (error) {
          console.error('Error updating comment:', error);
          Alert.alert('Error', 'An error occurred while updating the comment');
        }
      };
    const deleteComment = async (commentId) => {
        try {
            const response = await axios.delete(`http://10.0.2.2:4000/api/commentaireUser/${commentId}`);
            fetchCommentsAndUsers();
            setUpdateTrigger(updateTrigger + 1); 
          } catch (error) {
            console.error('Error delete commenataire', error);
            return false; 
          }
        };

    useEffect(() => {    
        fetchCommentsAndUsers();
    }, [post.idPublication]);

    const checkIfLikedByCurrentUser = async (commentId, idUser) => {
        try {
          const response = await axios.get(`http://10.0.2.2:4000/api/likeCommentaireUser/${commentId}/${idUser}`);
          return response.data; 
        } catch (error) {
          console.error('Error checking like status', error);
          return false; 
        }
      };
   
      const handleLike = async (commentId, isLiked) => {
        try {
            let updatedComments = [...comments]; 
            const commentIndex = updatedComments.findIndex(comment => comment.idCommentaire === commentId); 
            if (commentIndex !== -1) { 
                if (isLiked) {
                    console.log("commentId", commentId)
                    await axios.delete(`http://10.0.2.2:4000/api/likeCommentaireUser/${commentId}/${post.User.idUser}`);
                    updatedComments[commentIndex].isLikedByCurrentUser = false; 
                    console.log
                    updatedComments[commentIndex].likes -= 1; 
                } else {
                    const likeData = {
                        idCommentaire: commentId,
                        idUser: post.User.idUser
                    };
                    await axios.post(`http://10.0.2.2:4000/api/likeCommentaireUser`, likeData);
                    updatedComments[commentIndex].isLikedByCurrentUser = true; 
                    updatedComments[commentIndex].likes += 1; 
                }
                setComments(updatedComments); 
            }
        } catch (error) {
            console.error('Error updating like status', error);
        }
    };
    
 
    
    return (
        <SafeAreaView style={{flex: 1}}> 
        <View style={styles.wrapper}> 
        <ScrollView style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonContainer}>
                <AntDesign name="arrowleft" size={26} color="#BD4F6C" />
            </TouchableOpacity>
            <View style={styles.premiercontainer}>
            <PostComponent post={post} updateTrigger={updateTrigger} onPostPress={() => navigation.navigate('PostDetails', { post })} />
            {comments.map((comment, index) => (
                <TouchableOpacity
                key={index}
                onLongPress={() => handleCommentLongPress(comment)}
                style={styles.commentContainer}
            >
                <View key={index} style={styles.commentContainer}>
                    <View style={styles.commentHeader}>
                        <Image source={require('../assets/profil.png')} style={styles.avatar} />
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={styles.commentUserPseudo}>{comment.userPseudo}</Text>
                            <Text style={styles.commentTime}>{moment(comment.date).fromNow()}</Text>
                        </View>
                    </View>
                    <Text style={styles.commentContent}>{comment.contenu}</Text>
                    <View style={styles.commentInfoContainer}>
                    <TouchableOpacity 
                        style={styles.likeButton} 
                        onPress={() => handleLike(comment.idCommentaire, comment.isLikedByCurrentUser)}
                    >
                        {comment.isLikedByCurrentUser ? (
                            <FontAwesome name="heart" size={24} color="#BD4F6C" />
                        ) : (
                            <FontAwesome5 name="heart" size={24} color="#BD4F6C" />
                        )}
                    </TouchableOpacity>
                            <Text>{comment.likes}</Text>
                    </View>
                </View>
                </TouchableOpacity>
            ))}
            </View>
        </ScrollView>
        <TouchableOpacity 
                    onPress={openModal} 
                    style={styles.newMessageIcon}>
                    <Entypo name="new-message" size={24} color="#BD4F6C" />
        </TouchableOpacity>
        <MessageModal
            isModalVisible={isModalVisible}
            closeModal={closeModal}
            messageText={messageText}
            setMessageText={setMessageText}
            sendMessage={sendMessage}
            adjustInputHeight={adjustInputHeight}
            inputHeight={inputHeight}
        />
            <EditModal
                isVisible={editDeleteModalVisible}
                onClose={() => setEditDeleteModalVisible(false)}
                onEdit={() => {
                    setEditDeleteModalVisible(false);
                    openModal(true, selectedComment.idCommentaire, selectedComment.contenu);
                }}
                onDelete={() => {
                    setEditDeleteModalVisible(false);
                    deleteComment(selectedComment.idCommentaire);
                }}
            />
        </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    premiercontainer: {
        marginTop: "10%"
    },
    commentContainer: {
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#E8EAF6', 
        borderRadius: 5,
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.23, 
        shadowRadius: 2.62, 
        elevation: 4,
    },
    commentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    commentUserPseudo: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    commentContent: {
        fontSize: 14,
        paddingLeft: "15%"
    },
    commentInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end', 
        marginTop: 5,
    },
    icon: {
        width: 20,
        height: 20,
        marginRight: 5,
    },
    backButtonContainer: {
        marginLeft: "4%",
        marginTop: "8%",
    },
    commentTime: {
        color: '#A9A9A9',
        fontSize: 14,
    },
    wrapper: {
        flex: 1,
        position: 'relative',
    },
    newMessageIcon: {
        position: 'absolute', 
        bottom: 20, 
        right: 20, 
        backgroundColor: 'white', 
        padding: 10, 
        borderRadius: 50, 
        elevation: 4, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
    },
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
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        position: 'absolute', 
        bottom: 10, 
        left: 0, 
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



export default PostDetailsPage;
