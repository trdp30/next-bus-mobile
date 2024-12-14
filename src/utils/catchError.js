import {Alert} from 'react-native';

export const catchError = props => {
  const err = typeof props === 'object' ? JSON.stringify(err) : String(props);
  if (props?.error?.status) {
    Alert.alert(
      'Opps, Somwthing went wrong',
      `Status Code: ${String(props?.error?.status)}.\n${
        props?.error?.error
      }\nRequest Url: ${props?.meta?.request?.url}`,
    );
  } else {
    return Alert.alert(
      'Error',
      Object.keys(props.error.error)
        .map(key => `${key}: ${props[key]}`)
        .join('\n'),
    );
  }
};

export const sentrySetUser = user => {
  // Sentry.setUser({
  //   id: (user?.user_id && Number(user?.user_id)),
  //   tenant_id: user?.tenant_id && Number(user?.tenant_id),
  // });
};
