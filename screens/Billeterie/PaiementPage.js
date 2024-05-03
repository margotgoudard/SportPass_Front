import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppLoader from '../../components/AppLoader';
import ProgressBar from '../../components/ProgressBar';
import axios from 'axios'; 



export default function PaiementPage({ route }) {
  const { selectedPlaces } = route.params;

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

