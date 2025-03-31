import {Box} from '@/src/components/ui/box';
import {Button, ButtonText} from '@/src/components/ui/button';
import {Text} from '@/src/components/ui/text';
import {TrackerContext} from '@/src/contexts/TrackerContext';
import {useGetPlacesQuery} from '@/src/store/services/placeApi';
import {useGetVehicleIdByIdQuery} from '@/src/store/services/vehicleApi';
import {parseDateTime} from '@/src/utils/dateHelpers';
import React, {useContext, useMemo} from 'react';

export const InActiveTrackerCard = ({trk}) => {
  const {handleUpdateTrackerToInactive} = useContext(TrackerContext);
  const {data: vehicle} = useGetVehicleIdByIdQuery(trk?.vehicle);
  const {data: placeData} = useGetPlacesQuery(
    {ids: [trk?.destination, trk?.started_from]},
    {
      skip: !(trk?.destination && trk?.started_from),
    },
  );

  const addresses = useMemo(() => {
    return {
      destination: placeData?.find(place => place._id === trk?.destination),
      startedFrom: placeData?.find(place => place._id === trk?.started_from),
    };
  }, [placeData, trk?.destination, trk?.started_from]);

  return (
    <Box
      className="flex flex-1 flex-col border rounded m-2 border-gray-300 p-2"
      key={trk._id}>
      <Text className="text-md font-bold mb-1">
        Your tracker is currently{' '}
        {trk?.active ? (
          <Text className={'text-green-500'}>Active</Text>
        ) : (
          <Text className={'text-red-500'}>In Active</Text>
        )}
      </Text>
      <Text className="text-sm text-gray-600">
        Vehicle Name: {vehicle?.name}
      </Text>
      <Text className="text-sm text-gray-600">
        Registration Number: {vehicle?.registration_number}
      </Text>
      <Box>
        <Text className="text-md font-bold mt-2">Trip was started at</Text>
        <Text className="text-sm text-gray-600">
          {parseDateTime(trk?.createdAt)?.isValid &&
            parseDateTime(trk?.createdAt).toFormat('dd/MM/yy, hh:mm a')}
        </Text>
      </Box>
      <Box>
        <Text className="text-md font-bold mt-2">Trip was stopped at</Text>
        <Text className="text-sm text-gray-600">
          {parseDateTime(trk?.updatedAt)?.isValid &&
            parseDateTime(trk?.updatedAt).toFormat('dd/MM/yy, hh:mm a')}
        </Text>
      </Box>
      <Box>
        <Text className="text-md font-bold mt-2">Start Location</Text>
        <Text className="text-sm text-gray-600">
          {addresses?.startedFrom?.name}
        </Text>
      </Box>
      <Box>
        <Text className="text-md font-bold mt-2">Destination Location</Text>
        <Text className="text-sm text-gray-600">
          {addresses?.destination?.name}
        </Text>
      </Box>
      {trk?.active && (
        <Box>
          <Button onPress={() => handleUpdateTrackerToInactive(trk)}>
            <ButtonText>End Trip</ButtonText>
          </Button>
        </Box>
      )}
    </Box>
  );
};
