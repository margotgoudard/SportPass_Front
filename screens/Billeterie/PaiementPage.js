import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, TouchableOpacity, Alert } from 'react-native';
import AppLoader from '../../components/AppLoader';
import ProgressBar from '../../components/ProgressBar';
import { StripeProvider, CardField, useConfirmPayment, useStripe } from '@stripe/stripe-react-native';

export default function PaiementPage({ route }) {
  const { selectedPlaces } = route.params;
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
          }
        });
        setLoading(true);
      } catch (error) {
        console.error('Erreur lors de l\'initialisation du paiement:', error);
        setLoading(false);
      }
    };
  
    initializePaymentSheet();
  }, []);

  if (!loading) {
    return <AppLoader />;
  }

  const totalPrice = selectedPlaces
    .reduce((accumulator, place) => accumulator + (place.price || 0), 0)
    .toFixed(2);

  const fetchYourPaymentIntent = async (amount) => {
    try {
      const response = await axios.post('http://10.0.2.2:4000/api/create-payment-intent', {
        amount: Math.round(amount * 100), 
      });

      const { clientSecret } = response.data;
      return { clientSecret };
    } catch (error) {
      console.error('Erreur lors de la récupération du PaymentIntent:', error);
      return { error };
    }
  };

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
        console.log('Paiement réussi:', paymentIntent);
        Alert.alert('Paiement réussi', 'Votre paiement a été effectué avec succès.');
      }
    } catch (error) {
      setPaymentError(error);
      console.error('Erreur lors du paiement:', error);
      Alert.alert('Erreur lors du paiement', error.message || 'Une erreur inconnue est survenue');
    }
    setLoading(false);
  };

  return (
    <StripeProvider publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}>
    <ImageBackground source={require('../../assets/background.png')} style={styles.background}>
      <ScrollView>
        <ProgressBar currentPage={4} />
        <View style={styles.container}>
          <Text style={styles.header}>Résumé de votre commande :</Text>
          {selectedPlaces.map((place, index) => (
            <View key={index} style={styles.placeContainer}>
              <Text>Rang {place.numRangee} - Siège {place.numero}</Text>
              <Text>{place.type} - {place.price}€</Text>
            </View>
          ))}
          <Text style={styles.totalPrice}>Total à payer : {totalPrice}€</Text>
          {paymentError && <Text style={styles.errorText}>Erreur: {paymentError.message}</Text>}
          <CardField
    postalCodeEnabled={true}
    placeholder={{
        number: 'Numéro de carte',
    }}
    cardStyle={{
        backgroundColor: '#FFFFFF',
        textColor: '#000000',
    }}
    style={{
        width: '100%',
        height: 50,
        marginVertical: 30,
    }}
    onCardChange={(cardDetails) => {
        setCardDetails(cardDetails);
    }}
/>

          <TouchableOpacity
            style={styles.payButton}
            onPress={handlePayment}
            disabled={!cardDetails.complete}
          >
            <Text style={styles.payButtonText}>Payer avec Stripe</Text>
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
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  placeContainer: {
    marginBottom: 10,
  },
  totalPrice: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardField: {
    marginTop: 20,
    height: 50,
  },
  payButton: {
    marginTop: 20,
    backgroundColor: '#BD4F6C',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  payButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});
