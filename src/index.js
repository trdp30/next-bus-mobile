import React from 'react';
import Navigation from './navigations';
import {NativeBaseProvider} from 'native-base';

function Root() {
  return (
    <NativeBaseProvider>
      <Navigation />
    </NativeBaseProvider>
  );
}

export default Root;
