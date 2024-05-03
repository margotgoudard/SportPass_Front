import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import AppLoader from '../../components/AppLoader';
import ProgressBar from '../../components/ProgressBar';
import axios from 'axios'; 



export default function PaiementPage({ route }) {
  const { selectedPlaces } = route.params;
  //TO DO : initialiser à true
  const [loading, setLoading] = useState(false);

  if (loading) {
    return <AppLoader />;
  }

  return (
    <ImageBackground source={require('../../assets/background.png')} style={styles.background}>
    <ScrollView>
      <ProgressBar currentPage={4} />
      <View style={styles.container}>
      </View>
    </ScrollView>
    </ImageBackground>

    
  );
};

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
  },
});

