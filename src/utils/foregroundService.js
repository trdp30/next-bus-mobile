import notifee from '@notifee/react-native';

let shouldRunForegroundService = true;

export const initiateForegroundService = async () => {
  console.log('Initiating Foreground service...');
  notifee.registerForegroundService(notification => {
    return new Promise(async () => {
      console.log('Foreground service started...', new Date().getTime());
      const interval = setInterval(async () => {
        if (shouldRunForegroundService) {
          console.log('Foreground service running...', new Date().getTime());
        } else {
          // @a stop foreground service
          clearInterval(interval);
          await notifee.stopForegroundService();
        }
      }, 3000);
    });
  });
};

export const starForegroundService = () => {
  console.log('Start of Foreground initiated');
  shouldRunForegroundService = true;
};

export const stopForegroundService = async () => {
  console.log('Stopping Foreground service...');
  shouldRunForegroundService = false;
  return notifee.stopForegroundService();
};
