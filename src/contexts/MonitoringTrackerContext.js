import {first, groupBy, map} from 'lodash';
import React, {createContext, useEffect, useMemo} from 'react';
import Config from 'react-native-config';
import {useSubscribeTrackersQuery} from '../store/services/trackerApi';
import {catchError} from '../utils/catchError';
import {getIsoGetStartOfDay} from '../utils/dateHelpers';

export const MonitoringTrackerContext = createContext();

const MonitoringTrackerProvider = ({children}) => {
  const [selectedVehicles, setSelectedVehicles] = React.useState([]);
  const {data, error, isError} = useSubscribeTrackersQuery(
    {
      date: getIsoGetStartOfDay(),
      vehicleIds: map(selectedVehicles, v => v?._id),
    },
    {
      pollingInterval: Config.POLLING_INTERVAL,
      skipPollingIfUnfocused: true,
      skip: !selectedVehicles.length,
    },
  );

  const monitoringTrackers = useMemo(() => {
    if (selectedVehicles.length === 0) {
      return {};
    }
    const groupedData = groupBy(data, 'vehicle');
    return groupedData;
  }, [data, selectedVehicles]);

  const monitoringTrackerLocations = useMemo(() => {
    const records = [];
    Object.keys(monitoringTrackers).map(vehicleId => {
      const trackers = monitoringTrackers[vehicleId];
      const tracker = first(trackers);
      records.push({
        _id: tracker?._id,
        location: first(tracker.trackerLogs)?.location,
        vehicle: selectedVehicles.find(vehicle => vehicle._id === vehicleId),
      });
    });
    return records;
  }, [monitoringTrackers, selectedVehicles]);

  useEffect(() => {
    if (isError) {
      catchError(error);
    }
  }, [isError, error]);

  const value = useMemo(
    () => ({
      monitoringTrackers,
      selectedVehicles,
      setSelectedVehicles,
      monitoringTrackerLocations,
    }),
    [monitoringTrackers, selectedVehicles, monitoringTrackerLocations],
  );
  return (
    <MonitoringTrackerContext.Provider value={value}>
      {children}
    </MonitoringTrackerContext.Provider>
  );
};

export default MonitoringTrackerProvider;
