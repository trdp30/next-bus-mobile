import {firebase} from '@react-native-firebase/auth';
import {fetchBaseQuery} from '@reduxjs/toolkit/query';
import Config from 'react-native-config';

export async function prepareHeaders(headers, api) {
  const user = firebase.auth()?.currentUser;
  if (user) {
    const token = await user?.getIdToken();
    headers.set('authorization', 'Bearer ' + token);
  }
  return headers;
}

export const restApiBaseQuery = fetchBaseQuery({
  baseUrl: `${Config.REST_API_ROOT}/${Config.REST_API_VERSION}`,
  prepareHeaders,
});

export const baseQuery = async (args, api, extraOptions) => {
  let response;

  if (extraOptions && extraOptions.baseQuery) {
    response = await extraOptions.baseQuery(args, api, extraOptions);
  } else {
    response = await restApiBaseQuery(args, api, extraOptions);
  }

  if (response && response.error && response.error.status === 401) {
    // Todo: Trigger logout and redirect to login screen
  }
  return response;
};

export default baseQuery;
