import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground  } from 'react-native';
import moment from 'moment';
import axios from 'axios';
import { FontAwesome5, FontAwesome } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PostClubComponent = ({ post, updateTrigger, showDetails = true }) => {
    const [postCommentsCount, setPostCommentsCount] = useState({});
    const [postLikesCount, setPostLikesCount] = useState({});
    const [isLikedByCurrentUser, setIsLikedByCurrentUser] = useState(false);
    const navigation = useNavigation();

    if (!post) {
        return null;
    }

    const getUserId = async () => {
        const idUser = await AsyncStorage.getItem('userId');
        return idUser;
    };

    const checkIfLikedByCurrentUser = async (postId) => {
        const idUser = await getUserId();
        try {
          const response = await axios.get(`http://10.0.2.2:4000/api/likePublicationClub/${postId}/${idUser}`);
          setIsLikedByCurrentUser(response.data.exists); 
          return response.data.exists;
        } catch (error) {
          console.error('Error checking like status', error);
          return false; 
        }
    };

    const handleLike = async (postId) => {
        if (!postId) return;
        const idUser = await getUserId();
        try {
            let newLikesCount = {...postLikesCount}; 
            if (isLikedByCurrentUser) {
                await axios.delete(`http://10.0.2.2:4000/api/likePublicationClub/${postId}/${idUser}`);
                newLikesCount[postId] = (newLikesCount[postId] || 1) - 1;
            } else {
                const likeData = {
                    idPublication: postId,
                    idUser
                };
                await axios.post(`http://10.0.2.2:4000/api/likePublicationClub`, likeData);
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
                const commentsResponse = await axios.get(`http://10.0.2.2:4000/api/commentaireClub/publication/${post.idPublication}`);
                const likesResponse = await axios.get(`http://10.0.2.2:4000/api/likePublicationClub/publication/${post.idPublication}`);
                commentsCount[post.idPublication] = commentsResponse.data.length;
                likesCount[post.idPublication] = likesResponse.data.length;
                await checkIfLikedByCurrentUser(post.idPublication);
            } catch (error) {
                console.error('Erreur lors de la récupération des commentaires et likes', error);
            }

            setPostCommentsCount(commentsCount);
            setPostLikesCount(likesCount);
        };

        fetchPostCommentsAndLikes();

        }, [post?.idPublication, updateTrigger]) 
    );

    return (
        <ImageBackground source={{ uri: post.image }} style={styles.postItem} imageStyle={{ borderRadius: 5 }}>
            <TouchableOpacity onPress={() => navigation.navigate('PostClubDetails', { post })}>
            <View style={styles.container}>
            <View style={styles.postHeader}>
                <Text style={styles.postContent}>{post.contenu}</Text>
                <Text style={styles.postTime}>{moment(post.date).fromNow()}</Text>
            </View>
            <View style={styles.postContentContainer}>
                {post.tag !== "" && (
                    <View style={styles.tagContainer}>
                        <Text style={styles.tagText}>{post.tag}</Text>
                    </View>
                )}
                {showDetails && (
                    <View style={styles.postDetails}>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailText}>{postCommentsCount[post.idPublication] || 0}</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('PostClubDetails', { post, showModal: true })}>
                                <FontAwesome name="comments" size={22} color="white" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailText}>{postLikesCount[post.idPublication] || 0}</Text>
                            <TouchableOpacity style={styles.likeButton} onPress={() => handleLike(post.idPublication)}>
                                {isLikedByCurrentUser ? (
                                    <FontAwesome name="heart" size={22} color="#BD4F6C" />
                                ) : (
                                    <FontAwesome5 name="heart" size={22} color="white" />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
            </View>
            </TouchableOpacity>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        minHeight : 100
    },
    postItem: {
        padding: 10,
        flex: 1,
        borderRadius: 5,
    },
    postHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    postContent: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: "8%",
        marginRight: "20%",
        shadowColor: '#000',  
        shadowOffset: { width: 4, height: 2 },  
        shadowOpacity: 1,  
        shadowRadius: 2,  
        elevation: 8,  
    },
    postTime: {
        position: "absolute",
        top: 5,
        right : 5,
        color: 'white',
    },
    postContentContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        flex: 1,
    },
    tagContainer: {
        backgroundColor: '#BD4F6C',
        padding: 5,
        borderRadius: 5,
        marginTop: "2%",
        marginRight: "69%"
    },
    tagText: {
        color: 'white',
        fontWeight: 'bold',
    },
    postDetails: {
        position: "absolute",
        bottom: 10,
        right: 10,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailText: {
        color: 'white',
        marginRight: 3,
        marginLeft: "3%"
    },
    likeButton: {
        marginLeft: "2%",
    },
});

export default PostClubComponent;
