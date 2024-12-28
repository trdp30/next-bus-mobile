/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import * as Sentry from '@sentry/react-native';
import React from 'react';
import './global.css';
import Root from './src/Root';

Sentry.init({
  dsn: 'https://bdbce58178d45d25b68afecefb025ce8@o4508543590072320.ingest.us.sentry.io/4508543601475584',
  enabled: __DEV__ ? false : true,

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // enableSpotlight: __DEV__,
});

function App(): React.JSX.Element {
  return <Root />;
}

export default App;
