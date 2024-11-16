import {NativeModules} from 'react-native';
import {store} from '../store';
import {startLocationChangeWatcher} from '../store/slices/session';

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
    timer = setInterval(() => {
      const isLocationChangeWatcherActive =
        store?.getState()?.session?.isLocationChangeWatcherActive;
      if (!isLocationChangeWatcherActive) {
        store.dispatch(startLocationChangeWatcher());
      }
      if (!timer) {
        resolve();
      }
    }, 600000);
  });
};
