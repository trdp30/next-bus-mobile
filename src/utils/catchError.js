// import {triggerToast} from '@components/base/Notification';
// import * as Sentry from '@sentry/react';

import {Alert} from 'react-native';

export const catchError = props => {
  console.log('props', props);
  Alert.alert(
    'Error',
    `${props?.error?.error} ${props?.error?.originalStatus} ${props?.error?.originalStatus} ${props?.error?.status}`,
  );
  // console.error(`${props?.title} error: `, props?.error?.message);
  // Alert.alert(props?.title, props?.error?.message);
  if (!props.skipToast) {
    // triggerToast({
    //   message: {
    //     title: props?.title,
    //     summary: props?.error?.message,
    //   },
    //   variant: 'danger',
    // });
  }
  if (props.extraScope && props.extraScope.key && props.extraScope.value) {
    // Sentry.withScope((scope) => {
    //   if (props.extraScope) {
    //     const { key, value } = props.extraScope;
    //     if (key && value) {
    //       scope.setTag(key, value);
    //     }
    //   }
    //   Sentry.captureException(props?.error);
    // });
  } else {
    // Sentry.captureException(props?.error);
  }
};

export const sentrySetUser = user => {
  // Sentry.setUser({
  //   id: (user?.user_id && Number(user?.user_id)),
  //   tenant_id: user?.tenant_id && Number(user?.tenant_id),
  // });
};
