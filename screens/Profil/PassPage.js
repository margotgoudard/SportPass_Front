import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';


const Pass = ({ route, navigation }) => {
  const { userId } = route.params;
  const [abonnements, setAbonnements] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const day = (`0${date.getDate()}`).slice(-2);
  
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const fetchAbonnements = async () => {
      try {
        setLoading(true);
        const responsePasses = await axios.get(`http://10.0.2.2:4000/api/possederPass/user/${userId}`);
        const passes = responsePasses.data;
        
        const detailedPassesPromises = passes.map(async (pass) => {
          const appartientPassResponse = await axios.get(`http://10.0.2.2:4000/api/appartientPass/pass/${pass.idPass}`);
          const appartientPass = appartientPassResponse.data[0]; 
  
          const billetResponse = await axios.get(`http://10.0.2.2:4000/api/billet/${appartientPass.idBillet}`);
          const billet = billetResponse.data;

          const matchResponse = await axios.get(`http://10.0.2.2:4000/api/matchs/${billet.Match.idMatch}`);
          const match = matchResponse.data;

          const placeResponse = await axios.get(`http://10.0.2.2:4000/api/place/${billet.Place.idPlace}`);
          const place = placeResponse.data;

          const rangeeResponse = await axios.get(`http://10.0.2.2:4000/api/rangee/${billet.Place.idRangee}`);
          const rangee = rangeeResponse.data;

          const tribuneResponse = await axios.get(`http://10.0.2.2:4000/api/tribune/${rangee.idTribune}`);
          const tribune = tribuneResponse.data;

          const stadeResponse = await axios.get(`http://10.0.2.2:4000/api/stade/${tribune.idStade}`);
          const stade = stadeResponse.data;

          return {
            ...pass,
            billet, 
            match,
            tribune,
            rangee,
            place,
            stade
          };
        });

        const detailedPasses = await Promise.all(detailedPassesPromises);
        setAbonnements(detailedPasses);
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
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonContainer}>
                <AntDesign name="arrowleft" size={26} color="#BD4F6C" />
      </TouchableOpacity>
      {abonnements.length > 0 ? (
        abonnements.map((abonnement, index) => (
          <View key={index} style={styles.abonnementItem}>
            <Text style={styles.abonnementText}>{abonnement.nom}</Text>
            <Text style={styles.abonnementTextValidité}>Valable jusqu'au : {formatDate(abonnement.date_fin)}</Text>
            <View style={styles.detailItem}>
            <Text style={styles.billetText}>Siège {abonnement.place.numero}</Text>
            <Entypo name="dot-single" size={25} color="black" style={styles.detailIcon} />
            <Text style={styles.billetText}>Rang {abonnement.rangee.numero}</Text>
            <Entypo name="dot-single" size={25} color="black" style={styles.detailIcon} />
            <Text style={styles.billetText}>Tribune {abonnement.tribune.numero}</Text>
          </View>
          <Text style={styles.priceText}>Prix: {abonnement.prix}€</Text>
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
    backgroundColor: '#f0f0f5',
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  abonnementItem: {
    marginTop: "5%",
    backgroundColor: '#ffffff', 
    padding: 20,
    borderRadius: 10, 
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, 
    marginBottom: 20, 
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  abonnementText: {
    fontSize: 18,
    color: 'green',
    fontWeight: 'bold', 
  },
  abonnementTextValidité: {
    fontSize: 16,
  },
  billetText: {
    fontSize: 16,
    fontWeight: "bold"
  },
  noAbonnementText: {
    textAlign: 'center',
    marginTop: 20,
  },
  backButtonContainer: {
    marginLeft: "4%",
    marginTop: "8%",
  },
  priceText: {
    fontStyle: 'italic', 
    fontSize: 14,
    alignSelf: 'flex-end',
  },
  detailItem: {
    flexDirection: 'row', 
    alignItems: 'center', 
    flexWrap: 'wrap', 
  },
});

export default Pass;