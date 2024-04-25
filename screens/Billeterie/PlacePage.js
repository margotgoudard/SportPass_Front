import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import LottieView from 'lottie-react-native';


export default function PlacePage({route}){
const { selectedTribune } = route.params;

  return (
    <View>
          <LottieView source={require('../../assets/loading.json')}
          style={{width: "100%", height: "100%"}}
          autoPlay
          loop
          />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

