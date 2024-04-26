import React, { Component } from 'react';
import { View, StyleSheet,TouchableOpacity,Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { AntDesign } from '@expo/vector-icons';

export default class Stade3D extends Component {
  render() {
    return (
        <View style={{flex: 1}}>
        <WebView
              originWhitelist={['*']}
              javaScriptEnabled={true}
              source={{html: `<iframe src="https://3dwarehouse.sketchup.com/embed/6d2a28805005e078a2deb3e6112290cf?token=8QtOYP8dOoE=&binaryName=s21" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" width="100%" height="100%" allowfullscreen></iframe>`
              }}
        />
       </View>
    );
  }
}


