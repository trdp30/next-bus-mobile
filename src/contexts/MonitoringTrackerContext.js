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
      // skipPollingIfUnfocused: true,
      skip: !selectedVehicles.length,
    },
  );

  const monitoringTrackerLocations = useMemo(() => {
    if (!selectedVehicles?.length) {
      return [];
    }
    const monitoringTrackers = groupBy(data, 'vehicle');
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
  }, [data, selectedVehicles]);

  // console.log('monitoringTrackers', monitoringTrackerLocations.length);
  // console.log(
  //   'monitoringTrackers data',
  //   data,
  //   parseDateTime(data?.[0]?.createdAt)?.toFormat('D, tt'),
  // );
  // console.log(
  //   'monitoringTrackers selectedVehicles',
  //   selectedVehicles.map(vehicle => vehicle._id),
  // );

  useEffect(() => {
    if (isError) {
      catchError(error);
    }
  }, [isError, error]);

  const value = useMemo(
    () => ({
      selectedVehicles,
      setSelectedVehicles,
      monitoringTrackerLocations,
    }),
    [selectedVehicles, monitoringTrackerLocations],
  );
  return (
    <MonitoringTrackerContext.Provider value={value}>
      {children}
    </MonitoringTrackerContext.Provider>
  );
};

export default MonitoringTrackerProvider;
