import {View,Text} from 'react-native';
import React, { useState } from 'react';

export default function ClubForum({navigation}){
    const [reloadKey, setReloadKey] = useState(0);
    return (
        <View style={{flex : 1, alignItems:'center', justifyContent:'center'}}>
            <Text 
            onPress={()=> navigation.navigate('Home')}
            style={{fontSize:26, fontWeight:'bold'}}>
            Page ClubFOrum
            </Text>
        </View>
    )
}