import React, { useState } from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const ArticleDisplay = ({ article }) => {
    const [showFullArticle, setShowFullArticle] = useState(false);

    const renderArticle = () => {
        const maxLength = 150; 
        if (article.length <= maxLength) {
            return article;
        } else if (!showFullArticle) {
            return article.slice(0, maxLength) + '...'; 
        } else {
            return article; 
        }
    };

    return (
        <React.Fragment>
            <Text style={styles.articleText}>{renderArticle()}</Text>
            {article.length > 150 && (
                <TouchableOpacity style={styles.textContainer} onPress={() => setShowFullArticle(!showFullArticle)}>
                    <MaterialIcons style={styles.logoArrow} name={showFullArticle ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={24} color="#008900" />
                    <Text style={styles.readMoreText}>{showFullArticle ? 'Voir moins' : 'Voir plus'}</Text>
                    <MaterialIcons style={styles.logoArrow} name={showFullArticle ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={24} color="#008900" />
                </TouchableOpacity>
            )}
        </React.Fragment>
    );
};

const styles = StyleSheet.create({
    articleText: {
        fontSize: 16,
        lineHeight: 24,
        color: 'black',
        marginBottom: 10,
    },
    readMoreText: {
        fontWeight: 'bold', 
        color: '#008900',
        marginTop: 5,
    },
    textContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoArrow:{
        marginTop:5,
    },
});

export default ArticleDisplay;
