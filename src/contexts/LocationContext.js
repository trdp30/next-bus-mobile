import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  checkIsLocationEnabled,
  getCurrentPosition,
  getPermissions,
  requestEnableLocation,
} from '../utils/locationHelper';
import PermissionAndSettingError from '../screens/PermissionAndSettingError';
import {View, Text} from 'react-native';

export const LocationContext = createContext({});

export const LocationProvider = ({children}) => {
  const [processing, setProcessing] = useState(true);
  const [validating, setValidating] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentLocationError, setCurrentLocationError] = useState(null);

  const storeLocation = useCallback(pos => {
    setCurrentLocation(pos);
  }, []);

  const reset = useCallback(() => {
    setProcessing(() => true);
    setPermissionGranted(() => false);
    setIsLocationEnabled(() => false);
    setCurrentLocation(() => null);
    setCurrentLocationError(() => null);
    initiateCheck();
  }, []);

  const initiateCheck = async () => {
    const enabled = await checkIsLocationEnabled();
    if (enabled) {
      setIsLocationEnabled(() => true);
    } else {
      const result = await requestEnableLocation();
      setIsLocationEnabled(() => !!result);
    }
    const granted = await getPermissions();
    if (granted) {
      setPermissionGranted(() => true);
    } else {
      setPermissionGranted(() => false);
    }
    setProcessing(() => false);
  };

  useEffect(() => {
    reset();
  }, [reset]);

  useEffect(() => {
    if (!processing) {
      setValidating(() => true);
      if (!isLocationEnabled) {
        setCurrentLocationError(
          'Location services are needed to proceed with the app. Please enable location services.',
        );
      } else if (!permissionGranted) {
        setCurrentLocationError(
          "The Precise Location permissions are needed to proceed with the app. Visit the app's setting and provide permission. Once done please re-open the app and accept the permissions.",
        );
      } else {
        handleRequestCurrentLocation();
      }
      setValidating(() => false);
    }
  }, [
    processing,
    permissionGranted,
    isLocationEnabled,
    handleRequestCurrentLocation,
  ]);

  console.log('isLocationEnabled', isLocationEnabled);

  const handleRequestCurrentLocation = useCallback(() => {
    getCurrentPosition({
      onSuccess: storeLocation,
      onError: error => {
        setCurrentLocationError(
          'Unable to fetch the current location. ' + error?.message || error,
        );
      },
    });
  }, [storeLocation, setCurrentLocationError]);

  const value = useMemo(
    () => ({
      processing,
      isLocationEnabled: currentLocation !== null,
      handleRequestCurrentLocation,
      currentLocation,
      currentLocationError,
      reInitiateCheck: reset,
      storeLocation,
    }),
    [
      handleRequestCurrentLocation,
      currentLocation,
      currentLocationError,
      processing,
      reset,
      storeLocation,
    ],
  );

  if (processing || validating) {
    return (
      <LocationContext.Provider value={value}>
        <View>
          <Text>Validating setting...</Text>
        </View>
      </LocationContext.Provider>
    );
  }

  if (!processing && currentLocationError && !validating) {
    return (
      <LocationContext.Provider value={value}>
        <PermissionAndSettingError />
      </LocationContext.Provider>
    );
  }

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export const LocationConsumer = LocationContext.Consumer;
