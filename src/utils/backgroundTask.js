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
      if (currentTracker?._id && currentTracker?.active) {
        const currentLocation = await getCurrentPosition();
        console.log('bg task running.., collected location');
        const formattedLocation = formatLocation(currentLocation);
        const response = await makePutRequest(
          `/tracker/log/${currentTracker._id}`,
          {
            location: formattedLocation,
          },
        );
        console.log('bg task running.., api request made');
        await localStorageSetItem(
          TRACKER_DETAILS,
          mergeTrackerDataToBeStored({response, tracker: currentTracker}),
        );
        console.log('bg task running.., localStore updated');
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
