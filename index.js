/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {initiateForegroundService} from './src/utils/foregroundService';
import {
  initiateBackgroundService,
  unsubscribeBackgroundEventListener,
} from './src/utils/notificationHelpers';

if (
  unsubscribeBackgroundEventListener &&
  typeof unsubscribeBackgroundEventListener === 'function'
) {
  unsubscribeBackgroundEventListener();
}

initiateBackgroundService();
initiateForegroundService();
AppRegistry.registerComponent(appName, () => App);
