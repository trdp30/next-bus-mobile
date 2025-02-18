import {Box} from '@/src/components/ui/box';
import {Button, ButtonText} from '@/src/components/ui/button';
import {Text} from '@/src/components/ui/text';
import {TrackerContext} from '@/src/contexts/TrackerContext';
import {useGetPlacesQuery} from '@/src/store/services/placeApi';
import {useGetVehicleIdByIdQuery} from '@/src/store/services/vehicleApi';
import React, {useContext, useMemo} from 'react';

export const LastTripDetails = () => {
  const {handleStartReverseTrip, lastActiveTracker, createTrackerRequest} =
    useContext(TrackerContext);
  const {data: placeData} = useGetPlacesQuery(
    {ids: [lastActiveTracker?.destination, lastActiveTracker?.started_from]},
    {
      skip: !(
        lastActiveTracker?.destination && lastActiveTracker?.started_from
      ),
    },
  );

  const {data: vehicle} = useGetVehicleIdByIdQuery(lastActiveTracker?.vehicle);

  const addresses = useMemo(() => {
    return {
      destination: placeData?.find(
        place => place._id === lastActiveTracker?.destination,
      ),
      startedFrom: placeData?.find(
        place => place._id === lastActiveTracker?.started_from,
      ),
    };
  }, [
    placeData,
    lastActiveTracker?.destination,
    lastActiveTracker?.started_from,
  ]);

  if (lastActiveTracker?._id && !lastActiveTracker?.active) {
    return (
      <Box className="py-2 gap-y-4">
        <Text className="text-xl font-medium text-center">Last trip:</Text>
        <Text className="text-center">
          {addresses?.destination?.name} - to - {addresses?.startedFrom?.name}
        </Text>
        <Box>
          <Text className="text-center">{vehicle?.name}</Text>
          <Text className="text-center">{vehicle?.registration_number}</Text>
        </Box>
        <Button
          onPress={() => handleStartReverseTrip(lastActiveTracker)}
          disabled={createTrackerRequest.isLoading}>
          <ButtonText>Start Reverse Trip</ButtonText>
        </Button>
      </Box>
    );
  }
  return <></>;
};
