import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, TouchableOpacity, Alert } from 'react-native';
import AppLoader from '../../components/AppLoader';
import ProgressBar from '../../components/ProgressBar';
import { StripeProvider, CardForm, useConfirmPayment, useStripe } from '@stripe/stripe-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import URLS from '../../urlConfig.js';

export default function PaiementPage({ route, navigation }) {
  const { selectedPlaces, selectedTribune, selectedMatch } = route.params;
  const { confirmPayment } = useConfirmPayment();
  const { initPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState({});
  const [paymentError, setPaymentError] = useState(null);

  useEffect(() => {
    const initializePaymentSheet = async () => {
      try {
        await initPaymentSheet({
          merchantDisplayName: "Example, Inc.",
          allowsDelayedPaymentMethods: true,
          defaultBillingDetails: {
            name: 'Jane Doe',
          },
          returnURL: 'yourapp://payment-return'
        });
        setLoading(true);
      } catch (error) {
        console.error('Erreur lors de l\'initialisation du paiement:', error);
        setLoading(false);
      }
    };

    initializePaymentSheet();
  }, []);

  const fetchYourPaymentIntent = async (amount) => {
    try {
      const response = await axios.post(`${URLS.url}/create-payment-intent`, {
        amount: Math.round(amount * 100),
      });

      const { clientSecret } = response.data;
      return { clientSecret };
    } catch (error) {
      console.error('Erreur lors de la récupération du PaymentIntent:', error);
      return { error };
    }
  };

  if (!loading) {
    return <AppLoader />;
  }

  const totalPrice = selectedPlaces
    .reduce((accumulator, place) => accumulator + (place.price || 0), 0)
    .toFixed(2);

  const handlePayment = async () => {
    setLoading(true);
    setPaymentError(null);

    if (!cardDetails.complete) {
      setLoading(false);
      setPaymentError({ message: "Détails de la carte incomplets" });
      Alert.alert('Erreur lors du paiement', 'Les détails de la carte ne sont pas complets');
      return;
    }

    try {
      const { clientSecret, error } = await fetchYourPaymentIntent(totalPrice);

      if (error) {
        console.error('Erreur lors de la récupération du PaymentIntent:', error);
        setLoading(false);
        return;
      }

      const { paymentIntent, error: confirmError } = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
        paymentMethodData: {
          billingDetails: {
            email: 'goudard.margot@hotmail.com',
            name: 'Margot Goudard',
          },
        },
      });

      if (confirmError) {
        setPaymentError(confirmError);
        Alert.alert('Erreur lors du paiement', confirmError.message);
      } else {
        await updateTickets(selectedPlaces);
        navigation.navigate('Resume', {
          selectedPlaces,
          selectedTribune,
          selectedMatch,
          totalPrice
        });
      }
    } catch (error) {
      setPaymentError(error);
      console.error('Erreur lors du paiement:', error);
      Alert.alert('Erreur lors du paiement', error.message || 'Une erreur inconnue est survenue');
    }
    setLoading(false);
  };

  const updateTickets = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');

      await Promise.all(
        selectedPlaces.map(async (place) => {
          await axios.put(`${URLS.url}/billet/place/${place.idPlace}`, {
            idUser: userId,
            nom: place.guestNom,
            prenom: place.guestPrenom,
            reservee: true,
          });
        })
      );
    } catch (error) {
      console.error('Erreur lors de la mise à jour des billets :', error);
      Alert.alert('Erreur lors de la mise à jour des billets', error.message || 'Une erreur inconnue est survenue');
    }
  };

  return (
    <StripeProvider publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}>
      <ImageBackground source={require('../../assets/background.png')} style={styles.background}>
        <ScrollView>
          <ProgressBar currentPage={4} />
          <Text style={styles.totalPriceStyle}>Total à payer : {totalPrice}€</Text>
          <View style={styles.container}>
            <View style={styles.selectedPlaceDetails}>
              <Text style={styles.textTribune}>{selectedTribune.nom}</Text>
              <Text style={styles.nombreBilletStyle}>{selectedPlaces.length} billet(s)</Text>
              {selectedPlaces.map((place, index) => (
                <View key={index} style={styles.containerPlace}>
                  <View style={styles.Detcontainer}>
                    <View style={styles.detailsContainer}>
                      <View style={styles.textContainer}>
                        <Text style={styles.textPlace}>Rang {place.numRangee} - Siège {place.numero}</Text>
                        <Text style={styles.textPrix}>{place.type} - {place.price}€</Text>
                      </View>
                      <Text style={styles.textGuestInfo}>Titulaire - {place.guestPrenom} {place.guestNom}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
            <CardForm
              style={styles.cardForm}
              onFormComplete={(cardDetails) => setCardDetails(cardDetails)}
              cardStyle={{
                backgroundColor: '#FFFFFF',
                textColor: '#000000',
              }}
              placeholder={{
                number: 'Numéro de carte',
              }}
              defaultValues={{
                country: 'FR',
              }}
              language="fr"
            />
            <TouchableOpacity
              style={styles.payButton}
              onPress={handlePayment}
              disabled={!cardDetails.complete}
            >
              <Text style={styles.payButtonText}>Payer</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </StripeProvider>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    marginBottom: 60,
    marginTop: "12%",
  },
  containerPlace: {
    backgroundColor: '#D9D9D9',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 5,
  },
  Detcontainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  nombreBilletStyle: {
    marginLeft: 15,
    fontStyle: 'italic',
    marginBottom: 5,
  },
  totalPriceStyle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#BD4F6C',
    position: 'absolute',
    zIndex: 1,
    right: 20,
    top: 150,
  },
  detailsContainer: {
    borderRadius: 15,
    flexDirection: 'row',
    marginRight: 5,
    marginLeft: 5,
    marginVertical: 5,
    flexWrap: 'wrap',
    maxHeight: '100%',
    maxWidth: '100%',
    zIndex: 2,
  },
  selectedPlaceDetails: {
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 10,
    padding: 10,
    marginBottom: 70,
  },
  textTribune: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  textPlace: {
    fontSize: 17,
    fontWeight: 'bold'
  },
  textPrix: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#008900',
    marginLeft: 10
  },
  textGuestInfo: {
    fontSize: 15,
    fontStyle: 'italic',
    marginTop: 5,
  },
  textContainer: {
    flexDirection: 'row',
  },
  cardForm: {
    marginTop: "-10%",
    height: 190,
    marginHorizontal: "5%"
  },
  payButton: {
    marginTop: 20,
    backgroundColor: '#BD4F6C',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: "5%"
  },
  payButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
