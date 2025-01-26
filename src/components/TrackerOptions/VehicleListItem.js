import {catchError} from '@/src/utils/catchError';
import classNames from 'classnames';
import {find, get} from 'lodash';
import React, {useMemo} from 'react';
import {Linking} from 'react-native';
import {Box} from '../ui/box';
import {Button, ButtonIcon, ButtonText} from '../ui/button';
import {PhoneIcon} from '../ui/icon';
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
    return !!find(selectedVehicles, ['_id', tracker?.vehicle]);
  }, [selectedVehicles, tracker?.vehicle]);

  const vehicle = useMemo(() => {
    return find(vehicles, ['_id', tracker?.vehicle]);
  }, [vehicles, tracker?.vehicle]);

  const status = useMemo(() => {
    if (tracker?._id) {
      return tracker?.active ? 'Running' : 'Stopped';
    }
    return 'Not Started';
  }, [tracker?.active, tracker?._id]);

  const handleCallClick = async () => {
    try {
      const phone = vehicle?.phone;
      const url = `tel:${phone}`;
      await Linking.openURL(url);
    } catch (error) {
      catchError(error);
    }
  };

  if (!vehicle?._id) {
    return <></>;
  }

  return (
    <Box
      key={tracker?._id}
      className="flex-row items-center px-4 justify-between">
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
      <Box className="flex-row items-center gap-x-4">
        {String(vehicle?.phone)?.length > 0 && (
          <Button
            size="lg"
            className="rounded-full p-3.5"
            onPress={handleCallClick}>
            <ButtonIcon as={PhoneIcon} />
          </Button>
        )}
        <Button
          onPress={() => handleSelectVehicle(vehicle?._id)}
          className="ml-auto">
          <ButtonText>{isSelected ? 'Untrack' : 'Track'}</ButtonText>
        </Button>
      </Box>
    </Box>
  );
};

export default VehicleListItem;
