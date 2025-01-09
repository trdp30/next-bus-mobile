import {GluestackUIProvider} from '@/src/components/ui/gluestack-ui-provider';
import {ApplicationProvider} from '@/src/contexts/ApplicationContext';
import React from 'react';
import {StatusBar} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Provider} from 'react-redux';
import AuthProvider from './contexts/AuthContext';
import {NotificationProvider} from './contexts/NotificationContext';
import {PermissionProvider} from './contexts/PermissionContext';
import BottomTabNavigation from './Navigation/BottomTabNavigation';
import {store} from './store';

function Root() {
  // const isDarkMode = useColorScheme() === 'dark';
  const isDarkMode = false;

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <GestureHandlerRootView>
      <ApplicationProvider>
        <GluestackUIProvider mode={isDarkMode ? 'dark' : 'light'}>
          <Provider store={store}>
            <PermissionProvider>
              <AuthProvider>
                <NotificationProvider>
                  <StatusBar
                    barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                    backgroundColor={backgroundStyle.backgroundColor}
                  />
                  <BottomTabNavigation />
                </NotificationProvider>
              </AuthProvider>
            </PermissionProvider>
          </Provider>
        </GluestackUIProvider>
      </ApplicationProvider>
    </GestureHandlerRootView>
  );
}

export default Root;
