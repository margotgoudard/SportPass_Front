import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import moment from 'moment';
import axios from 'axios';
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons'; 
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import URLS from '../../urlConfig.js';

const PostComponent = ({ post, updateTrigger, onPostPress, onLongPress, showDetails = true, openModal }) => {
    const [postCommentsCount, setPostCommentsCount] = useState({});
    const [postLikesCount, setPostLikesCount] = useState({});
    const [isLikedByCurrentUser, setIsLikedByCurrentUser] = useState(false);

    const navigation = useNavigation();

    if (!post || !post.User) {
        return null;
    }

    const checkIfLikedByCurrentUser = async (postId, idUser) => {
        try {
          const response = await axios.get(`${URLS.url}/likePublicationUser/${postId}/${idUser}`);
          setIsLikedByCurrentUser(response.data.exists); 
          return response.data.exists;
        } catch (error) {
          console.error('Error checking like status', error);
          return false; 
        }
    };

    const handleLike = async (postId) => {
        if (!postId) return;
        try {
            let newLikesCount = {...postLikesCount}; 
            if (isLikedByCurrentUser) {
                await axios.delete(`${URLS.url}/likePublicationUser/${postId}/${post.User.idUser}`);
                newLikesCount[postId] = (newLikesCount[postId] || 1) - 1;
            } else {
                const likeData = {
                    idPublication: postId,
                    idUser: post.User.idUser
                };
                await axios.post(`${URLS.url}/likePublicationUser`, likeData);
                newLikesCount[postId] = (newLikesCount[postId] || 0) + 1;
            }
            setIsLikedByCurrentUser(!isLikedByCurrentUser); 
            setPostLikesCount(newLikesCount); 
        } catch (error) {
            console.error('Error updating like status', error);
        }
    };
    
    useFocusEffect(
        useCallback(() => {     
          const fetchPostCommentsAndLikes = async () => {
            if (!post) return;
            const commentsCount = {};
            const likesCount = {};

            try {
                if(post){
                const commentsResponse = await axios.get(`${URLS.url}/commentaireUser/publication/${post.idPublication}`);
                const likesResponse = await axios.get(`${URLS.url}/likePublicationUser/publication/${post.idPublication}`);
                commentsCount[post.idPublication] = commentsResponse.data.length;
                likesCount[post.idPublication] = likesResponse.data.length;
                await checkIfLikedByCurrentUser(post.idPublication, post.User.idUser);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des commentaires et likes', error);
            }

            setPostCommentsCount(commentsCount);
            setPostLikesCount(likesCount);
        };

        fetchPostCommentsAndLikes();

        }, [post?.idPublication, updateTrigger]) 
    );

    const getUserId = async () => {
        const idUser = await AsyncStorage.getItem('userId');
        return idUser;
    };

    const navigateToProfile = async () => {
        const userId = await getUserId();        
        if (post.User.idUser == userId) {
            navigation.navigate('ProfilPage', { userData: post.User });
        } else {        
            navigation.navigate('ProfilUser', { userData: post.User });
        }
    };

    return (
        <TouchableOpacity onPress={onPostPress} onLongPress={() => onLongPress(post)}>
            <View style={styles.postItem}>
                <View style={styles.postHeader}>
                <TouchableOpacity onPress={navigateToProfile}>
                        <MaterialCommunityIcons name="account-circle-outline" size={32} color="black" style={styles.postProfileImage} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={navigateToProfile} style={{ flex: 1 }}>
                        <Text style={styles.postPseudo}>{post.User.pseudo}</Text>
                    </TouchableOpacity>
                    <Text style={styles.postTime}>{moment(post.date).fromNow()}</Text>
                </View>
                <View style={styles.postContentContainer}>
                    <Text style={styles.postItemText}>{post.contenu}</Text>
                    {showDetails && (
                        <View style={styles.postDetails}>
                            <View style={styles.detailItem}>
                            <TouchableOpacity 
                                onPress={() => navigation.navigate('PostDetails', { post, showModal: true })}
                            >
                                <FontAwesome6 name="comments" size={22} color="black" />
                            </TouchableOpacity>
                            </View>
                            <View style={styles.detailItem}>
                                <TouchableOpacity 
                                    style={styles.likeButton} 
                                    onPress={() => handleLike(post.idPublication)}
                                >
                                    {isLikedByCurrentUser ? (
                                        <FontAwesome name="heart" size={24} color="#BD4F6C" />
                                    ) : (
                                        <FontAwesome5 name="heart" size={24} color="#BD4F6C" />
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    <Text style={styles.footerText}>
                        <Text style={styles.footerNumber}>{postCommentsCount[post.idPublication] || 0}</Text> commentaires{"   "}
                        <Text style={styles.footerNumber}>{postLikesCount[post.idPublication] || 0}</Text> likes
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
       postItem: {
           backgroundColor: 'white',
           padding: 10,
           borderRadius: 5,
       },
       postItemText: {
           fontSize: 16,
           marginLeft: "15%",
           marginBottom: "2%"
       },
       footerText: {
        color: 'grey', 
        fontStyle: 'italic', 
        fontSize: 14, 
        position: 'absolute', 
        bottom: 10, 
        left: 10
    },
    footerNumber: {
        color: 'black', 
        fontStyle: 'normal'
    },
       postHeader: {
           flexDirection: 'row',
           alignItems: 'center',
           justifyContent: 'space-between', 
       },
       postProfileImage: {
           marginLeft: "2%",
           borderRadius: 20, 
           marginRight: 10,
       },
       postPseudo: {
           flex: 1,
           fontWeight: 'bold',
       },
       postTime: {
           color: '#A9A9A9', 
           fontSize: 14, 
           marginRight: "2%"
       },
       icon: {
           width: 20, 
           height: 20,
           marginRight: 5, 
       },
       postItem: {
           backgroundColor: 'white',
           padding: 10,
           marginTop: 5,
           borderRadius: 5,
           flex: 1,
         },
         postContentContainer: {
           flexDirection: 'column',
           justifyContent: 'space-between', 
           flex: 1, 
         },
         postDetails: {
           flexDirection: 'row',
           justifyContent: 'flex-end', 
           marginTop: 5, 
         },
         detailItem: {
           flexDirection: 'row',
           alignItems: 'center',
           marginLeft: 10, 
           marginBottom: 5
         },
    });

export default PostComponent;
