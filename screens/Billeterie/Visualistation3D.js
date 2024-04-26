import React from 'react';
import { View, StyleSheet } from 'react-native';
import Stade3D from '../../components/Stade3D';

const Visualisation3D = () => {
  return (
    <View style={styles.container}>
      <Stade3D />
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

export default Visualisation3D;
