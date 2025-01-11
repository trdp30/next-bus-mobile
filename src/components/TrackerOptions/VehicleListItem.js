import classNames from 'classnames';
import {first, get} from 'lodash';
import React, {useMemo} from 'react';
import {Box} from '../ui/box';
import {Button, ButtonText} from '../ui/button';
import {Text} from '../ui/text';

const trackerStatus = {
  running: {
    color: 'text-green-500',
  },
  stopped: {
    color: 'text-red-500',
  },
  notStarted: {
    color: 'text-gray-500',
  },
};

const VehicleListItem = ({
  vehicle,
  handleSelectVehicle,
  selectedVehicles,
  monitoringTrackers,
}) => {
  const isSelected = useMemo(() => {
    return selectedVehicles?.find(v => v._id === vehicle._id);
  }, [selectedVehicles, vehicle]);

  const vehicleTracker = useMemo(() => {
    const tracker = get(monitoringTrackers, vehicle._id);
    return first(tracker);
  }, [vehicle, monitoringTrackers]);

  const status = useMemo(() => {
    if (vehicleTracker?._id) {
      return vehicleTracker.active ? 'running' : 'stopped';
    }
    return 'notStarted';
  }, [vehicleTracker]);

  return (
    <Box key={vehicle._id} className="flex-row items-center px-4">
      <Box>
        <Text className="font-bold">{vehicle.name}</Text>
        <Text>{vehicle.registration_number}</Text>
        {isSelected && (
          <>
            {vehicleTracker?._id ? (
              <Text
                className={classNames(
                  get(trackerStatus, status)?.color,
                  'font-bold text-sm',
                )}>
                {vehicleTracker?.active ? 'Running' : 'Stopped'}
              </Text>
            ) : (
              <Text
                className={classNames(
                  get(trackerStatus, status),
                  'font-bold text-sm',
                )}>
                Not started yet
              </Text>
            )}
          </>
        )}
      </Box>
      <Button
        onPress={() => handleSelectVehicle(vehicle._id)}
        className="ml-auto">
        <ButtonText>{isSelected ? 'Untrack' : 'Track'}</ButtonText>
      </Button>
    </Box>
  );
};

export default VehicleListItem;
