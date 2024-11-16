/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';

import {SafeAreaView, StyleSheet, View} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {last} from 'lodash';
import Config from 'react-native-config';
import MapViewDirections from 'react-native-maps-directions';
import TravellerImage from '../assets/traveller_xs.png';
import {ApplicationContext} from '../contexts/ApplicationContext';
import {LocationContext} from '../contexts/LocationContext';
import {useGetTrackersQuery} from '../store/services/trackerApi';
import {getIsoGetStartOfDay} from '../utils/dateHelpers';

/*
  Internet connection is required to load the map.
  https://www.npmjs.com/package/@react-native-community/netinfo
*/

function Tracker() {
  const {
    currentLocation,
    // currentLocationError,
    // isLocationEnabled,
    // reInitiateCheck,
    storeLocation,
    // handleRequestCurrentLocation,
    handleStartLocationChangeObserver,
    isLocationChangeWatcherActive,
  } = useContext(LocationContext);
  const {tracker} = useContext(ApplicationContext);
  const navigation = useNavigation();
  const [isMapReady, setIsMapReady] = useState(false);
  const mapRef = useRef(null);
  const {data: trackers} = useGetTrackersQuery(
    {date: getIsoGetStartOfDay()},
    {
      pollingInterval: 30000,
      skipPollingIfUnfocused: true,
    },
  );

  const markerData = useMemo(() => {
    if (trackers && trackers.length) {
      const markers = trackers?.map(data => {
        const trackerLog = last(data?.trackerLogs);
        return {
          id: data?._id,
          title: data?.vehicle?.name,
          description: data?.destination?.address,
          // image
          // icon
          // pinColor
          coordinate: {
            latitude: trackerLog?.location?.latitude,
            longitude: trackerLog?.location?.longitude,
          },
          heading: trackerLog?.location?.heading,
        };
      });
      return markers?.filter(
        marker =>
          marker?.coordinate?.latitude &&
          marker?.coordinate?.longitude &&
          marker?.id !== tracker?._id,
      );
    }
    return [];
  }, [trackers, tracker]);

  const directionPoints = useMemo(() => {
    return {
      origin: {
        latitude: currentLocation?.latitude,
        longitude: currentLocation?.longitude,
      },
      destination: {
        latitude: tracker?.destination?.location?.latitude,
        longitude: tracker?.destination?.location?.longitude,
      },
      // enable: !!(
      //   currentLocation?.latitude &&
      //   currentLocation?.longitude &&
      //   tracker?.destination?.location?.latitude &&
      //   tracker?.destination?.location?.longitude
      // ),
      enable: false,
    };
  }, [tracker, currentLocation]);

  useEffect(() => {
    if (!tracker?._id) {
      navigation.navigate('Home');
    }
  }, [tracker, navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (!isLocationChangeWatcherActive) {
        handleStartLocationChangeObserver();
      }
    });
    return unsubscribe;
  }, [
    navigation,
    isLocationChangeWatcherActive,
    handleStartLocationChangeObserver,
  ]);

  const handleOnUserLocationChange = e => {
    if (e?.nativeEvent) {
      storeLocation(e?.nativeEvent?.coordinate);
    }
  };

  return (
    <SafeAreaView>
      <View className="flex h-full">
        <MapView
          // Handle this region change in such a way that when the user moves the map, the region should not change
          // region={{
          //   latitude:
          //     directionPoints?.origin?.latitude ||
          //     currentLocation?.latitude,
          //   longitude:
          //     directionPoints?.origin?.longitude ||
          //     currentLocation?.longitude,
          //   latitudeDelta: 0.0422,
          //   longitudeDelta: 0,
          // }}
          showsUserLocation={true}
          followsUserLocation={true}
          showsBuildings={false}
          showsCompass={true}
          showsTraffic={true}
          showsIndoors={false}
          loadingEnabled={true}
          zoomControlEnabled={true}
          moveOnMarkerPress={true}
          userInterfaceStyle="light"
          onUserLocationChange={handleOnUserLocationChange}
          style={styles.map}
          userLocationUpdateInterval={30000}
          initialRegion={{
            latitude: currentLocation?.latitude,
            longitude: currentLocation?.longitude,
            latitudeDelta: 0.0422,
            longitudeDelta: 0,
          }}
          provider={PROVIDER_GOOGLE}
          onMapReady={() => {
            setIsMapReady(true);
          }}
          ref={mapRef}>
          <Marker
            coordinate={{
              latitude: currentLocation?.latitude,
              longitude: currentLocation?.longitude,
            }}
            title="My Position"
            image={TravellerImage}
            rotation={currentLocation?.heading}
          />
          {markerData?.map((marker, index) => (
            <Marker
              key={index || marker?.id}
              coordinate={marker?.coordinate}
              title={marker.title}
              image={TravellerImage}
              rotation={marker?.heading}
            />
          ))}
          {isMapReady && directionPoints?.enable ? (
            <MapViewDirections
              origin={directionPoints?.origin}
              destination={'directionPoints?.destination'}
              apikey={Config.GOOGLE_MAPS_API_KEY}
              titleVisibility={'visible'}
              // timePrecision="now"
              strokeWidth={5}
              strokeColor="blue"
            />
          ) : (
            <></>
          )}
        </MapView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
  },

  plainView: {
    width: 60,
  },
});

export default Tracker;
