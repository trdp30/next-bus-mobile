import {produce} from 'immer';
import React, {useCallback, useMemo, useReducer, useState} from 'react';
import {PermissionModal} from '../components/PermissionModal';
import {
  checkIsLocationEnabled,
  requestBackgroundLocationPermission,
  requestCoarseLocationPermission,
  requestFineLocationPermission,
  requestNotificationPermission,
} from '../utils/permissionHelpers';

const initialState = {
  notification: {
    granted: false,
    name: 'Notification',
    description: 'To notify you about the trip status and updates.',
    error: '',
  },
  location: {
    granted: false,
    name: 'Location',
    description: 'To track your trip and provide you with the best experience.',
    error: '',
  },
  background: {
    granted: false,
    name: 'Background Location',
    description: 'To track your trip even when the app is not in use.',
    error: '',
  },
  gps: {
    granted: false,
    name: 'GPS Setting',
    description: 'To track your trip when the app is in use.',
    error: '',
  },
};

const reducer = (state, action) => {
  return produce(state, draft => {
    switch (action.type) {
      case 'NOTIFICATION':
        draft.notification.granted = action.payload.granted;
        draft.notification.error = action.payload.error;
        break;
      case 'LOCATION':
        draft.location.granted = action.payload.granted;
        draft.location.error = action.payload.error;
        break;
      case 'BACKGROUND_LOCATION':
        draft.background.granted = action.payload.granted;
        draft.background.error = action.payload.error;
        break;
      case 'GPS':
        draft.gps.granted = action.payload.granted;
        draft.gps.error = action.payload.error;
        break;
      case 'RESET':
        return initialState;
      default:
        break;
    }
  });
};

export const PermissionContext = React.createContext({});

export const PermissionProvider = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isRequesting, toggleIsRequesting] = useState(false);
  const [requestError, setRequestError] = useState('');
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const resetPermissions = () => {
    dispatch({type: 'RESET'});
  };

  const getLocationPermission = async () => {
    try {
      const locationPermission = await requestFineLocationPermission();
      await requestCoarseLocationPermission();
      dispatch({
        type: 'LOCATION',
        payload: {
          granted: locationPermission,
          error: locationPermission ? '' : 'Location permission denied.',
        },
      });
      return locationPermission;
    } catch (error) {
      dispatch({
        type: 'LOCATION',
        payload: {
          granted: false,
          error:
            error?.message ||
            error ||
            'An error occurred while requesting location permission.',
        },
      });
      return false;
    }
  };

  const getBackgroundLocationPermission = async () => {
    try {
      const bgPermission = await requestBackgroundLocationPermission();
      dispatch({
        type: 'BACKGROUND_LOCATION',
        payload: {
          granted: bgPermission,
          error: bgPermission ? '' : 'Background location permission denied.',
        },
      });
      return bgPermission;
    } catch (error) {
      dispatch({
        type: 'BACKGROUND_LOCATION',
        payload: {
          granted: false,
          error:
            error?.message ||
            error ||
            'An error occurred while requesting background location permission.',
        },
      });
      return false;
    }
  };

  const getNotificationPermission = useCallback(async () => {
    try {
      const notificationPermission = await requestNotificationPermission();
      dispatch({
        type: 'NOTIFICATION',
        payload: {
          granted: notificationPermission,
          error: notificationPermission
            ? ''
            : 'Notification permission denied.',
        },
      });
      return notificationPermission;
    } catch (error) {
      dispatch({
        type: 'NOTIFICATION',
        payload: {
          granted: false,
          error:
            error?.message ||
            error ||
            'An error occurred while requesting notification permission.',
        },
      });
      return false;
    }
  }, []);

  const getIsLocationEnabled = useCallback(async () => {
    try {
      const settingEnabled = await checkIsLocationEnabled();
      dispatch({
        type: 'GPS',
        payload: {
          granted: settingEnabled,
          error: settingEnabled ? '' : 'GPS setting need to be enable.',
        },
      });
      return settingEnabled;
    } catch (error) {
      const message = {
        ERR00: 'GPS setting need to be enable.',
        ERR01: 'GPS setting need to be enable. Please enable the GPS setting.',
        ERR02: 'GPS setting need to be enable. Please enable the GPS setting.',
        ERR03: 'GPS setting need to be enable. Please enable the GPS setting.',
      };
      dispatch({
        type: 'GPS',
        payload: {
          granted: false,
          error:
            message[error?.message] ||
            error?.message ||
            error ||
            'An error occurred while requesting to enable GPS setting.',
        },
      });
      return false;
    }
  }, []);

  const startRequestingPermission = useCallback(async () => {
    try {
      resetPermissions();
      toggleIsRequesting(true);
      const locationEnabled = await getIsLocationEnabled();
      const locationGranted = await getLocationPermission();
      const bgGranted = await getBackgroundLocationPermission();
      const notificationGranted = await getNotificationPermission();
      toggleIsRequesting(false);
      return (
        locationEnabled && locationGranted && bgGranted && notificationGranted
      );
    } catch (error) {
      // Todo: Log error to a logging service
      setRequestError(
        error?.message ||
          error ||
          'An error occurred while requesting permissions.',
      );
      toggleIsRequesting(false);
      return false;
    }
  }, [getIsLocationEnabled, getNotificationPermission]);

  const hasMissingPermissions = useMemo(() => {
    if (state.notification.error) {
      return 'notification';
    } else if (state.location.error) {
      return 'location';
    } else if (state.background.error) {
      return 'background_location';
    } else if (state.gps.error) {
      return 'gps';
    } else {
      return '';
    }
  }, [
    state.notification.error,
    state.location.error,
    state.background.error,
    state.gps.error,
  ]);

  const value = useMemo(() => {
    return {
      state: state,
      startRequestingPermission,
      isRequesting,
      requestError,
      hasMissingPermissions,
      getNotificationPermission,
      showPermissionModal,
      setShowPermissionModal,
    };
  }, [
    state,
    startRequestingPermission,
    isRequesting,
    requestError,
    hasMissingPermissions,
    getNotificationPermission,
    showPermissionModal,
    setShowPermissionModal,
  ]);

  return (
    <PermissionContext.Provider value={value}>
      {children}
      {showPermissionModal ? <PermissionModal /> : <></>}
    </PermissionContext.Provider>
  );
};
