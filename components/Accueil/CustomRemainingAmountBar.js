import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CustomRemainingAmountBar = ({ userAmount, nextPalierAmount }) => {
    const calculateProgress = () => {
        if (nextPalierAmount <= 0) return 0;
        const progressPercentage = (userAmount / nextPalierAmount) * 100;
        return Math.min(progressPercentage, 100); 
    };

    const progress = calculateProgress();

    return (
        <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
            <Text style={[styles.progressBarText, progress === 100 ? styles.profileCompleted : {}]}>
                {`Il manque ${nextPalierAmount - userAmount} € avant le prochain palier`}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    progressBarContainer: {
        width: '90%',
        height: 8,
        backgroundColor: '#D9D9D9',
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom:8,
    },
    progressBar: {
        height: '100%',
        backgroundColor: 'black',
        borderRadius: 10,
    },
    progressBarText: {
        marginTop: 5,
        textAlign: 'center',
        fontSize: 14,
    },
    profileCompleted: {
        color: 'black',
        fontWeight: 'bold',
    },
});

export default CustomRemainingAmountBar;
