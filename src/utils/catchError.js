import * as Sentry from '@sentry/react-native';
import {Alert} from 'react-native';

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
  } else {
    er = props;
    Alert.alert('Opps, Something went wrong', props);
  }
  Sentry.captureMessage(er);
};

export const sentrySetUser = user => {
  Sentry.setUser({
    id: user?._id,
  });
};
