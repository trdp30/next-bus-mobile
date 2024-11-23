/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {backgroundTask} from './src/utils/backgroundTask';

AppRegistry.registerComponent(appName, () => App);

AppRegistry.registerHeadlessTask('BackgroundTask', () => backgroundTask);
