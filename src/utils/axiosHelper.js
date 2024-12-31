import {firebase} from '@react-native-firebase/auth';
import * as Sentry from '@sentry/react-native';
import axios from 'axios';
import {endpoint} from '../store/services/baseQuery';

const axiosInstance = axios.create({
  baseURL: endpoint,
  headers: {'Content-Type': 'application/json'},
});

// Define your PUT request function
export async function makePutRequest(url, data) {
  try {
    const user = firebase.auth()?.currentUser;
    const token = user ? await user?.getIdToken() : null;
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
    const response = await axiosInstance.put(url, data);
    return response.data;
  } catch (error) {
    /*
      Todo: Handle the error, if possible have the error message to the user and ask to take some action
    */
    Sentry.captureException(error);
  }
}
