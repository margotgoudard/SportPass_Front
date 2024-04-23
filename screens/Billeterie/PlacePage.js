import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PlacePage({route}){
const { selectedTribune } = route.params;

  return (
    <View style={styles.container}>
      <Text>Place Page</Text>
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

