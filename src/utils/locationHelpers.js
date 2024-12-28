import Geolocation from '@react-native-community/geolocation';
import {getDistance} from 'geolib';
import Config from 'react-native-config';

Geolocation.setRNConfiguration({
  skipPermissionRequests: false,
  authorizationLevel: 'always',
  enableBackgroundLocationUpdates: true,
});

export const getCurrentPosition = async () => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => resolve(position),
      error => reject(error),
      {
        enableHighAccuracy: true,
        maximumAge: 0,
      },
    );
  });
};

export const formatLocation = location => {
  if (location) {
    if (location?.coords) {
      const {latitude, longitude, ...rest} = location.coords;
      if (latitude && longitude) {
        return {
          latitude: latitude,
          longitude: longitude,
          ...rest,
        };
      } else {
        return null;
      }
    } else if (location?.latitude && location?.longitude) {
      const {latitude, longitude, ...rest} = location;
      return {
        latitude: latitude,
        longitude: longitude,
        ...rest,
      };
    }
  }
  return null;
};

// Write a function which will return true when the current location is within the given radius of the target location

export const isWithinRadius = async targetLocation => {
  const currentLocation = await getCurrentPosition();
  const radius = Config.IN_CIRCLE_RADIUS;
  if (!currentLocation || !targetLocation || !radius) {
    return false;
  }
  const {latitude: currentLatitude, longitude: currentLongitude} =
    formatLocation(currentLocation);
  const {latitude: targetLatitude, longitude: targetLongitude} = targetLocation;

  if (
    !currentLatitude ||
    !currentLongitude ||
    !targetLatitude ||
    !targetLongitude
  ) {
    return false;
  }

  const distance = getDistance(
    {latitude: currentLatitude, longitude: currentLongitude},
    {latitude: targetLatitude, longitude: targetLongitude},
  );
  return distance <= radius;
};

let intervalId;

export const startProximityCheck = targetLocation => {
  return new Promise((resolve, reject) => {
    const checkProximity = async () => {
      try {
        console.log('Checking proximity');
        if (targetLocation) {
          const isNearby = await isWithinRadius(targetLocation);
          if (isNearby) {
            clearInterval(intervalId);
            resolve(isNearby);
          }
        } else {
          reject(new Error('Target location is not provided'));
        }
      } catch (error) {
        clearInterval(intervalId);
        reject(error);
      }
    };

    // intervalId = setInterval(checkProximity, Config.POLLING_INTERVAL); // Check every 5 seconds
    intervalId = setInterval(checkProximity, 3000); // Check every 5 seconds
  });
};

export const stopProximityCheck = () => {
  if (intervalId) {
    clearInterval(intervalId);
  }
};
