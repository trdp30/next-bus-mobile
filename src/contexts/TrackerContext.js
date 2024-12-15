import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  useCreateTrackerMutation,
  useLazyFindTrackerQuery,
  useUpdateTrackerMutation,
} from '../store/services/trackerApi';
import {AuthContext} from './AuthContext';
import {getIsoGetStartOfDay} from '@/src/utils/dateHelpers';
import {roles} from '@/src/utils/roles';
import {catchError} from '@/src/utils/catchError';
import {
  startProximityCheck,
  stopProximityCheck,
} from '@/src/utils/locationHelpers';

export const TrackerContext = React.createContext();

/*
  TrackerProvider is a context provider that wraps the whole application.
  It provides the following functionalities:
  - Have to check for the current login user any tracker is already created or not for the current date.
  - If the tracker is already created then collect the tracker id which will be required to post data of tracker log.
  - If the tracker is not created then create a new tracker by collecting the vehicle details and
    if use select "public trip" then have to collect the start and destination location as well.
  - The tracker context will also need to render a bottom layer that will be used to show the current location of the user.
  - While creating tracker have to validate the user have not select the same location in start and destination.
  - Have to check is the currentTracker is active or not.
  - To make a tracker active/inactive we have to monitor the user location and destination location. If the current location of user comes within 100 meters of the destination location then we have to make the tracker inactive.
*/

const TrackerProvider = ({children}) => {
  const {user, currentRole} = useContext(AuthContext);
  const [isLoading, toggleLoading] = useState(true);
  const [currentTracker, setCurrentTracker] = useState();
  const [createTracker, createTrackerRequest] = useCreateTrackerMutation();
  const [updateTracker, updateTrackerRequest] = useUpdateTrackerMutation();
  // const [] = useFindTrackerQuery();
  // const [] = useUpdateTrackerLogMutation();
  const [lazyFindTracker] = useLazyFindTrackerQuery();
  // console.log('isLoading', isLoading);
  // console.log('currentTracker', currentTracker);

  const handleFetchTrackerForCurrentUser = useCallback(
    async payload => {
      return lazyFindTracker({
        driver: user?._id,
        date: getIsoGetStartOfDay(),
      });
    },
    [lazyFindTracker, user],
  );

  const handleFetchTrackerByPayload = useCallback(
    async payload => {
      lazyFindTracker({
        driver: payload?.driver || user?._id,
        vehicle: payload?.vehicle,
        started_from: payload?.started_from,
        destination: payload?.destination,
        date: getIsoGetStartOfDay(),
      });
    },
    [lazyFindTracker, user],
  );

  const handleCreateTracker = useCallback(
    async payload => {
      return createTracker({
        driver: payload?.driver || user?._id,
        vehicle: payload?.vehicle,
        date: getIsoGetStartOfDay(),
        started_from: payload?.started_from,
        trackerLogs: [],
        destination: payload?.destination,
        active: true,
      });
    },
    [createTracker, user],
  );

  const handleFetchSelectedTracker = useCallback(async () => {}, []);

  const handleFetchAllTrackers = useCallback(async () => {}, []);

  const handleUpdateTrackerToInactive = useCallback(async () => {
    return updateTracker({
      id: currentTracker?._id,
      active: false,
    });
  }, [updateTracker, currentTracker]);

  const handleUpdateTrackerToActive = useCallback(async () => {
    return updateTracker({
      id: currentTracker?._id,
      active: true,
    });
  }, [updateTracker, currentTracker]);

  useEffect(() => {
    if (currentRole === roles.driver && user?._id) {
      toggleLoading(true);
      handleFetchTrackerForCurrentUser()
        .then(res => {
          if (res?.data?.length) {
            setCurrentTracker(res?.data[0]);
          }
          toggleLoading(false);
        })
        .catch(error => {
          toggleLoading(false);
          catchError(error);
        });
    }
  }, [handleFetchTrackerForCurrentUser, currentRole, user]);

  const startCheckingProximity = useCallback(
    async targetLocation => {
      try {
        const result = await startProximityCheck(targetLocation);
        if (result) {
          handleUpdateTrackerToInactive();
        }
        // where the result is true we have to make the tracker inactive
      } catch (error) {
        console.error('Error checking proximity:', error);
      }
    },
    [handleUpdateTrackerToInactive],
  );

  useEffect(() => {
    if (currentTracker?.destination?.location?.latitude) {
      startCheckingProximity(currentTracker?.destination?.location);
    }
    return () => stopProximityCheck();
  }, [currentTracker, startCheckingProximity]);

  const value = useMemo(() => {
    return {
      handleFetchTrackerForCurrentUser,
      handleCreateTracker,
      handleFetchSelectedTracker,
      handleFetchAllTrackers,
      createTrackerRequest,
      handleFetchTrackerByPayload,
      currentTracker,
      fetchingExistingTracker: isLoading,
    };
  }, [
    handleFetchTrackerForCurrentUser,
    handleCreateTracker,
    handleFetchSelectedTracker,
    handleFetchAllTrackers,
    createTrackerRequest,
    handleFetchTrackerByPayload,
    currentTracker,
    isLoading,
  ]);

  return (
    <TrackerContext.Provider value={value}>{children}</TrackerContext.Provider>
  );
};

export default TrackerProvider;
