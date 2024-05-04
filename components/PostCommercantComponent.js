import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import axios from 'axios';
import { FontAwesome5 } from '@expo/vector-icons';

const PostCommercantComponent = ({ post, showDetails = true }) => {

    return (
        <View style={styles.postItem}>
            <View style={styles.postHeader}>
                <Image
                    source={{ uri: post.Commercant.image }}
                    style={styles.postProfileImage}
                />
                <View style={styles.textContent}>
                    <Text style={styles.titre}>OFFRE FLASH</Text>
                    <Text style={styles.postItemText}>{post.contenu}</Text>
                    <View style={styles.locationInfo}>
                        <FontAwesome5 name="map-marker-alt" size={20} color="black" />
                        <Text style={styles.commercantName}>{post.Commercant.nom}</Text>
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
        width: 100, 
        height: 100,
        marginRight: 10
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start', 
    },
    textContent: {
        flex: 1,
        flexDirection: 'column',
        marginHorizontal: "2%"
    },
    titre: {
        fontSize: 16,
        color: "#008900",
        fontWeight: "bold"
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
