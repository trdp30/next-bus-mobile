import {MonitoringTrackerContext} from '@/src/contexts/MonitoringTrackerContext';
import {TrackerContext} from '@/src/contexts/TrackerContext';
import {useGetTrackersQuery} from '@/src/store/services/trackerApi';
import {useGetVehiclesQuery} from '@/src/store/services/vehicleApi';
import {getIsoGetStartOfDay, parseDateTime} from '@/src/utils/dateHelpers';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {filter, find, findIndex, map, sortBy, unionBy, uniq} from 'lodash';
import React, {useContext, useMemo} from 'react';
import {Pressable} from 'react-native';
import {Box} from '../ui/box';
import {Button, ButtonText} from '../ui/button';
import {Text} from '../ui/text';
import VehicleListItem from './VehicleListItem';

const TrackerOptions = () => {
  const {handleUpdateTrackerToInactive, currentTracker} =
    useContext(TrackerContext);
  const {selectedVehicles, setSelectedVehicles} = useContext(
    MonitoringTrackerContext,
  );
  const {
    data: allTracker,
    isLoading: allTrackerRequestLoading,
    refetch,
    isFetching,
    ...rest
  } = useGetTrackersQuery(
    {
      date: getIsoGetStartOfDay(),
      destination: currentTracker?.destination?._id,
    },
    {
      skip: !currentTracker?.destination?._id,
      pollingInterval: 60000 * 10,
    },
  );

  const {data: vehicles} = useGetVehiclesQuery();

  const handleSelectVehicle = vehicleId => {
    setSelectedVehicles(prev => {
      const index = findIndex(prev, v => v?._id === vehicleId);
      if (index === -1) {
        const value = prev.concat(find(vehicles, ['_id', vehicleId]));
        return uniq(value);
      } else {
        const value = prev.filter(v => v?._id !== vehicleId);
        return uniq(value);
      }
    });
  };

  const filteredTrackers = useMemo(() => {
    const parsedTrackers = map(allTracker, tracker => {
      return {
        ...tracker,
        active: tracker.active,
        sortOrder: +parseDateTime(tracker?.created_by),
      };
    });
    const sortedTrackers = sortBy(parsedTrackers, 'sortOrder');
    const uniqTrackers = unionBy(sortedTrackers, 'vehicle');
    return filter(uniqTrackers, tracker => {
      return currentTracker?._id !== tracker?._id;
    });
  }, [allTracker, currentTracker]);

  return (
    <Box className="mb-8">
      <Text className="text-center text-lg font-bold">Tracker Options</Text>
      <BottomSheetScrollView>
        <Box className="px-4 py-5">
          <Box className="flex-1 flex-row flex-wrap items-center justify-between">
            <Text className="font-bold w-fit">
              Select vehicles that you want to monitor:
            </Text>
            {!allTrackerRequestLoading && (
              <Box>
                <Text className="text-sm text-gray-500">
                  (Total activated vehicles: {filteredTrackers?.length}. It will
                  refresh in every 10 minutes)
                </Text>
                {!isFetching && (
                  <Box className="flex-row items-center gap-x-2">
                    <Text className="text-sm text-gray-500">
                      Refresh manually here:
                    </Text>
                    <Pressable onPress={refetch}>
                      <Text className="text-sm text-blue-500 font-bold">
                        Refresh
                      </Text>
                    </Pressable>
                  </Box>
                )}
              </Box>
            )}
          </Box>
          <Box className="gap-y-4 py-4">
            {allTrackerRequestLoading && (
              <Box className="py-8">
                <Text className="text-center">Loading...</Text>
              </Box>
            )}
            {filteredTrackers?.length === 0 && !allTrackerRequestLoading && (
              <Box className="py-8">
                <Text className="text-center">
                  No activated vehicles at this moment
                </Text>
              </Box>
            )}
            {filteredTrackers?.map(tracker => (
              <VehicleListItem
                key={tracker?._id}
                tracker={tracker}
                vehicles={vehicles}
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
