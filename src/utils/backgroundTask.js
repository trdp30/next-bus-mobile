// const {BackgroundTaskModule} = NativeModules;

let timer = false;

export const startBackgroundService = async () => {
  try {
    // BackgroundTaskModule.startBackgroundTask('bar');
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
