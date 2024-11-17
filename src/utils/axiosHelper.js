import {firebase} from '@react-native-firebase/auth';
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
    axiosInstance.defaults.headers.common.Authorization = token;
    console.log('request making');
    const response = await axiosInstance.put(url, data);
    console.log('request made', response);
    return response.data;
  } catch (error) {
    // Handle errors
    if (error.response) {
      console.error('Error Response:', error.response.data);
    } else if (error.request) {
      console.error('Error Request:', error.request);
    } else {
      console.error('Error Message:', error.message);
    }
    throw error;
  }
}
