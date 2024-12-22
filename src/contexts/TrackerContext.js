import {useGetVehiclesQuery} from '@/src/store/services/vehicleApi';
import {catchError} from '@/src/utils/catchError';
import {
  getIsoGetStartOfDay,
  getStartOfDay,
  parseDateTime,
} from '@/src/utils/dateHelpers';
import {
  startProximityCheck,
  stopProximityCheck,
} from '@/src/utils/locationHelpers';
import {roles} from '@/src/utils/roles';
import {find, map, reverse, sortBy, uniq} from 'lodash';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import ActiveTrackerFloatingCard from '../components/ActiveTrackerFloatingCard';
import {
  useCreateTrackerMutation,
  useLazyFindTrackerQuery,
  useUpdateTrackerMutation,
} from '../store/services/trackerApi';
import ApplicationContext from './ApplicationContext';
import {AuthContext} from './AuthContext';

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
  const {showActiveTracker} = useContext(ApplicationContext);
  const {user} = useContext(AuthContext);
  const [isLoading, toggleLoading] = useState(true);
  const [createTracker, createTrackerRequest] = useCreateTrackerMutation();
  const [updateTracker, updateTrackerRequest] = useUpdateTrackerMutation();
  const [lazyFindTracker, lazyFindTrackerResult] = useLazyFindTrackerQuery();

  const vehicleIds = useMemo(() => {
    const data = lazyFindTrackerResult?.data;
    if (Array.isArray(data) && data.length) {
      const ids = data.map(tracker => tracker?.vehicle);
      return uniq([...ids]);
    }
    return [];
  }, [lazyFindTrackerResult?.data]);

  const {data: vehicles, isLoading: vehicleRequestLoading} =
    useGetVehiclesQuery(
      {
        vehicleIds,
      },
      {
        skip: !vehicleIds?.length,
      },
    );

  const currentTracker = useMemo(() => {
    const data =
      (lazyFindTrackerResult?.data?.length && lazyFindTrackerResult?.data) ||
      (createTrackerRequest.data?.length && createTrackerRequest.data) ||
      (createTrackerRequest?.data?.existingTracker?.length &&
        createTrackerRequest?.data?.existingTracker) ||
      [];
    if (
      user?._id &&
      user?.roles?.length &&
      user?.roles.includes(roles.driver)
    ) {
      if (Array.isArray(data) && data?.length) {
        return find(data, tracker => {
          return (
            tracker?.date &&
            parseDateTime(tracker?.date) &&
            +getStartOfDay() === +parseDateTime(tracker?.date) &&
            tracker?.driver === user?._id &&
            tracker?.active
          );
        });
      }
    }
  }, [
    createTrackerRequest.data,
    user?.roles,
    lazyFindTrackerResult?.data,
    user?._id,
  ]);

  const currentTrackerVehicle = useMemo(() => {
    if (vehicles && Array.isArray(vehicles)) {
      return vehicles?.find(v => v._id === currentTracker?.vehicle);
    }
    return null;
  }, [vehicles, currentTracker]);

  const handleFetchTrackerForCurrentUser = useCallback(
    async payload => {
      return lazyFindTracker({
        driver: user?._id,
        date: getIsoGetStartOfDay(),
        // active: true,
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
        isPrivate: payload?.isPrivate,
      });
    },
    [createTracker, user],
  );

  const handleFetchSelectedTracker = useCallback(async () => {}, []);

  const handleFetchAllTrackers = useCallback(async () => {}, []);

  const handleUpdateTrackerToInactive = useCallback(
    async tracker => {
      return updateTracker({
        id: tracker?._id || currentTracker?._id,
        active: false,
      });
    },
    [updateTracker, currentTracker],
  );

  const handleUpdateTrackerToActive = useCallback(async () => {
    return updateTracker({
      id: currentTracker?._id,
      active: true,
    });
  }, [updateTracker, currentTracker]);

  useEffect(() => {
    if (
      user?._id &&
      user?.roles?.length &&
      user?.roles.includes(roles.driver)
    ) {
      toggleLoading(true);
      handleFetchTrackerForCurrentUser()
        .then(() => toggleLoading(false))
        .catch(error => {
          toggleLoading(false);
          catchError(error);
        });
    }
  }, [handleFetchTrackerForCurrentUser, user, user?.roles]);

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

  const allTrackersForToday = useMemo(() => {
    if (lazyFindTrackerResult?.data?.length) {
      return reverse(
        sortBy(
          map(lazyFindTrackerResult?.data, tracker => {
            return {
              ...tracker,
              vehicle: vehicles?.find(v => v._id === tracker?.vehicle),
              sortOrder: +parseDateTime(tracker?.createdAt),
            };
          }),
          'sortOrder',
        ),
      );
    }
    return [];
  }, [lazyFindTrackerResult?.data, vehicles]);

  const value = useMemo(() => {
    return {
      handleFetchTrackerForCurrentUser,
      handleCreateTracker,
      handleFetchSelectedTracker,
      handleFetchAllTrackers,
      createTrackerRequest,
      handleFetchTrackerByPayload,
      currentTracker,
      currentTrackerVehicle,
      fetchingExistingTracker: isLoading,
      vehicles,
      isTrackerActive: currentTracker?._id && currentTracker?.active,
      tripType: currentTracker?.isPrivate ? 'private' : 'public',
      handleUpdateTrackerToInactive,
      allTrackersForToday,
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
    vehicles,
    handleUpdateTrackerToInactive,
    currentTrackerVehicle,
    allTrackersForToday,
  ]);

  return (
    <TrackerContext.Provider value={value}>
      {children}
      {currentTracker?._id && showActiveTracker ? (
        <ActiveTrackerFloatingCard />
      ) : (
        <></>
      )}
    </TrackerContext.Provider>
  );
};

export default TrackerProvider;
