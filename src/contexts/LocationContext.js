import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import PermissionAndSettingError from '../screens/PermissionAndSettingError';
import {selectCurrentLocation} from '../store/selectors/session.selector';
import {updateCurrentLocation} from '../store/slices/session';
import {
  checkIsLocationEnabled,
  getCurrentPosition,
  getPermissions,
  requestEnableLocation,
} from '../utils/locationHelper';

export const LocationContext = createContext({});

export const LocationProvider = ({children}) => {
  const [processing, setProcessing] = useState(true);
  const [validating, setValidating] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const currentLocation = useSelector(selectCurrentLocation);
  const [currentLocationError, setCurrentLocationError] = useState(null);
  const dispatch = useDispatch();

  const storeLocation = useCallback(
    pos => {
      dispatch(updateCurrentLocation(pos));
    },
    [dispatch],
  );

  const reset = useCallback(() => {
    setProcessing(() => true);
    setPermissionGranted(() => false);
    setIsLocationEnabled(() => false);
    storeLocation(null);
    setCurrentLocationError(() => null);
    initiateCheck();
  }, [storeLocation]);

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
