import React from 'react';
import Navigation from './navigations';
import {NativeBaseProvider} from 'native-base';
import AuthProvider from './contexts/AuthContext';
import {ApolloProvider} from '@apollo/client';
import client from './utils/apollo';

function Root() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <NativeBaseProvider>
          <Navigation />
        </NativeBaseProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default Root;
