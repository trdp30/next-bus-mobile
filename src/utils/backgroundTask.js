import {NativeModules} from 'react-native';
import {makePutRequest} from './axiosHelper';

const {JSToNativeExecutionModule} = NativeModules;

let timer = false;

export const startBackgroundService = async () => {
  try {
    JSToNativeExecutionModule.startBackgroundTask('bar');
  } catch (e) {
    console.error(e);
  }
};

export const stopBackgroundService = async () => {
  console.log('Background Task Stopped', new Date().toLocaleDateString());
  clearInterval(timer);
  timer = null;
};

export const payload = {
  id: '67413e761618be800b7ef5da',
  location: {
    accuracy: 5,
    altitude: 0,
    heading: 0,
    latitude: 26.632906666666667,
    longitude: 93.60332333333334,
    speed: 0,
  },
};

export const backgroundTask = async taskData => {
  console.log('Background Task Started', new Date().toLocaleDateString());
  return new Promise((resolve, reject) => {
    const trigger = async () => {
      console.log('Background Task Triggered', new Date().toLocaleDateString());
      await makePutRequest(`tracker/log/${payload.id}`, {
        location: payload.location,
      });
      console.log('request completed, waiting for next trigger');
    };
    timer = setInterval(() => {
      trigger();
      if (!timer) {
        resolve();
      }
    }, 10000);
    trigger();
  });
};
