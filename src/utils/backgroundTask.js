import * as Sentry from '@sentry/react-native';
import {makePutRequest} from './axiosHelper';
import {mergeTrackerDataToBeStored} from './commonHelpers';
import {stopForegroundService} from './foregroundService';
import {formatLocation, getCurrentPosition} from './locationHelpers';
import {
  localStorageGetItem,
  localStorageSetItem,
  TRACKER_DETAILS,
} from './storageHelper';

export const detectAndPostCurrentLocation = async () => {
  try {
    const storedCurrentTrackerDetails = await localStorageGetItem(
      TRACKER_DETAILS,
    );
    if (storedCurrentTrackerDetails) {
      const currentTracker = JSON.parse(storedCurrentTrackerDetails);
      console.log('currentTracker:', currentTracker);
      if (currentTracker?._id && currentTracker?.active) {
        const currentLocation = await getCurrentPosition();
        const formattedLocation = formatLocation(currentLocation);
        const response = await makePutRequest(
          `/tracker/log/${currentTracker._id}`,
          {
            location: formattedLocation,
          },
        );
        await localStorageSetItem(
          TRACKER_DETAILS,
          mergeTrackerDataToBeStored({response, tracker: currentTracker}),
        );
        if (!response?.active) {
          return stopForegroundService();
        }
      } else {
        return stopForegroundService();
      }
    } else {
      return stopForegroundService();
    }
  } catch (error) {
    console.error('Error in detectAndPostCurrentLocation:', error);
    Sentry.captureException(error);
  }
};
