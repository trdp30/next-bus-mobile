import notifee, {EventType} from '@notifee/react-native';
import * as Sentry from '@sentry/react-native';

export let unsubscribeBackgroundEventListener;

export const initiateBackgroundService = () => {
  unsubscribeBackgroundEventListener = notifee.onBackgroundEvent(
    async ({type, detail}) => {
      console.group('Background Event');
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
      console.groupEnd();
    },
  );
};
