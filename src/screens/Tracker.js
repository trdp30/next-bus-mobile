/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';
import MapView, {Marker} from 'react-native-maps';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import usePermissions from '../hooks/usePermissions';
import WatchPosition from '../components/WatchPosition';
import GetCurrentLocationExample from '../components/GetCurrentLocation';
import LogoutButton from '../components/LogoutButton';
import {useSelector} from 'react-redux';
import {selectUser} from '../store/selectors/session.selector';

/*
  Internet connection is required to load the map.
  https://www.npmjs.com/package/@react-native-community/netinfo
  
  Enable location from the application itself:
  https://www.npmjs.com/package/react-native-android-location-enabler
*/

function Home() {
  const isDarkMode = useColorScheme() === 'dark';
  const user = useSelector(selectUser);
  const {arePermissionsApproved} = usePermissions();
  const [location, setLocation] = useState({
    latitude: 26.63269143,
    longitude: 93.6035072,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView>
      <View
        style={{
          backgroundColor: isDarkMode ? Colors.black : Colors.white,
          height: '100%',
          width: '100%',
        }}>
        <WatchPosition />
        <GetCurrentLocationExample
          location={location}
          setLocation={setLocation}
        />
        <MapView
          style={{flex: 1}}
          initialRegion={{
            latitude: location?.latitude,
            longitude: location?.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          provider="google"
          onMapReady={() => {
            console.log('Map ready');
          }}>
          <Marker
            coordinate={{
              latitude: location?.latitude,
              longitude: location?.longitude,
            }}
            title={'Current Location'}
            description={'Current Location'}
          />
        </MapView>
        <LogoutButton />
      </View>
    </SafeAreaView>
  );
}

export default Home;
