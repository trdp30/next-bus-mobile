import {NativeModules} from 'react-native';

const {BackgroundTaskModule} = NativeModules;

let timer = false;

export const startBackgroundService = async () => {
  try {
    BackgroundTaskModule.startBackgroundTask('bar');
  } catch (e) {
    console.error(e);
  }
};

export const stopBackgroundService = async () => {
  // BackgroundTaskModule.stopBackgroundTask();
  clearInterval(timer);
};

export const backgroundTask = async taskData => {
  return new Promise((resolve, reject) => {
    console.log('taskData', taskData);
    timer = setInterval(() => {
      console.log('task', new Date().toLocaleTimeString());
      if (!timer) {
        resolve();
      }
    }, 5000);
  });
};
