import {catchError} from '@/src/utils/catchError';
import {getIsoGetStartOfDay} from '@/src/utils/dateHelpers';
import {roles} from '@/src/utils/roles';
import {find, first} from 'lodash';
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
import {mergeTrackerDataToBeStored} from '../utils/commonHelpers';
import {
  starForegroundService,
  stopForegroundService,
} from '../utils/foregroundService';
import {
  localStorageSetItem,
  removeLocalStorageItem,
  TRACKER_DETAILS,
} from '../utils/storageHelper';
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
  const {startRequestingPermission} = useContext(PermissionContext);
  const {user} = useContext(AuthContext);
  const [isLoading, toggleLoading] = useState(true);
  const [createTracker, createTrackerRequest] = useCreateTrackerMutation();
  const [updateTracker, updateTrackerResult] = useUpdateTrackerMutation();
  const [lazyFindTracker, lazyFindTrackerResult] = useLazyFindTrackerQuery();
  const {displayNotification, clearNotifications, clearNotificationsByChannel} =
    useContext(NotificationContext);

  const currentTracker = useMemo(() => {
    let data = lazyFindTrackerResult?.data || [];
    if (
      user?._id &&
      user?.roles?.length &&
      user?.roles.includes(roles.driver)
    ) {
      if (Array.isArray(data) && data?.length) {
        const findData = find(data, ['active', true]);
        return findData?._id ? findData : null;
      }
    }
    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lazyFindTrackerResult.isFetching]);

  const handleFetchTrackerForCurrentUser = useCallback(async () => {
    await lazyFindTracker({
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

  const handleUpdateTrackerToInactive = useCallback(
    async tracker => {
      return updateTracker({
        id: tracker?._id || currentTracker?._id,
        active: false,
      });
    },
    [updateTracker, currentTracker],
  );

  // const startCheckingProximity = useCallback(
  //   async targetLocation => {
  //     try {
  //       const result = await startProximityCheck(targetLocation);
  //       if (result) {
  //         handleUpdateTrackerToInactive();
  //       }
  //       // where the result is true we have to make the tracker inactive
  //     } catch (error) {
  //       console.log('Error in startCheckingProximity:', error);
  //       setShowPermissionModal(true);
  //     }
  //   },
  //   [handleUpdateTrackerToInactive, setShowPermissionModal],
  // );

  const toggleTrackerNotification = useCallback(
    show => {
      if (show) {
        startRequestingPermission()
          .then(() => clearNotifications('tracker-active'))
          .then(() => clearNotificationsByChannel('tracker'))
          .then(() => {
            starForegroundService();
            displayNotification({
              title: 'Trip Activated',
              body: 'The tracker is now active',
              channelId: 'tracker',
              notificationId: 'tracker-active',
              asForegroundService: true,
            });
          });
      } else {
        clearNotifications('tracker-active')
          .then(() => clearNotificationsByChannel('tracker'))
          .then(() => stopForegroundService());
      }
    },
    [
      clearNotifications,
      clearNotificationsByChannel,
      displayNotification,
      startRequestingPermission,
    ],
  );

  const handleStartReverseTrip = useCallback(
    lastActiveTracker => {
      if (createTrackerRequest.isLoading) {
        return;
      }
      const startFrom =
        lastActiveTracker?.destination?._id || lastActiveTracker?.destination;
      const destination =
        lastActiveTracker?.started_from?._id || lastActiveTracker?.started_from;
      const vehicle =
        lastActiveTracker?.vehicle?._id || lastActiveTracker?.vehicle;
      handleCreateTracker({
        driver: user?._id,
        vehicle: vehicle,
        started_from: startFrom,
        trackerLogs: [],
        destination: destination,
        active: true,
        isPrivate: lastActiveTracker?.isPrivate,
      });
    },
    [handleCreateTracker, user, createTrackerRequest?.isLoading],
  );

  useEffect(() => {
    if (createTrackerRequest.isError) {
      catchError(createTrackerRequest.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createTrackerRequest.isError]);

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
    // useEffect to show the notification when the tracker is active
    if (currentTracker?.active) {
      toggleTrackerNotification(true);
    } else {
      toggleTrackerNotification(false);
      // stopProximityCheck();
      removeLocalStorageItem(TRACKER_DETAILS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTracker?.active]);

  useEffect(() => {
    // useEffect to store the tracker details in the local storage
    if (currentTracker?.active) {
      localStorageSetItem(
        TRACKER_DETAILS,
        mergeTrackerDataToBeStored({
          response: currentTracker,
          tracker: currentTracker,
        }),
      );
    } else {
      removeLocalStorageItem(TRACKER_DETAILS);
    }
  }, [currentTracker]);

  useEffect(() => {
    if (updateTrackerResult.isError) {
      catchError(updateTrackerResult.error);
    }
  }, [updateTrackerResult]);

  const value = useMemo(() => {
    return {
      handleFetchTrackerForCurrentUser,
      handleCreateTracker,
      createTrackerRequest,
      handleFetchTrackerByPayload,
      currentTracker,
      fetchingExistingTracker: isLoading,
      isTrackerActive: currentTracker?._id && currentTracker?.active,
      tripType: currentTracker?.isPrivate ? 'private' : 'public',
      handleUpdateTrackerToInactive,
      allTrackersForToday: lazyFindTrackerResult?.data || [],
      handleStartReverseTrip: handleStartReverseTrip,
      lastActiveTracker: first(lazyFindTrackerResult?.data || []),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    handleFetchTrackerForCurrentUser,
    handleCreateTracker,
    createTrackerRequest,
    handleFetchTrackerByPayload,
    currentTracker,
    isLoading,
    handleUpdateTrackerToInactive,
    handleStartReverseTrip,
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
