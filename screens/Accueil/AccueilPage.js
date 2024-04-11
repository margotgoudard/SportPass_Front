import * as React from 'react';
import {View,Text} from 'react-native';

export default function Accueil({navigation}){
    return (
        <View style={{flex : 1, alignItems:'center', justifyContent:'center'}}>
            <Text 
            onPress={()=> alert('Cette page est la page d\'accueil')}
            style={{fontSize:26, fontWeight:'bold'}}>
            Page d'Accueil
            </Text>
        </View>
    )
}