import React from 'react';
import { View, StyleSheet, Text, Image} from 'react-native';

const ProgressBar = ({ currentPage }) => {
    const steps = [1, 2, 3, 4]; 
    const stepWidth = 100 / steps.length; 
    const completedWidth = stepWidth * currentPage; 
    const iconPosition = completedWidth ? `${completedWidth-18}%` : '0%';
    const text = ['Sélectionner un match','Sélectionner une tribune', 'Selectionner une place','Paiement'];

    return (
        <View>
        <View style={styles.container}>
            {steps.map(step => (
                <View key={step} style={[styles.stepContainer, { width: `${stepWidth}%` }]}>
                    <View style={[styles.step, step <= currentPage ? styles.completedStep : null]} />
                    <Text style={styles.stepNumber}>{step}</Text>
                </View>
            ))}
            <View style={[styles.progress, { width: `${completedWidth}%` }]} />
            <Image source={require('../assets/soccer-ball.png')} style={[styles.icon, { left: iconPosition }]}/>
            </View>
            <View><Text style={styles.text}>{text[currentPage - 1]}</Text></View>
            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        marginTop: 45,
        marginHorizontal: 60,
        height: 50, 
        borderRadius: 30, 
        backgroundColor: '#D9D9D9',
        justifyContent: 'center',
        position:'relative',
        padding: 5,
    },
    stepContainer: {
        alignItems: 'center',
    },
    step: {
        width: '100%',
        borderRadius: 4,
        marginBottom: 5,
    },
    progress: {
        height: 50, 
        borderRadius: 30, 
        backgroundColor: '#008900',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1,
    },
    stepNumber: {
        color: '#FFFFFF', 
        fontSize: 32, 
        fontWeight: 'bold', 
        textAlign: 'center',
        top: -7,  
        width: '100%',
        zIndex: 3,
    },
    icon: {
        position: 'absolute',
        top: '50%',
        transform: [{ translateY: -19 }],
        zIndex: 2,
        width:48,
        height:48,
    },
    text:{
        color:'#FFFFFF',
        fontWeight:'bold',
        textAlign: 'center',
        fontSize: 22, 
    }
});

export default ProgressBar;
