import React, {createContext, useMemo, useEffect} from 'react';
import SpInAppUpdates, {IAUUpdateKind} from 'sp-react-native-in-app-updates';
import {Platform} from 'react-native';

const ApplicationContext = createContext();

export const ApplicationProvider = ({children}) => {
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
    return {};
  }, []);

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  );
};

export default ApplicationContext;
