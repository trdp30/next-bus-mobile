import React, {createContext, useEffect, useMemo, useState} from 'react';
import {Platform} from 'react-native';
import SpInAppUpdates, {IAUUpdateKind} from 'sp-react-native-in-app-updates';

const ApplicationContext = createContext();

export const ApplicationProvider = ({children}) => {
  const [showActiveTracker, setShowActiveTracker] = useState(false);

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
    return {showActiveTracker, setShowActiveTracker};
  }, [showActiveTracker, setShowActiveTracker]);

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  );
};

export default ApplicationContext;
