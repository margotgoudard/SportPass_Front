import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import moment from 'moment';
import axios from 'axios';

const PostComponent = ({ post, onPostPress, showDetails = true }) => {

    const [postCommentsCount, setPostCommentsCount] = useState({});
    const [postLikesCount, setPostLikesCount] = useState({});
    
    useEffect(() => {
          const fetchPostCommentsAndLikes = async () => {
            const commentsCount = {};
            const likesCount = {};
        
                try {
                    const commentsResponse = await axios.get(`http://10.0.2.2:4000/api/commentaireUser/publication/${post.idPublication}`);
                    const likesResponse = await axios.get(`http://10.0.2.2:4000/api/likePublicationUser/publication/${post.idPublication}`);
                    commentsCount[post.idPublication] = commentsResponse.data.length;
                    likesCount[post.idPublication] = likesResponse.data.length;
                } catch (error) {
                    console.error('Erreur lors de la récupération des commentaires et likes', error);
                }
        
            setPostCommentsCount(commentsCount);
            setPostLikesCount(likesCount);
        };
        

        fetchPostCommentsAndLikes();

        }, [post.idPublication]);  

    return (
        <TouchableOpacity onPress={onPostPress}>
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
                                <Image source={require('../assets/commentaire.png')} style={styles.icon} />
                                <Text>{postCommentsCount[post.idPublication]}</Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Image source={require('../assets/like.png')} style={styles.icon} />
                                <Text>{postLikesCount[post.idPublication]}</Text>
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
    });

export default PostComponent;
