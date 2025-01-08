import {createContext, useMemo} from 'react';
import Config from 'react-native-config';
import {useGetTrackersQuery} from '../store/services/trackerApi';
import {getIsoGetStartOfDay} from '../utils/dateHelpers';

const MonitoringTrackerContext = createContext();

const MonitoringTrackerProvider = ({children}) => {
  const {data} = useGetTrackersQuery(
    {date: getIsoGetStartOfDay()},
    {
      pollingInterval: Config.POLLING_INTERVAL,
      skipPollingIfUnfocused: true,
    },
  );
  const value = useMemo(
    () => ({
      monitoringTrackers: data,
    }),
    [data],
  );
  return (
    <MonitoringTrackerContext.Provider value={value}>
      {children}
    </MonitoringTrackerContext.Provider>
  );
};
