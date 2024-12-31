import {stopForegroundService} from './foregroundService';
import {formatLocation, getCurrentPosition} from './locationHelpers';
import {localStorageGetItem, TRACKER_DETAILS} from './storageHelper';

export const detectAndPostCurrentLocation = async () => {
  try {
    const storedCurrentTrackerDetails = await localStorageGetItem(
      TRACKER_DETAILS,
    );
    if (storedCurrentTrackerDetails) {
      const currentTracker = JSON.parse(storedCurrentTrackerDetails);
      if (currentTracker?._id && currentTracker?.active) {
        // Do your background task here
        const currentLocation = await getCurrentPosition();
        console.log('Current Location:', formatLocation(currentLocation));
      } else {
        console.log('No active tracker found');
        return stopForegroundService();
      }
    }
  } catch (error) {
    console.log('Error in detectAndPostCurrentLocation:', error);
  }
};
