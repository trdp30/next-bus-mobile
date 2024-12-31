import notifee, {EventType} from '@notifee/react-native';
import * as Sentry from '@sentry/react-native';
import Config from 'react-native-config';
import {detectAndPostCurrentLocation} from './backgroundTask';

let shouldRunForegroundService = true;
let unsubscribeForegroundEventListener;

const triggerUnsubscribeForegroundEventListener = () => {
  if (
    unsubscribeForegroundEventListener &&
    typeof unsubscribeForegroundEventListener === 'function'
  ) {
    unsubscribeForegroundEventListener();
  }
};

// TODO: Check if battery optimization is enabled
async function checkBatteryOptimization() {
  const isBatteryOptimizationEnabled =
    await notifee.isBatteryOptimizationEnabled();
  if (isBatteryOptimizationEnabled) {
    // Redirect to settings to disable battery optimization
    await notifee.openBatteryOptimizationSettings();
  }
}

export const initiateForegroundService = async () => {
  notifee.registerForegroundService(notification => {
    return new Promise(async () => {
      try {
        triggerUnsubscribeForegroundEventListener();
        unsubscribeForegroundEventListener = notifee.onForegroundEvent(
          async ({type, detail}) => {
            switch (type) {
              case EventType.DISMISSED:
                // Todo: Handle the notification dismissal
                console.log('User dismissed notification', detail.notification);
                break;
              case EventType.PRESS:
                // Todo: Handle the notification press
                console.log('User pressed notification', detail.notification);
                break;
              case EventType.APP_BLOCKED:
                Sentry.captureMessage(
                  'User toggled app notification permission: ' +
                    String(detail.blocked),
                );
                // Todo: Handle the app block
                // if (setShowPermissionModal) {
                //   setShowPermissionModal(true);
                // }
                break;
              case EventType.CHANNEL_BLOCKED:
                Sentry.captureMessage(
                  `User toggled app notification channel block. Channel Id: ${
                    detail.channel.id
                  }, value: ${String(detail.blocked)}`,
                );
                break;
              case EventType.CHANNEL_GROUP_BLOCKED:
                Sentry.captureMessage(
                  `User toggled app notification channel group block. Channel Group Id: ${
                    detail.channel.id
                  }, value: ${String(detail.blocked)}`,
                );
                break;
              case EventType.ACTION_PRESS:
                console.log('User pressed action', detail.pressAction);
                break;
              default:
                break;
            }
          },
        );

        let interval;
        let retryCount = 0;
        const loop = async () => {
          try {
            if (shouldRunForegroundService) {
              await detectAndPostCurrentLocation();
              retryCount = 0;
              interval = setTimeout(loop, Config.POLLING_INTERVAL);
            } else {
              clearTimeout(interval);
              unsubscribeForegroundEventListener();
              await notifee.stopForegroundService();
            }
          } catch (error) {
            if (retryCount < 3) {
              retryCount++;
              // Todo: Handle The error
              Sentry.captureMessage(
                'Error in Foreground service Loop. Retrying...',
              );
              Sentry.captureException(error);
              interval = setTimeout(loop, 15000);
            } else {
              // Todo: Let user know that the app is not working as expected
              console.log('Error in Foreground service Loop:', error);
              stopForegroundService();
              Sentry.captureException(error);
            }
          }
        };
        loop();
      } catch (error) {
        console.log('Error in Foreground service:', error);
        // Todo: Let user know that the app is not working as expected
        stopForegroundService();
        Sentry.captureException(error);
      }
    });
  });
};

export const starForegroundService = () => {
  shouldRunForegroundService = true;
};

export const stopForegroundService = async () => {
  shouldRunForegroundService = false;
  return notifee.stopForegroundService();
};
