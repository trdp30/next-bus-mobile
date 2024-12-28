import notifee, {EventType} from '@notifee/react-native';
import * as Sentry from '@sentry/react-native';
import {startCase} from 'lodash';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import {getCurrentDateTime} from '../utils/dateHelpers';
import {AuthContext} from './AuthContext';
import {PermissionContext} from './PermissionContext';

export const NotificationContext = createContext();

export const NotificationProvider = ({children}) => {
  const {isAuthenticated} = useContext(AuthContext);
  const {getNotificationPermission, setShowPermissionModal} =
    useContext(PermissionContext);

  const initialize = useCallback(async () => {
    return await getNotificationPermission();
  }, [getNotificationPermission]);

  useEffect(() => {
    let unsubscribe;
    if (isAuthenticated) {
      // Request permissions on mount
      initialize().then(() => {
        // Listen to notification events
        unsubscribe = notifee.onForegroundEvent(({type, detail}) => {
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
              setShowPermissionModal(true);
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
          }
        });
      });
    }

    return () => unsubscribe && unsubscribe();
  }, [initialize, isAuthenticated, setShowPermissionModal]);

  // Clear all notifications or by channel id
  const clearNotifications = useCallback(async notificationId => {
    // if channel id is not passed, clear all notifications
    try {
      if (!notificationId) {
        await notifee.cancelAllNotifications();
      } else {
        await notifee.cancelNotification(notificationId);
      }
    } catch (error) {
      Sentry.captureException(error);
    }
  }, []);

  const clearNotificationsByChannel = useCallback(async channelId => {
    try {
      await notifee.deleteChannel('channelId');
    } catch (error) {
      Sentry.captureException(error);
    }
  }, []);

  const displayNotification = useCallback(
    async ({title, body, channelId, notificationId, asForegroundService}) => {
      try {
        // Create a channel (required for Android)
        const newChannel = await notifee.createChannel({
          id: channelId || 'default',
          name: startCase(`${channelId} Channel`),
        });
        if (notificationId) {
          clearNotifications(notificationId);
        }

        const notification = await notifee.displayNotification({
          id: notificationId || String(+getCurrentDateTime()),
          title,
          body,
          android: {
            channelId: newChannel,
            asForegroundService: asForegroundService,
          },
        });

        return notification;
      } catch (error) {
        Sentry.captureException(error);
      }
    },
    [clearNotifications],
  );

  const value = useMemo(
    () => ({
      displayNotification,
      clearNotifications,
      clearNotificationsByChannel,
    }),
    [displayNotification, clearNotifications, clearNotificationsByChannel],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
