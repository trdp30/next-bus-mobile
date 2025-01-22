/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import * as Sentry from '@sentry/react-native';
import React from 'react';
import Config from 'react-native-config';
import './global.css';
import Root from './src/Root';

Sentry.init({
  dsn: 'https://bdbce58178d45d25b68afecefb025ce8@o4508543590072320.ingest.us.sentry.io/4508543601475584',
  enabled: true,
  enableNative: true,
  release: Config.VERSION,
  attachScreenshot: true,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  integrations: [Sentry.mobileReplayIntegration()],
});

function App(): React.JSX.Element {
  return (
    <Sentry.ErrorBoundary>
      <Root />
    </Sentry.ErrorBoundary>
  );
}

export default App;
