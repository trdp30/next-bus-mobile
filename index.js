/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {initiateForegroundService} from './src/utils/foregroundService';

initiateForegroundService();
AppRegistry.registerComponent(appName, () => App);
