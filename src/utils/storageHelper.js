import AsyncStorage from '@react-native-async-storage/async-storage';
import {forEach} from 'lodash';
import {name as appName} from '../../app.json';
import {catchError} from './catchError';

export const AUTH_STORAGE_KEY = 'authentication';
export const TRACKER_DETAILS = 'tracker-details';

const allStorageKeys = [AUTH_STORAGE_KEY, TRACKER_DETAILS];

export const localStorageSetItem = (key, value) => {
  try {
    if (AsyncStorage && typeof AsyncStorage.setItem === 'function') {
      const parsedValue =
        typeof value === 'string' ? value : JSON.stringify(value);
      return AsyncStorage.setItem(`${appName}-${key}`, parsedValue);
    }
    throw Error(
      'Either AsyncStorage is undefined or AsyncStorage.setItem is not a function',
    );
  } catch (error) {
    catchError({
      title: 'AsyncStorage.setItem not found',
      error: error,
    });
  }
};

export const localStorageGetItem = key => {
  try {
    if (AsyncStorage && typeof AsyncStorage.getItem === 'function') {
      return AsyncStorage.getItem(`${appName}-${key}`);
    }
    throw Error(
      'Either AsyncStorage is undefined or AsyncStorage.getItem is not a function',
    );
  } catch (error) {
    catchError({
      title: 'AsyncStorage.getItem not found',
      error: error,
    });
    return undefined;
  }
};

export const removeLocalStorageItem = key => {
  try {
    if (AsyncStorage && typeof AsyncStorage.removeItem === 'function') {
      return AsyncStorage.removeItem(`${appName}-${key}`);
    }
    throw Error(
      'Either AsyncStorage is undefined or AsyncStorage.removeItem is not a function',
    );
  } catch (error) {
    catchError({
      title: 'AsyncStorage.removeItem not found',
      error: error,
    });
  }
};

export const clearLocalStorage = () => {
  try {
    forEach(allStorageKeys, key => {
      removeLocalStorageItem(key);
    });
  } catch (error) {
    catchError({
      title: 'localStorage.clear not found',
      error: error,
    });
  }
};
