import React, {useCallback, useContext, useMemo} from 'react';
import {
  useCreateTrackerMutation,
  useFindTrackerQuery,
  useLazyFindTrackerQuery,
  useUpdateTrackerLogMutation,
} from '../store/services/trackerApi';
import {AuthContext} from './AuthContext';
import {getIsoGetStartOfDay} from '@/src/utils/dateHelpers';

export const TrackerContext = React.createContext();

/*
  TrackerProvider is a context provider that wraps the whole application.
  It provides the following functionalities:
  - Have to check for the current login user any tracker is already created or not for the current date.
  - If the tracker is already created then collect the tracker id which will be required to post data of tracker log.
  - If the tracker is not created then create a new tracker by collecting the vehicle details and
    if use select "public trip" then have to collect the start and destination location as well.
  - The tracker context will also need to render a bottom layer that will be used to show the current location of the user.
*/

const TrackerProvider = ({children}) => {
  const {user} = useContext(AuthContext);
  const [createTracker, createTrackerRequest] = useCreateTrackerMutation();
  // const [] = useFindTrackerQuery();
  // const [] = useUpdateTrackerLogMutation();
  const [lazyFindTracker] = useLazyFindTrackerQuery();

  const handleFetchTracker = useCallback(async payload => {}, []);

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
      });
    },
    [createTracker, user],
  );

  const handleFetchSelectedTracker = useCallback(async () => {}, []);

  const handleFetchAllTrackers = useCallback(async () => {}, []);

  const value = useMemo(() => {
    return {
      handleFetchTracker,
      handleCreateTracker,
      handleFetchSelectedTracker,
      handleFetchAllTrackers,
      createTrackerRequest,
      handleFetchTrackerByPayload,
    };
  }, [
    handleFetchTracker,
    handleCreateTracker,
    handleFetchSelectedTracker,
    handleFetchAllTrackers,
    createTrackerRequest,
    handleFetchTrackerByPayload,
  ]);

  return (
    <TrackerContext.Provider value={value}>{children}</TrackerContext.Provider>
  );
};

export default TrackerProvider;
