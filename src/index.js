import React from 'react';
import Navigation from './navigation';
import {NativeBaseProvider} from 'native-base';
import AuthProvider from './contexts/AuthContext';
import {ApolloProvider} from '@apollo/client';
import client from './utils/apollo';
import {Provider} from 'react-redux';
import {store} from './store';

function Root() {
  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <AuthProvider>
          <NativeBaseProvider>
            <Navigation />
          </NativeBaseProvider>
        </AuthProvider>
      </ApolloProvider>
    </Provider>
  );
}

export default Root;
