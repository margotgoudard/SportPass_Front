import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import axios from 'axios';
import { FontAwesome5 } from '@expo/vector-icons';

const PostCommercantComponent = ({ post, showDetails = true }) => {
    const [commercantName, setCommercantName] = useState('');

    useEffect(() => {
        const fetchCommercantName = async () => {
            try {
                const response = await axios.get(`http://10.0.2.2:4000/api/commercant/${post.idCommercant}`);
                setCommercantName(response.data.nom); 
            } catch (error) {
                console.error('Error fetching commercant name:', error);
            }
        };

        fetchCommercantName();
    }, [post.idCommercant]);

    return (
        <View style={styles.postItem}>
            <View style={styles.postHeader}>
                <Image
                    source={require('../assets/pubCommercant.png')} 
                    style={styles.postProfileImage}
                />
                <View style={styles.textContent}>
                    <Text style={styles.postItemText}>{post.contenu}</Text>
                    <View style={styles.locationInfo}>
                        <FontAwesome5 name="map-marker-alt" size={24} color="black" />
                        <Text style={styles.commercantName}>{commercantName}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    postItem: {
        backgroundColor: 'white',
        padding: 10,
        marginTop: 5,
        borderRadius: 5,
        flex: 1,
        borderColor: '#008900', 
        borderWidth: 2
    },
    postProfileImage: {
        width: 80, 
        height: 80,
        marginRight: 10
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start', 
    },
    textContent: {
        flex: 1,
        flexDirection: 'column',
    },
    postItemText: {
        fontSize: 16,
        marginBottom: 5,
        marginTop: 5
    },
    locationInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5, 
    },
    commercantName: {
        marginLeft: 5,
        fontSize: 16
    }
});

export default PostCommercantComponent;
