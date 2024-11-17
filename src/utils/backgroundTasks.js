import {Alert, NativeModules} from 'react-native';
import Config from 'react-native-config';
import {store} from '../store';
import {makePutRequest} from './axiosHelper';
import {catchError} from './catchError';
import {formatLocation, getCurrentPosition} from './locationHelper';

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
    const trigger = () => {
      try {
        const tracker = store?.getState()?.session?.tracker;
        if (tracker?._id) {
          getCurrentPosition({
            onSuccess: position => {
              const location = formatLocation(position);
              console.log('Location: ', location);
              if (!location) {
                return;
              }
              makePutRequest('/tracker', {
                id: tracker._id,
                location: location,
              });
            },
            onError: error => {
              Alert.alert('Error', JSON.stringify(error));
            },
          });
        } else {
          clearInterval(timer);
          resolve();
        }
      } catch (error) {
        catchError(error);
      }
    };
    timer = setInterval(() => {
      trigger();
      if (!timer) {
        resolve();
      }
    }, Config.POLLING_INTERVAL);
    trigger();
  });
};
