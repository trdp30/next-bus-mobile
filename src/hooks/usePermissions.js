import {useState, useEffect} from 'react';
import {Platform} from 'react-native';
import {PERMISSIONS, requestMultiple, RESULTS} from 'react-native-permissions';
import Snackbar from 'react-native-snackbar';

const usePermissions = () => {
  const [arePermissionsApproved, setArePermissionsApproved] = useState(false);

  useEffect(() => {
    const check = async () => {
      setArePermissionsApproved(() => false);
      const toRequestPermissions =
        Platform.OS === 'android'
          ? [
              PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
              PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
              PERMISSIONS.ANDROID.ACCESS_MEDIA_LOCATION,
              PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
            ]
          : [PERMISSIONS.IOS.LOCATION_ALWAYS];

      try {
        const permissionStatuses = await requestMultiple(toRequestPermissions);
        const result = permissionStatuses[toRequestPermissions[0]];

        if (result === RESULTS.GRANTED) {
          setArePermissionsApproved(() => true);
        } else {
          Snackbar.show({
            text: 'Location permissions are needed to proceed with the app. Please re-open and accept.',
            duration: Snackbar.LENGTH_SHORT,
          });
        }
      } catch (error) {
        console.error('Error requesting permissions', error);
      }
    };

    check();
  }, []);

  return {arePermissionsApproved};
};

export default usePermissions;
