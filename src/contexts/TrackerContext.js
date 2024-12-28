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
import {useGetPlacesQuery} from '../store/services/placeApi';
import {
  useCreateTrackerMutation,
  useLazyFindTrackerQuery,
  useUpdateTrackerMutation,
} from '../store/services/trackerApi';
import ApplicationContext from './ApplicationContext';
import {AuthContext} from './AuthContext';
import {NotificationContext} from './NotificationContext';
import {PermissionContext} from './PermissionContext';

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
  const {
    isRequesting,
    hasMissingPermissions,
    startRequestingPermission,
    setShowPermissionModal,
  } = useContext(PermissionContext);
  const {user} = useContext(AuthContext);
  const [isLoading, toggleLoading] = useState(true);
  const [createTracker, createTrackerRequest] = useCreateTrackerMutation();
  const [updateTracker] = useUpdateTrackerMutation();
  const [lazyFindTracker, lazyFindTrackerResult] = useLazyFindTrackerQuery();
  const {data: placeData} = useGetPlacesQuery(); //TODO: Need to only those place that are need to the tracker
  const {displayNotification, clearNotifications, clearNotificationsByChannel} =
    useContext(NotificationContext);

  const vehicleIds = useMemo(() => {
    const data = lazyFindTrackerResult?.data;
    if (Array.isArray(data) && data.length) {
      const ids = data.map(tracker => tracker?.vehicle);
      return uniq([...ids]);
    }
    return [];
  }, [lazyFindTrackerResult?.data]);

  const {data: vehicles} = useGetVehiclesQuery(
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
        const findData = find(data, tracker => {
          return (
            tracker?.date &&
            parseDateTime(tracker?.date) &&
            +getStartOfDay() === +parseDateTime(tracker?.date) &&
            tracker?.driver === user?._id &&
            tracker?.active
          );
        });
        return findData?._id
          ? {
              ...findData,
              vehicle: find(vehicles, v => v._id === findData?.vehicle),
              started_from: find(
                placeData,
                p => p._id === findData?.started_from,
              ),
              destination: find(
                placeData,
                p => p._id === findData?.destination,
              ),
            }
          : null;
      }
    }
  }, [
    placeData,
    vehicles,
    createTrackerRequest.data,
    user?.roles,
    lazyFindTrackerResult?.data,
    user?._id,
  ]);

  const handleFetchTrackerForCurrentUser = useCallback(async () => {
    return lazyFindTracker({
      driver: user?._id,
      date: getIsoGetStartOfDay(),
      // active: true,
    });
  }, [lazyFindTracker, user]);

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

  const startCheckingProximity = useCallback(
    async targetLocation => {
      try {
        const result = await startProximityCheck(targetLocation);
        if (result) {
          handleUpdateTrackerToInactive();
        }
        // where the result is true we have to make the tracker inactive
      } catch (error) {
        setShowPermissionModal(true);
      }
    },
    [handleUpdateTrackerToInactive, setShowPermissionModal],
  );

  const toggleTrackerNotification = useCallback(
    show => {
      if (show) {
        clearNotifications('tracker-active').then(() => {
          clearNotificationsByChannel('tracker').then(() => {
            displayNotification({
              title: 'Trip Activated',
              body: 'The tracker is now active',
              channelId: 'tracker',
              notificationId: 'tracker-active',
            });
          });
        });
      } else {
        clearNotifications('tracker-active').then(() => {
          clearNotificationsByChannel('tracker');
        });
      }
    },
    [clearNotifications, clearNotificationsByChannel, displayNotification],
  );

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

  useEffect(() => {
    if (
      currentTracker?.active &&
      currentTracker?.destination?.location?.latitude &&
      !isRequesting &&
      !hasMissingPermissions
    ) {
      setShowPermissionModal(false);
      startCheckingProximity(currentTracker?.destination?.location);
      toggleTrackerNotification(true);
    }
    return () => stopProximityCheck();
  }, [
    currentTracker,
    startRequestingPermission,
    startCheckingProximity,
    hasMissingPermissions,
    isRequesting,
    toggleTrackerNotification,
    setShowPermissionModal,
  ]);

  useEffect(() => {
    if (currentTracker?._id && !currentTracker?.active) {
      // Todo need to clear the channel as well
      toggleTrackerNotification(false);
      stopProximityCheck();
    }
    if (!currentTracker?._id) {
      toggleTrackerNotification(false);
    }
  }, [currentTracker, toggleTrackerNotification]);

  const allTrackersForToday = useMemo(() => {
    if (lazyFindTrackerResult?.data?.length) {
      return reverse(
        sortBy(
          map(lazyFindTrackerResult?.data, tracker => {
            return {
              ...tracker,
              vehicle: find(vehicles, v => v._id === tracker?.vehicle),
              started_from: find(
                placeData,
                p => p._id === tracker?.started_from,
              ),
              destination: find(placeData, p => p._id === tracker?.destination),
              sortOrder: +parseDateTime(tracker?.createdAt),
            };
          }),
          'sortOrder',
        ),
      );
    }
    return [];
  }, [lazyFindTrackerResult?.data, vehicles, placeData]);

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
