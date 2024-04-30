import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { FontAwesome5 } from '@expo/vector-icons';

const Map = ({ commercants, region }) => {    
    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                region={region}
                customMapStyle={mapStyle}
            >
                {commercants.map((commercant, index) => (
                    <Marker
                        key={index}
                        coordinate={{ latitude: commercant.latitude, longitude: commercant.longitude }}
                        title={commercant.nom}
                        description={commercant.adresse}
                    >
                        <FontAwesome5 name="map-pin" size={26} color="#BD4F6C" />
                    </Marker>
                ))}
            </MapView>
        </View>
    );
};

    const mapStyle = [
        {
            "elementType": "labels",
            "stylers": [{ "visibility": "off" }]
        },
        {
            "featureType": "road",
            "stylers": [{ "visibility": "off" }]
        },
        {
            "featureType": "poi",
            "stylers": [{ "visibility": "off" }]
        },
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{ "color": "#ffffff" }]
        },
        {
            "featureType": "transit",
            "stylers": [{ "visibility": "off" }]
        },
        {
            "featureType": "landscape",
            "stylers": [{ "color": "#3D4049" }]
        },
        {
            "featureType": "administrative.country",
            "elementType": "geometry",
            "stylers": [
                { "visibility": "on" },
                { "color": "#ffffff" }
            ],
        }
        
    ];

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    map: {
        width: Dimensions.get('window').width - 60,
        height: Dimensions.get('window').height - 400,
    },
});

export default Map;


   