import classNames from 'classnames';
import {find, get} from 'lodash';
import React, {useMemo} from 'react';
import {Box} from '../ui/box';
import {Button, ButtonText} from '../ui/button';
import {Text} from '../ui/text';

const trackerStatus = {
  Running: {
    color: 'text-green-500',
  },
  Stopped: {
    color: 'text-red-500',
  },
  'Not Started': {
    color: 'text-gray-500',
  },
};

const VehicleListItem = ({
  tracker,
  handleSelectVehicle,
  selectedVehicles,
  vehicles,
}) => {
  const isSelected = useMemo(() => {
    return !!find(selectedVehicles, ['_id', tracker.vehicle]);
  }, [selectedVehicles, tracker?.vehicle]);

  const vehicle = useMemo(() => {
    return find(vehicles, ['_id', tracker.vehicle]);
  }, [vehicles, tracker?.vehicle]);

  const status = useMemo(() => {
    if (tracker?._id) {
      return tracker.active ? 'Running' : 'Stopped';
    }
    return 'Not Started';
  }, [tracker.active, tracker?._id]);

  return (
    <Box key={tracker._id} className="flex-row items-center px-4">
      <Box>
        <Text className="font-bold">{vehicle?.name}</Text>
        <Text>{vehicle?.registration_number}</Text>
        <Text
          className={classNames(
            get(trackerStatus, status)?.color,
            'font-bold text-sm',
          )}>
          {status}
        </Text>
      </Box>
      <Button
        onPress={() => handleSelectVehicle(vehicle?._id)}
        className="ml-auto">
        <ButtonText>{isSelected ? 'Untrack' : 'Track'}</ButtonText>
      </Button>
    </Box>
  );
};

export default VehicleListItem;
