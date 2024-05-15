import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground, Linking } from 'react-native';
import axios from 'axios';
import URLS from '../../urlConfig.js';

const PostPartnerComponent = ({ post }) => {
    const [partner, setPartner] = useState(null);

    if (!post) {
        return null;
    }

    const fetchPartner = async () => {
        try {
            const response = await axios.get(`${URLS.url}/partenaire/${post.idPartenaire}`);
            setPartner(response.data);
        } catch (error) {
            console.error('Error fetching partner details', error);
        }
    };

    useEffect(() => {
        fetchPartner();
    }, [post.idPartenaire]);

    const handlePress = () => {
        if (partner && partner.site) {
            Linking.openURL(partner.site).catch(err => console.error('An error occurred', err));
        }
    };

    return (
        <View style={styles.container}>
        <TouchableOpacity activeOpacity={0.8} onPress={handlePress}>
            <ImageBackground
                source={{ uri: post.image }}
                style={styles.postItem}
                imageStyle={{ borderRadius: 8 }}
            >
                <Text style={styles.advertisementText}>Publicité</Text>
                <View style={styles.contentContainer}>
                    {partner && (
                        <Image source={{ uri: partner.logo }} style={styles.partnerLogo} />
                    )}
                    <View style={styles.textContainer}>
                        <Text style={styles.postTitle}>{post.titre}</Text>
                        <Text style={styles.postContent}>{post.contenu}</Text>
                    </View>
                </View>
            </ImageBackground>
        </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: "3%"
    },
    postItem: {
        padding: 30,
        marginBottom: 10,
        borderRadius: 8,
    },
    advertisementText: {
        position: 'absolute',
        top: 10,
        right: 10,
        color: 'white',
        fontStyle: 'italic',
        textShadowColor: 'rgba(0, 0, 0, 0.75)', 
        textShadowOffset: { width: 2, height: 2 }, 
        textShadowRadius: 5, 
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: "-5%"
    },
    partnerLogo: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
        borderRadius: 10, 
    },
    textContainer: {
        marginLeft: 10,
    },
    postTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: 'white', 
        textShadowColor: 'rgba(0, 0, 0, 0.75)', 
        textShadowOffset: { width: 2, height: 2 }, 
        textShadowRadius: 5, 
    },
    postContent: {
        fontSize: 16,
        color: 'white', 
        textShadowColor: 'rgba(0, 0, 0, 0.75)', 
        textShadowOffset: { width: 2, height: 2 }, 
        textShadowRadius: 5, 
    }
});

export default PostPartnerComponent;
