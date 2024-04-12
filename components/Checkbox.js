import React,{useRef} from "react";
import {TouchableOpacity,Text,View,StyleSheet,Animated} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Checkbox = ({
    text, onPress, isChecked, containerStyle, textStyle, checkboxStyle,
}) => {

    const animatedWidth= useRef(new Animated.Value(0)).current;

    const startAnimation = () =>{
        const toValue = isChecked ? 0:30;
        Animated.timing(animatedWidth,{
            toValue:toValue,
            duration:500,
            useNativeDriver:false,
        }).start();
    }

    return(
        <View style= {[styles.container,containerStyle]}>
            <TouchableOpacity 
                onPress={()=>{
                    startAnimation();
                    onPress();
                }}  
                style= {[styles.checkbox, isChecked && styles.checkboxSelected, checkboxStyle,]}>
                <Animated.View style ={{width:animatedWidth}}> 
                <Ionicons name="checkmark" size={30} color="white" />                
                </Animated.View>
            </TouchableOpacity>
            <Text style={[styles.checkboxText, textStyle]}>{text}</Text>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flexDirection:'row',
        alignItems:'center',
        marginTop:10,
    },
    checkbox:{
        borderColor: '#008900',
        borderWidth :1,
        borderRadius: 5,
        height: 30,
        width:30,
    },
    checkboxSelected : {
        backgroundColor:'#008900',

    },
    checkboxText:{
        fontSize:16,
        marginLeft:10,
    },
});


export default Checkbox;