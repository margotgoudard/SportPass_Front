import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import moment from 'moment';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import URLS from '../../urlConfig.js';

const CommentComponent = ({ comment, onLongPress, onLikePress, isLikedByCurrentUser }) => {

    const navigation = useNavigation();

    const getUserId = async () => {
        const idUser = await AsyncStorage.getItem('userId');
        return idUser;
    };

    const navigateToProfile = async () => {
        const userId = await getUserId();        
        if (comment.idUser == userId) {
            const response = await axios.get(`${URLS.url}/user/${userId}`);
            const userData = response.data;
            navigation.navigate('ProfilPage', { userData: userData });
        } else {        
            const response = await axios.get(`${URLS.url}/user/${comment.idUser}`);
            const userData = response.data;
            navigation.navigate('ProfilUser', { userData: userData });
        }
    };
    

    return (
        <TouchableOpacity onLongPress={onLongPress}>
            <View style={styles.commentContainer}>
                <View style={styles.commentHeader}>
                    <TouchableOpacity onPress={navigateToProfile}>
                        <MaterialCommunityIcons name="account-circle-outline" size={24} color="black" style={styles.avatar} />
                    </TouchableOpacity>
                    <View style={styles.headerContent}>
                        <View style={styles.headerLeft}>
                            <Text style={styles.commentUserPseudo}>{comment.userPseudo}</Text>
                        </View>
                    </View>
                    <Text style={styles.commentTime}>{moment(comment.date).fromNow()}</Text>
                </View>
                <Text style={styles.commentContent}>{comment.contenu}</Text>
                <View style={styles.commentInfoContainer}>
                    <TouchableOpacity style={styles.likeButton} onPress={onLikePress}>
                        {isLikedByCurrentUser ? (
                            <FontAwesome name="heart" size={24} color="#BD4F6C" />
                        ) : (
                            <FontAwesome5 name="heart" size={24} color="#BD4F6C" />
                        )}
                    </TouchableOpacity>
                    <Text>{comment.likes}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    commentContainer: {
        padding: 10,
        marginBottom: 10,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: 'black',
        borderRadius: 10
    },
    commentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', 
        marginBottom: 5,
    },
    headerContent: {
        flex: 1,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    avatar: {
        borderRadius: 20,
        marginRight: 10,
    },
    commentUserPseudo: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    commentTime: {
        fontSize: 12,
        position: 'absolute',
        top: 0,
        right: 0,
    },
    commentContent: {
        fontSize: 14,
        marginHorizontal: "10%",
        marginVertical: "1%"
    },
    commentInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 5,
    },
    likeButton: {
        marginRight: 10,
    },
});

export default CommentComponent;
