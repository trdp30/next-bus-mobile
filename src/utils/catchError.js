import * as Sentry from '@sentry/react-native';
import {Alert} from 'react-native';
import DeviceInfo from 'react-native-device-info';

export const catchError = props => {
  let er = '';
  if (props?.error?.status) {
    er = `Status Code: ${String(props?.error?.status)}.\n${
      props?.error?.error
    }\nRequest Url: ${props?.meta?.request?.url}`;
    Alert.alert('Opps, Something went wrong', er);
  } else if (props?.message) {
    er = props.message;
    Alert.alert('Opps, Something went wrong', props.message);
  } else if (props?.error && typeof props.error === 'string') {
    er = props.error;
    Alert.alert('Opps, Something went wrong', props.error);
  } else {
    er = props;
    Alert.alert('Opps, Something went wrong', props);
  }
  Sentry.captureException(props);
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
