import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PlacePage = () => {
  return (
    <View style={styles.container}>
      <Text>Place Page</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PlacePage;
