import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import moment from 'moment';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';

const CommentComponent = ({ comment, onLongPress, onLikePress, isLikedByCurrentUser, avatar }) => {
    return (
        <TouchableOpacity onLongPress={onLongPress}>
            <View style={styles.commentContainer}>
                <View style={styles.commentHeader}>
                    <Image source={avatar} style={styles.avatar} />
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.commentUserPseudo}>{comment.userPseudo}</Text>
                        <Text style={styles.commentTime}>{moment(comment.date).fromNow()}</Text>
                    </View>
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
        marginLeft: "5%",
        marginRight: "5%",
        borderRadius: 10
    },
    commentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    avatar: {
        width: 35,
        height: 35,
        borderRadius: 20,
        marginRight: "5%",
        marginLeft: "5%"
    },
    commentUserPseudo: {
        fontWeight: 'bold',
        fontSize: 14,
        marginLeft: 0
    },
    commentContent: {
        fontSize: 14,
        paddingLeft: "20%"
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
