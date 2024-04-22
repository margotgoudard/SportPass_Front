import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PaiementPage = () => {
  return (
    <View style={styles.container}>
      <Text>Paiement Page</Text>
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

export default PaiementPage;
