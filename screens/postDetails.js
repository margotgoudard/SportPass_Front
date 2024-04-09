import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ScrollView,TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/fr';
import PostComponent from '../components/postComponent';
import { AntDesign } from '@expo/vector-icons';

moment.locale('fr');

const PostDetailsPage = ({ route, navigation }) => {
    const { post } = route.params;
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const fetchCommentsAndUsers = async () => {
            try {
                const commentsResponse = await axios.get(`http://10.0.2.2:4000/api/commentaireUser/publication/${post.idPublication}`);
                let commentsWithDetails = await Promise.all(commentsResponse.data.map(async (comment) => {
                    try {
                        const userResponse = await axios.get(`http://10.0.2.2:4000/api/user/${comment.idUser}`);
                        const likesResponse = await axios.get(`http://10.0.2.2:4000/api/likeCommentaireUser/commentaire/${comment.idCommentaire}`);
                        return {
                            ...comment,
                            likes: likesResponse.data.length,
                            userPseudo: userResponse.data.pseudo,
                        };
                    } catch (error) {
                        console.error('Error fetching user details for comments', error);
                        return comment;
                    }
                }));
    
                commentsWithDetails.sort((a, b) => moment(a.date).valueOf() - moment(b.date).valueOf());
    
                setComments(commentsWithDetails);
            } catch (error) {
                console.error('Error fetching comments', error);
            }
        };
    
        fetchCommentsAndUsers();
    }, [post.idPublication]);
    
    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonContainer}>
                <AntDesign name="arrowleft" size={26} color="#BD4F6C" />
            </TouchableOpacity>
            <View style={styles.premiercontainer}>
            <PostComponent post={post} onPostPress={() => navigation.navigate('PostDetails', { post })} />
            {comments.map((comment, index) => (
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
                        <Image source={require('../assets/like.png')} style={styles.icon} />
                        <Text>{comment.likes}</Text>
                    </View>
                </View>
            ))}
            </View>
        </ScrollView>
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
});


export default PostDetailsPage;
