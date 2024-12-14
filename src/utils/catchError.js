import {Alert} from 'react-native';

export const catchError = props => {
  if (props?.error?.status) {
    Alert.alert(
      'Opps, Something went wrong',
      `Status Code: ${String(props?.error?.status)}.\n${
        props?.error?.error
      }\nRequest Url: ${props?.meta?.request?.url}`,
    );
  } else if (props?.message) {
    return Alert.alert('Opps, Something went wrong', props.message);
  } else {
    return Alert.alert('Opps, Something went wrong', props);
  }
};

export const sentrySetUser = user => {
  // Sentry.setUser({
  //   id: (user?.user_id && Number(user?.user_id)),
  //   tenant_id: user?.tenant_id && Number(user?.tenant_id),
  // });
};
