import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import moment from 'moment';
import axios from 'axios';
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons'; 


const PostComponent = ({ post, updateTrigger, onPostPress, onLongPress, showDetails = true }) => {
    const [postCommentsCount, setPostCommentsCount] = useState({});
    const [postLikesCount, setPostLikesCount] = useState({});
    const [isLikedByCurrentUser, setIsLikedByCurrentUser] = useState(false);

    const checkIfLikedByCurrentUser = async (postId, idUser) => {
        try {
          const response = await axios.get(`http://10.0.2.2:4000/api/likePublicationUser/${postId}/${idUser}`);
          setIsLikedByCurrentUser(response.data.exists); 
          return response.data.exists;
        } catch (error) {
          console.error('Error checking like status', error);
          return false; 
        }
    };

    const handleLike = async (postId) => {
        try {
            let newLikesCount = {...postLikesCount}; 
            if (isLikedByCurrentUser) {
                await axios.delete(`http://10.0.2.2:4000/api/likePublicationUser/${postId}/${post.User.idUser}`);
                newLikesCount[postId] = (newLikesCount[postId] || 1) - 1;
            } else {
                const likeData = {
                    idPublication: postId,
                    idUser: post.User.idUser
                };
                await axios.post(`http://10.0.2.2:4000/api/likePublicationUser`, likeData);
                newLikesCount[postId] = (newLikesCount[postId] || 0) + 1;
            }
            setIsLikedByCurrentUser(!isLikedByCurrentUser); 
            setPostLikesCount(newLikesCount); 
        } catch (error) {
            console.error('Error updating like status', error);
        }
    };
    
     useEffect(() => {
          const fetchPostCommentsAndLikes = async () => {
            const commentsCount = {};
            const likesCount = {};

            try {
                const commentsResponse = await axios.get(`http://10.0.2.2:4000/api/commentaireUser/publication/${post.idPublication}`);
                const likesResponse = await axios.get(`http://10.0.2.2:4000/api/likePublicationUser/publication/${post.idPublication}`);
                commentsCount[post.idPublication] = commentsResponse.data.length;
                likesCount[post.idPublication] = likesResponse.data.length;
                await checkIfLikedByCurrentUser(post.idPublication, post.User.idUser);
            } catch (error) {
                console.error('Erreur lors de la récupération des commentaires et likes', error);
            }

            setPostCommentsCount(commentsCount);
            setPostLikesCount(likesCount);
        };

        fetchPostCommentsAndLikes();

        }, [post.idPublication, updateTrigger]) 

    return (
        <TouchableOpacity onPress={onPostPress} onLongPress={() => onLongPress(post)}>
            <View style={styles.postItem}>
                <View style={styles.postHeader}>
                    <Image source={require('../assets/profil.png')} style={styles.postProfileImage} />
                    <Text style={styles.postPseudo}>{post.User.pseudo}</Text>
                    <Text style={styles.postTime}>{moment(post.date).fromNow()}</Text>
                </View>
                <View style={styles.postContentContainer}>
                    <Text style={styles.postItemText}>{post.contenu}</Text>
                    {showDetails && (
                        <View style={styles.postDetails}>
                           <View style={styles.detailItem}>
                                <FontAwesome6 name="comments" size={22} color="black" />
                                <Text style={styles.detailText}>{postCommentsCount[post.idPublication]}</Text>
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
                                <Text style={styles.detailText}>{postLikesCount[post.idPublication]}</Text>
                            </View>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
       postItem: {
           backgroundColor: 'white',
           padding: 10,
           marginTop: 5,
           borderRadius: 5,
       },
       postItemText: {
           fontSize: 16,
           marginLeft: "15%",
           marginBottom: "2%"
       },
       postHeader: {
           flexDirection: 'row',
           alignItems: 'center',
           justifyContent: 'space-between', 
       },
       postProfileImage: {
           width: 40, 
           height: 40, 
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
         },
         detailText: {
            marginLeft: 5, 
        },
    });

export default PostComponent;