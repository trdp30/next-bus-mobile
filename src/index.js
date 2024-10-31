import React from 'react';
import Navigation from './navigations';
import {NativeBaseProvider} from 'native-base';
import AuthProvider from './contexts/AuthContext';

function Root() {
  return (
    <AuthProvider>
      <NativeBaseProvider>
        <Navigation />
      </NativeBaseProvider>
    </AuthProvider>
  );
}

export default Root;
