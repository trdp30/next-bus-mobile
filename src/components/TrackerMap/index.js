/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {formatLocation, getCurrentPosition} from '@/src/utils/locationHelpers';
import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import TravelerImage from '../../assets/traveler_xs.png';
import {Box} from '../ui/box';
import {Text} from '../ui/text';

/*
  Internet connection is required to load the map.
  https://www.npmjs.com/package/@react-native-community/netinfo
*/

function TrackerMap({
  currentTracker,
  handleUpdateTrackerToInactive,
  // isTrackerActive,
  // selectedMonitoringVehicles,
}) {
  const [myLocation, setMyLocation] = useState(null);
  // const {data: vehicles} = useGetVehiclesQuery(
  //   {
  //     vehicleIds: ['6726da1c785c3d7c32997cfb'],
  //     // vehicleIds: map(selectedMonitoringVehicles, '_id'),
  //   },
  //   {
  //     skip: !selectedMonitoringVehicles?.length,
  //   },
  // );
  // const {data: monitoringTrackers} = useGetTrackersQuery(
  //   {
  //     date: getIsoGetStartOfDay(),
  //     // vehicle: map(selectedMonitoringVehicles, '_id') || null,
  //     vehicle: ['6726da1c785c3d7c32997cfb'],
  //   },
  //   {
  //     pollingInterval: Config.POLLING_INTERVAL,
  //     skipPollingIfUnfocused: true,
  //   },
  // );

  // const monitoringTrackersForToday = useMemo(() => {
  // return map(monitoringTrackers, tracker => {
  //   return {
  //     ...tracker,
  //     trackerLog: last(tracker.trackerLogs)?.location,
  //     vehicle: vehicles.find(vehicle => vehicle._id === tracker.vehicle),
  //   };
  // });
  // }, [monitoringTrackers, vehicles]);

  // console.log('monitoringTrackersForToday', monitoringTrackersForToday);

  // const mapRef = useRef(null);
  // const myTrackerLocation = useMemo(() => {
  //   if (currentTracker?.trackerLogs?.length) {
  //     return last(currentTracker.trackerLogs)?.location;
  //   }
  // }, [currentTracker]);

  const handleOnUserLocationChange = event => {
    // const {latitude, longitude} = event.nativeEvent.coordinate;
    setMyLocation(formatLocation(event?.nativeEvent?.coordinate));
    // console.log('handleOnUserLocationChange', latitude, longitude
  };

  useEffect(() => {
    getCurrentPosition().then(position => {
      if (position?.coords) {
        const data = formatLocation(position);
        setMyLocation(data);
      } else {
        console.log('position.coords is not available');
      }
    });
  }, []);

  return (
    <Box className="flex flex-1">
      {myLocation?.latitude && myLocation?.longitude ? (
        <Box className="flex flex-1 flex-col">
          <MapView
            // region={{
            //   latitude: myLocation?.latitude,
            //   longitude: myLocation?.longitude,
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
            // userLocationUpdateInterval={30000}
            initialRegion={{
              latitude: myLocation?.latitude,
              longitude: myLocation?.longitude,
              latitudeDelta: 0.0422,
              longitudeDelta: 0,
            }}
            provider={PROVIDER_GOOGLE}
            // ref={mapRef}
          >
            {/* {map(monitoringTrackersForToday, monitoringTracker => (
            <Marker
              key={monitoringTracker?.latitude}
              coordinate={{
                latitude: monitoringTracker?.latitude,
                longitude: monitoringTracker?.longitude,
              }}
              title="Tracker Position"
              image={TravelerImage}
              rotation={monitoringTracker?.heading}
            />
          ))} */}
            {myLocation?.latitude && myLocation?.longitude ? (
              <Marker
                coordinate={{
                  latitude: myLocation?.latitude,
                  longitude: myLocation?.longitude,
                }}
                title="My Position"
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
}

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
