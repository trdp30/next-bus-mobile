import * as Sentry from '@sentry/react-native';
import {makeGetRequest, makePutRequest} from './axiosHelper';
import {mergeTrackerDataToBeStored} from './commonHelpers';
import {stopForegroundService} from './foregroundService';
import {
  checkProximityWithLoop,
  formatLocation,
  getCurrentPosition,
} from './locationHelpers';
import {
  localStorageGetItem,
  localStorageSetItem,
  TRACKER_DETAILS,
} from './storageHelper';

let destination = null;

export const detectAndPostCurrentLocation = async () => {
  try {
    const storedCurrentTrackerDetails = await localStorageGetItem(
      TRACKER_DETAILS,
    );
    if (storedCurrentTrackerDetails) {
      const currentTracker = JSON.parse(storedCurrentTrackerDetails);
      console.log('bg task running..');
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
        if (!destination) {
          destination = await makeGetRequest(
            `/place/${currentTracker?.destination}`,
          );
        }
        const result = await checkProximityWithLoop(destination?.location);
        if (result && currentTracker?._id) {
          await makePutRequest(`/tracker/${currentTracker?._id}`, {
            active: false,
          });
          destination = null;
          return stopForegroundService();
        }
        if (!response?.active) {
          destination = null;
          return stopForegroundService();
        }
      } else {
        destination = null;
        return stopForegroundService();
      }
    } else {
      destination = null;
      return stopForegroundService();
    }
  } catch (error) {
    destination = null;
    console.error('Error in detectAndPostCurrentLocation:', error);
    Sentry.captureException(error);
  }
};
