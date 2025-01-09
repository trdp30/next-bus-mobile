import {TrackerContext} from '@/src/contexts/TrackerContext';
import {useGetVehiclesQuery} from '@/src/store/services/vehicleApi';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {find, findIndex} from 'lodash';
import React, {useContext} from 'react';
import {Box} from '../ui/box';
import {Button, ButtonText} from '../ui/button';
import {Text} from '../ui/text';
import VehicleListItem from './VehicleListItem';

const TrackerOptions = () => {
  const {handleUpdateTrackerToInactive} = useContext(TrackerContext);
  const {data: vehicles} = useGetVehiclesQuery();
  const [selectedVehicles, setSelectedVehicles] = React.useState([]);

  const handleSelectVehicle = vehicleId => {
    setSelectedVehicles(prev => {
      const index = findIndex(prev, v => v._id === vehicleId);
      if (index === -1) {
        return prev.concat(find(vehicles, ['_id', vehicleId]));
      } else {
        return prev.filter(v => v._id !== vehicleId);
      }
    });
  };

  return (
    <Box className="mb-8">
      <Text className="text-center text-lg font-bold">Tracker Options</Text>
      <BottomSheetScrollView>
        <Box className="px-4 py-5">
          <Text className="font-bold">
            Select vehicles that you want to monitor:
          </Text>
          <Box className="gap-y-4 py-4">
            {vehicles?.map(vehicle => (
              <VehicleListItem
                key={vehicle?._id}
                vehicle={vehicle}
                handleSelectVehicle={handleSelectVehicle}
                selectedVehicles={selectedVehicles}
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
