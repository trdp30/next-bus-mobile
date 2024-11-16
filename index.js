/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);

const backgroundTask = async taskData => {
  return new Promise((resolve, reject) => {
    console.log('taskData', taskData);
    setInterval(() => {
      console.log('task', new Date().toLocaleTimeString());
      resolve();
    }, 5000);
  });
};

AppRegistry.registerHeadlessTask('BackgroundTask', () =>
  backgroundTask.bind(this),
);
