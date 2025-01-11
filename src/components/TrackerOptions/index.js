import {MonitoringTrackerContext} from '@/src/contexts/MonitoringTrackerContext';
import {TrackerContext} from '@/src/contexts/TrackerContext';
import {useGetVehiclesQuery} from '@/src/store/services/vehicleApi';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {filter, find, findIndex, uniq} from 'lodash';
import React, {useContext, useMemo} from 'react';
import {Box} from '../ui/box';
import {Button, ButtonText} from '../ui/button';
import {Text} from '../ui/text';
import VehicleListItem from './VehicleListItem';

const TrackerOptions = () => {
  const {handleUpdateTrackerToInactive, currentTracker} =
    useContext(TrackerContext);
  const {selectedVehicles, setSelectedVehicles, monitoringTrackers} =
    useContext(MonitoringTrackerContext);
  const {data: vehicles} = useGetVehiclesQuery();

  const handleSelectVehicle = vehicleId => {
    setSelectedVehicles(prev => {
      const index = findIndex(prev, v => v._id === vehicleId);
      if (index === -1) {
        const value = prev.concat(find(vehicles, ['_id', vehicleId]));
        return uniq(value);
      } else {
        const value = prev.filter(v => v._id !== vehicleId);
        return uniq(value);
      }
    });
  };

  const filteredVehicles = useMemo(() => {
    return filter(vehicles, vehicle => {
      return currentTracker?.vehicle?._id !== vehicle._id;
    });
  }, [vehicles, currentTracker]);

  return (
    <Box className="mb-8">
      <Text className="text-center text-lg font-bold">Tracker Options</Text>
      <BottomSheetScrollView>
        <Box className="px-4 py-5">
          <Text className="font-bold">
            Select vehicles that you want to monitor:
          </Text>
          <Box className="gap-y-4 py-4">
            {filteredVehicles?.map(vehicle => (
              <VehicleListItem
                key={vehicle?._id}
                vehicle={vehicle}
                handleSelectVehicle={handleSelectVehicle}
                selectedVehicles={selectedVehicles}
                monitoringTrackers={monitoringTrackers}
              />
            ))}
          </Box>
          <Box className="">
            <Button onPress={handleUpdateTrackerToInactive}>
              <ButtonText className="py-2">End My Trip</ButtonText>
            </Button>
          </Box>
        </Box>
      </BottomSheetScrollView>
    </Box>
  );
};

export default TrackerOptions;
