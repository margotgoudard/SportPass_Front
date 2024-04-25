import React from 'react';
import {View, StyleSheet, ImageBackground} from 'react-native';

import LottieView from 'lottie-react-native';

export default function AppLoader(){
    return(
          <ImageBackground source={require('../assets/background.png')} style={styles.background}>
          <View style={styles.container}>
          <LottieView source={require('../assets/loading.json')}
          style={{width: "70%", height: "70%", zindex:1, top:330}}
          autoPlay
          loop
          />
          <LottieView source={require('../assets/loading_ball.json')}
          style={{width: "100%", height: "100%", zindex:2, bottom:150,
        }}
          autoPlay
          loop
          />
          </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
},
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column', 

    },
   
  });