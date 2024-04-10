import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';

const Abonnement = ({ route, navigation }) => {
    const { userId } = route.params;
    const [abonnements, setAbonnements] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
        const fetchAbonnements = async () => {
            try {
              setLoading(true);
              const responsePasses = await axios.get(`http://10.0.2.2:4000/api/possederPass/user/${userId}`);
              const passes = responsePasses.data;
              console.log(passes)
          
              const appartientPassPromises = passes.map(pass => 
                axios.get(`http://10.0.2.2:4000/api/appartientPass/${pass.idPass}`)
              );
              const appartientPassResponses = await Promise.all(appartientPassPromises);
              const appartientPasses = appartientPassResponses.map(response => response.data).flat(); // Assurez-vous de platir la structure si nécessaire
          
              const billetsPromises = appartientPasses.map(appartient => 
                axios.get(`http://10.0.2.2:4000/api/billet/${appartient.idBillet}`)
              );
              const billetsResponses = await Promise.all(billetsPromises);
              const billets = billetsResponses.map(response => response.data);
          
              setAbonnements(billets);
            } catch (error) {
              console.error("Erreur lors de la récupération des abonnements:", error);
            } finally {
              setLoading(false);
            }
          };
          
  
      fetchAbonnements();
    }, [userId]);
  
    if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
  
    return (
      <ScrollView style={styles.container}>
        {abonnements.length > 0 ? (
          abonnements.map((abonnement, index) => (
            <View key={index} style={styles.abonnementItem}>
              <Text style={styles.abonnementText}>{abonnement.nom}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noAbonnementText}>Pas d'abonnements.</Text>
        )}
      </ScrollView>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    abonnementItem: {
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#cccccc',
    },
    abonnementText: {
      fontSize: 18,
    },
    noAbonnementText: {
      textAlign: 'center',
      marginTop: 20,
    },
  });
  
  export default Abonnement;
  