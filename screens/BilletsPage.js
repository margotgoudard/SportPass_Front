import React, { useState, useEffect } from 'react';
import { Linking, View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';


const Billet = ({ route, navigation }) => {
  const { userId } = route.params;
  const [billets, setBillets] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const day = (`0${date.getDate()}`).slice(-2);
  
    return `${day} ${month} ${year}`;
  };

  useEffect(() => {
    const fetchBillets = async () => {
      try {
        setLoading(true);
        const responseBillets = await axios.get(`http://10.0.2.2:4000/api/billet/user/${userId}`);
        const billets = responseBillets.data;
        
        const detailedBilletsPromises = billets.map(async (billet) => {

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
            ...billet,
            match,
            tribune,
            rangee,
            place,
            stade
          };
        });

        const detailedBillets = await Promise.all(detailedBilletsPromises);

        const billetsGroupedByMatch = detailedBillets.reduce((acc, billet) => {
            if (!acc[billet.match.idMatch]) {
              acc[billet.match.idMatch] = {
                matchInfo: billet.match,
                billets: [],
              };
            }
            acc[billet.match.idMatch].billets.push(billet);
            return acc;
          }, {});

        const billetsGroupedArray = Object.values(billetsGroupedByMatch);

        setBillets(billetsGroupedArray);
      } catch (error) {
        console.error("Erreur lors de la récupération des billets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBillets();
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
      {billets.length > 0 ? (
        billets.map((group, index) => (
          <View key={index} style={styles.matchGroup}>
            <Text style={styles.matchHeaderText}>{group.matchInfo.EquipeDomicile.nom} - {group.matchInfo.EquipeExterieure.nom}</Text>
            <Text style={styles.matchDateStadiumText}>{formatDate(group.matchInfo.date)} à {group.matchInfo.heure_debut} - {group.matchInfo.Stade.nom}</Text>
            <Text style={styles.totalBilletsText}>{group.billets.length} billets</Text>
            {group.billets.map((billet, billetIndex) => (
                <View  key={billetIndex} style={styles.detailItem}>
            <Text style={styles.billetText}>Siège {billet.place.numero}</Text>
            <Entypo name="dot-single" size={25} color="black" style={styles.detailIcon} />
            <Text style={styles.billetText}>Rang {billet.rangee.numero}</Text>
            <Entypo name="dot-single" size={25} color="black" style={styles.detailIcon} />
            <Text style={styles.billetText}>Tribune {billet.tribune.numero}</Text>
            <TouchableOpacity onPress={() => Linking.openURL(billet.urlPdf)} style={styles.billetText}>
                <Octicons name="download" size={24} color="#BD4F6C" />
            </TouchableOpacity>
          </View>
            ))}
            <Text style={styles.totalPriceText}>Total: {group.billets.reduce((acc, curr) => acc + curr.prix, 0)}€</Text>
          </View>
        ))
      ) : (
        <Text style={styles.nobilletText}>Pas de billets.</Text>
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
    matchGroup: {
      backgroundColor: '#ffffff', 
      padding: 20,
      borderRadius: 10, 
      marginTop: "5%"
    },
    matchHeaderText: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 5,
      textAlign: 'center',
    },
    matchDateStadiumText: {
      fontSize: 16,
      marginTop: "5%",
      textAlign: 'center', 
    },
    totalBilletsText: {
      fontSize: 14,
      fontStyle: 'italic', 
    },
    billetDetailText: {
      fontSize: 16,
      marginBottom: "5%",
      fontWeight: 'bold', 
    },
    totalPriceText: {
        marginTop: "2%",
      fontStyle: 'italic',
      fontSize: 16,
      alignSelf: 'flex-end',
      color: "green"
    },
    nobilletText: {
      textAlign: 'center',
      marginTop: 20,
    },
  backButtonContainer: {
    marginLeft: "4%",
    marginTop: "8%",
},  
billetText: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: "2%",
    marginBottom: "3%"
  },
  detailItem: {
    flexDirection: 'row', 
    alignItems: 'center', 
    flexWrap: 'wrap', 
  },
  downloadLinkText: {
    color: '#BD4F6C', 
    textDecorationLine: 'underline', 
    fontWeight: 'bold', 
    alignSelf: 'center', 
    marginTop: 10, 
},

});

export default Billet;