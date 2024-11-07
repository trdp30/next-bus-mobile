import {GluestackUIProvider} from '@/src/components/ui/gluestack-ui-provider';
import React from 'react';
import '../global.css';
import Navigation from './navigation';

import {ApolloProvider} from '@apollo/client';
import {Provider} from 'react-redux';
import {ApplicationProvider} from './contexts/ApplicationContext';
import AuthProvider from './contexts/AuthContext';
import {LocationProvider} from './contexts/LocationContext';
import {store} from './store';
import client from './utils/apollo';

function Root() {
  return (
    <LocationProvider>
      <Provider store={store}>
        <ApolloProvider client={client}>
          <AuthProvider>
            <ApplicationProvider>
              <GluestackUIProvider mode="light">
                <Navigation />
              </GluestackUIProvider>
            </ApplicationProvider>
          </AuthProvider>
        </ApolloProvider>
      </Provider>
    </LocationProvider>
  );
}

export default Root;
