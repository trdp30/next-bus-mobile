import notifee, {EventType} from '@notifee/react-native';
import * as Sentry from '@sentry/react-native';

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

export const initiateForegroundService = async () => {
  console.log('Initiating Foreground service...');
  notifee.registerForegroundService(notification => {
    return new Promise(async () => {
      triggerUnsubscribeForegroundEventListener();
      unsubscribeForegroundEventListener = notifee.onForegroundEvent(
        async ({type, detail}) => {
          switch (type) {
            case EventType.DISMISSED:
              console.log('User dismissed notification', detail.notification);
              break;
            case EventType.PRESS:
              console.log('User pressed notification', detail.notification);
              break;
            case EventType.APP_BLOCKED:
              Sentry.captureMessage(
                'User toggled app notification permission: ' +
                  String(detail.blocked),
              );
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

      console.log('Foreground service started...', new Date().getTime());
      const interval = setInterval(async () => {
        if (shouldRunForegroundService) {
          console.log('Foreground service running...', new Date().getTime());
        } else {
          clearInterval(interval);
          unsubscribeForegroundEventListener();
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
