import {PermissionsAndroid} from 'react-native';
import {
  isLocationEnabled,
  promptForEnableLocationIfNeeded,
} from 'react-native-android-location-enabler';
import {requestNotifications, RESULTS} from 'react-native-permissions';

export const requestBackgroundLocationPermission = async () => {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
  );
  return granted === PermissionsAndroid.RESULTS.GRANTED;
};

export const requestNotificationPermission = async () => {
  const result = await requestNotifications();
  return result?.status === RESULTS.GRANTED;
};

export const requestFineLocationPermission = async () => {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );
  return granted === PermissionsAndroid.RESULTS.GRANTED;
};

export const requestCoarseLocationPermission = async () => {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
  );
  return granted === PermissionsAndroid.RESULTS.GRANTED;
};

export const checkIsLocationEnabled = async () => {
  const result = await isLocationEnabled();
  if (result) {
    return true;
  } else {
    const res = await promptForEnableLocationIfNeeded();
    return res === 'enabled';
  }
};
