import * as Sentry from '@sentry/react-native';
import {Alert} from 'react-native';
import DeviceInfo from 'react-native-device-info';

export const catchError = (error, skipToast) => {
  let er = '';
  if (error?.data?.message) {
    er = error.data.message;
  } else if (error?.error?.status) {
    er = `Status Code: ${String(error?.error?.status)}.\n${
      error?.error?.error
    }\nRequest Url: ${error?.meta?.request?.url}`;
  } else if (error?.message) {
    er = error.message;
  } else if (error?.error && typeof error.error === 'string') {
    er = error.error;
  } else {
    er = error;
  }
  if (!skipToast) {
    Alert.alert('Opps, Something went wrong', er);
  }
  Sentry.captureException(error);
  Sentry.captureException(er);
};

export const sentrySetUser = async user => {
  const deviceId = await DeviceInfo.getDeviceId();
  const deviceName = await DeviceInfo.getDeviceName();
  const apiLevel = await DeviceInfo.getApiLevel();

  Sentry.getGlobalScope().setExtras({
    deviceId,
    deviceName,
    apiLevel,
  });

  Sentry.setUser({
    id: user?._id,
    email: user?.email,
    username: user?.email,
  });
};
