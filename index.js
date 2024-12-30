/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {initiateForegroundService} from './src/utils/foregroundService';
import {initiateBackgroundService} from './src/utils/notificationHelpers';

initiateBackgroundService();
initiateForegroundService();
AppRegistry.registerComponent(appName, () => App);
