import Geolocation from '@react-native-community/geolocation';

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
