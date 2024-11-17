import React, {
  createContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {AppState} from 'react-native';
import {useSelector} from 'react-redux';
import {selectTracker} from '../store/selectors/session.selector';
import {startBackgroundService} from '../utils/backgroundTasks';

const ApplicationContext = createContext({
  tracker: null,
});

const ApplicationProvider = ({children}) => {
  const tracker = useSelector(selectTracker);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // stopBackgroundService();
        startBackgroundService();
      } else {
        startBackgroundService();
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  console.log('AppState', appState.current);

  const value = useMemo(() => {
    return {
      tracker,
      appStateVisible,
    };
  }, [tracker, appStateVisible]);

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  );
};

export {ApplicationContext, ApplicationProvider};
