import {GluestackUIProvider} from '@/src/components/ui/gluestack-ui-provider';
import React from 'react';
import '../global.css';

import {ApolloProvider} from '@apollo/client';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import {ApplicationProvider} from './contexts/ApplicationContext';
import AuthProvider from './contexts/AuthContext';
import {LocationProvider} from './contexts/LocationContext';
import {BottomTabNavigator} from './navigation/BottomTabNavigation';
import {store} from './store';
import client from './utils/apollo';

function Root() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <LocationProvider>
          <ApolloProvider client={client}>
            <AuthProvider>
              <ApplicationProvider>
                <GluestackUIProvider mode="light">
                  <BottomTabNavigator />
                </GluestackUIProvider>
              </ApplicationProvider>
            </AuthProvider>
          </ApolloProvider>
        </LocationProvider>
      </Provider>
    </SafeAreaProvider>
  );
}

export default Root;
