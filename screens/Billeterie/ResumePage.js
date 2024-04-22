import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ResumePage = () => {
  return (
    <View style={styles.container}>
      <Text>Résumé Page</Text>
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

export default ResumePage;
