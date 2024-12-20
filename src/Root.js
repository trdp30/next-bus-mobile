import {GluestackUIProvider} from '@/src/components/ui/gluestack-ui-provider';
import React from 'react';
import {StatusBar} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Provider} from 'react-redux';
import AuthProvider from './contexts/AuthContext';
import {PermissionProvider} from './contexts/PermissionContext';
import TrackerProvider from './contexts/TrackerContext';
import BottomTabNavigation from './Navigation/BottomTabNavigation';
import {store} from './store';

function Root() {
  // const isDarkMode = useColorScheme() === 'dark';
  const isDarkMode = false;

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <GluestackUIProvider mode={isDarkMode ? 'dark' : 'light'}>
      <Provider store={store}>
        <PermissionProvider>
          <AuthProvider>
            <TrackerProvider>
              <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={backgroundStyle.backgroundColor}
              />
              <BottomTabNavigation />
            </TrackerProvider>
          </AuthProvider>
        </PermissionProvider>
      </Provider>
    </GluestackUIProvider>
  );
}

export default Root;
