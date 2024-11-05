import React from 'react';
import Navigation from './navigation';
import {NativeBaseProvider} from 'native-base';
import AuthProvider from './contexts/AuthContext';
import {ApolloProvider} from '@apollo/client';
import client from './utils/apollo';
import {Provider} from 'react-redux';
import {store} from './store';
import {LocationProvider} from './contexts/LocationContext';

function Root() {
  return (
    <LocationProvider>
      <Provider store={store}>
        <ApolloProvider client={client}>
          <AuthProvider>
            <NativeBaseProvider>
              <Navigation />
            </NativeBaseProvider>
          </AuthProvider>
        </ApolloProvider>
      </Provider>
    </LocationProvider>
  );
}

export default Root;
