import {NativeModules} from 'react-native';

const {BackgroundTaskModule} = NativeModules;

export const startBackgroundService = async () => {
  try {
    console.log('startBackgroundService', BackgroundTaskModule);
    BackgroundTaskModule.startBackgroundTask('bar');
  } catch (e) {
    console.error(e);
  }
};

export const stopBackgroundService = async () => {
  // BackgroundTaskModule.stopBackgroundTask();
};
