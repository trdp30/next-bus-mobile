import React, {
  createContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {AppState, Platform} from 'react-native';
import SpInAppUpdates, {IAUUpdateKind} from 'sp-react-native-in-app-updates';

const ApplicationContext = createContext();

export const ApplicationProvider = ({children}) => {
  const [showActiveTracker, setShowActiveTracker] = useState(false);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState('inactive'); //| 'active' | 'background' | 'inactive' | 'unknown' | 'extension';

  // const getInitialNotification = useCallback(async () => {
  //   try {
  //     const initialNotification = await notifee.getInitialNotification();

  //     console.log('initialNotification', initialNotification);

  //     if (initialNotification) {
  //       console.log(
  //         'Notification caused application to open',
  //         initialNotification.notification,
  //       );
  //       console.log(
  //         'Press action used to open the app',
  //         initialNotification.pressAction,
  //       );
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }, []);

  // useEffect(() => {
  //   getInitialNotification();
  // }, [getInitialNotification]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const inAppUpdates = new SpInAppUpdates();
    inAppUpdates.checkNeedsUpdate().then(result => {
      if (result.shouldUpdate) {
        let updateOptions = {};
        if (Platform.OS === 'android') {
          updateOptions = {
            updateType: IAUUpdateKind.IMMEDIATE,
          };
        }
        inAppUpdates.startUpdate(updateOptions);
      }
    });
  }, []);

  const value = useMemo(() => {
    return {showActiveTracker, setShowActiveTracker, appStateVisible};
  }, [showActiveTracker, setShowActiveTracker, appStateVisible]);

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  );
};

export default ApplicationContext;
