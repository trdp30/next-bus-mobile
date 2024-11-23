import {NativeModules} from 'react-native';

const {JSToNativeExecutionModule} = NativeModules;

let timer = false;

export const startBackgroundService = async () => {
  try {
    debugger;
    JSToNativeExecutionModule.startBackgroundTask('bar');
  } catch (e) {
    debugger;
    console.error(e);
  }
};

export const stopBackgroundService = async () => {
  // BackgroundTaskModule.stopBackgroundTask();
  clearInterval(timer);
};

export const backgroundTask = async taskData => {
  console.log('Background Task Started', new Date().toLocaleDateString());
  return new Promise((resolve, reject) => {
    const trigger = () => {
      console.log('Background Task Triggered', new Date().toLocaleDateString());
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
