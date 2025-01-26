/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {MonitoringTrackerContext} from '@/src/contexts/MonitoringTrackerContext';
import {formatLocation} from '@/src/utils/locationHelpers';
import {map} from 'lodash';
import React, {Fragment, memo, useContext, useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import TravelerImage from '../../assets/traveler_xs.png';
import {Box} from '../ui/box';
import {Text} from '../ui/text';

/*
  Internet connection is required to load the map.
  https://www.npmjs.com/package/@react-native-community/netinfo
*/

const TrackerMap = memo(() => {
  const [myLocation, setMyLocation] = useState(null);
  const {monitoringTrackerLocations} = useContext(MonitoringTrackerContext);
  const handleOnUserLocationChange = event => {
    const data = formatLocation(event?.nativeEvent?.coordinate);
    // if (!isEqual(data, myLocation)) {
    //   setMyLocation(formatLocation(event?.nativeEvent?.coordinate));
    // }
  };

  useEffect(() => {
    // getCurrentPosition().then(position => {
    //   if (position?.coords) {
    //     const data = formatLocation(position);
    //     setMyLocation(data);
    //   } else {
    //     console.log('position.coords is not available');
    //   }
    // });
  }, []);

  return (
    <Box className="flex flex-1">
      {myLocation?.latitude && myLocation?.longitude ? (
        <Box className="flex flex-1 flex-col">
          <MapView
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
            userLocationUpdateInterval={50000}
            onUserLocationChange={handleOnUserLocationChange}
            style={styles.map}
            initialRegion={{
              latitude: myLocation?.latitude,
              longitude: myLocation?.longitude,
              latitudeDelta: 0.0422,
              longitudeDelta: 0,
            }}
            provider={PROVIDER_GOOGLE}>
            {map(monitoringTrackerLocations, monitoringTracker => (
              <Fragment key={monitoringTracker?._id}>
                {monitoringTracker?.location?.latitude &&
                monitoringTracker?.location?.longitude ? (
                  <Marker
                    key={monitoringTracker?._id}
                    coordinate={{
                      latitude: monitoringTracker?.location?.latitude,
                      longitude: monitoringTracker?.location?.longitude,
                    }}
                    title={`${monitoringTracker?.vehicle?.name}, ${monitoringTracker?.vehicle?.registration_number}`}
                    image={TravelerImage}
                    rotation={monitoringTracker?.location?.heading}
                  />
                ) : (
                  <></>
                )}
              </Fragment>
            ))}
            {myLocation?.latitude && myLocation?.longitude ? (
              <Marker
                coordinate={{
                  latitude: myLocation?.latitude,
                  longitude: myLocation?.longitude,
                }}
                title={'My Position'}
                image={TravelerImage}
                rotation={myLocation?.heading}
              />
            ) : (
              <></>
            )}
          </MapView>
        </Box>
      ) : (
        <Box className="flex flex-1 justify-center items-center">
          <Text>Loading current location</Text>
        </Box>
      )}
    </Box>
  );
});

const styles = StyleSheet.create({
  map: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    ...StyleSheet.absoluteFillObject,
  },

  plainView: {
    width: 60,
  },
});

export default TrackerMap;
