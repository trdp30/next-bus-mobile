import React from 'react';
import {Box} from '../ui/box';
import {Button, ButtonText} from '../ui/button';
import {Text} from '../ui/text';

const VehicleListItem = ({vehicle, handleSelectVehicle, selectedVehicles}) => {
  return (
    <Box key={vehicle._id} className="flex-row items-center px-4">
      <Text>{vehicle.name}</Text>
      <Button
        onPress={() => handleSelectVehicle(vehicle._id)}
        className="ml-auto">
        <ButtonText>
          {selectedVehicles.find(v => v._id === vehicle._id)
            ? 'Untrack'
            : 'Track'}
        </ButtonText>
      </Button>
    </Box>
  );
};

export default VehicleListItem;
