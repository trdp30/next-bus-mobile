import Geolocation from '@react-native-community/geolocation';
import {Platform} from 'react-native';
import {
  isLocationEnabled,
  promptForEnableLocationIfNeeded,
} from 'react-native-android-location-enabler';
import {PERMISSIONS, requestMultiple, RESULTS} from 'react-native-permissions';
import Snackbar from 'react-native-snackbar';
import {catchError} from './catchError';

export async function checkIsLocationEnabled() {
  if (Platform.OS === 'android') {
    return await isLocationEnabled();
  }
}

export async function requestEnableLocation() {
  if (Platform.OS === 'android') {
    try {
      return await promptForEnableLocationIfNeeded();
      // The user has accepted to enable the location services
      // data can be :
      //  - "already-enabled" if the location services has been already enabled
      //  - "enabled" if user has clicked on OK button in the popup
    } catch (error) {
      if (error) {
        catchError(error);
        // The user has not accepted to enable the location services or something went wrong during the process
        // "err" : { "code" : "ERR00|ERR01|ERR02|ERR03", "message" : "message"}
        // codes :
        //  - ERR00 : The user has clicked on Cancel button in the popup
        //  - ERR01 : If the Settings change are unavailable
        //  - ERR02 : If the popup has failed to open
        //  - ERR03 : Internal error
      }
      return false;
    }
  }
}

export const getCurrentPosition = ({onSuccess, onError}) => {
  Geolocation.getCurrentPosition(onSuccess, onError, {
    enableHighAccuracy: true,
  });
};

export const getPermissions = async () => {
  const toRequestPermissions =
    Platform.OS === 'android'
      ? [
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
          // PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
          PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
        ]
      : [PERMISSIONS.IOS.LOCATION_ALWAYS];

  try {
    const permissionStatuses = await requestMultiple(toRequestPermissions);
    // Todo: Have to check the "precise location" is granted or not.
    const result = permissionStatuses[toRequestPermissions[0]];

    if (result === RESULTS.GRANTED) {
      return true;
    } else {
      Snackbar.show({
        text: 'Location permissions are needed to proceed with the app. Please re-open and accept.',
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  } catch (error) {
    console.error('Error requesting permissions', error);
    return false;
  }
};

export const formatLocation = location => {
  if (location) {
    if (location?.coords) {
      const {latitude, longitude, ...rest} = location.coords;
      if (latitude && longitude) {
        return {
          latitude: latitude,
          longitude: longitude,
          ...rest,
        };
      } else {
        return null;
      }
    } else if (location?.latitude && location?.longitude) {
      const {latitude, longitude, ...rest} = location;
      return {
        latitude: latitude,
        longitude: longitude,
        ...rest,
      };
    }
  }
  return null;
};
