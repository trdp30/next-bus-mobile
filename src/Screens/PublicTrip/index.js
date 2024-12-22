import {Box} from '@/src/components/ui/box';
import {Button, ButtonText} from '@/src/components/ui/button';
import {Text} from '@/src/components/ui/text';
import ApplicationContext from '@/src/contexts/ApplicationContext';
import {TrackerContext} from '@/src/contexts/TrackerContext';
import {parseDateTime} from '@/src/utils/dateHelpers';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {map} from 'lodash';
import React, {useContext, useEffect, useMemo} from 'react';
import {BackHandler, ScrollView} from 'react-native';

export const PublicTrip = () => {
  const {
    currentTracker,
    handleUpdateTrackerToInactive,
    allTrackersForToday,
    currentTrackerVehicle,
  } = useContext(TrackerContext);

  const lastActiveTracker = useMemo(() => {
    return allTrackersForToday?.length ? allTrackersForToday[0] : null;
  }, [allTrackersForToday]);

  const tracker = useMemo(() => {
    const ct = currentTracker?._id && {
      ...currentTracker,
      vehicle: currentTrackerVehicle,
    };
    return ct || lastActiveTracker;
  }, [lastActiveTracker, currentTracker, currentTrackerVehicle]);

  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const {setShowActiveTracker} = useContext(ApplicationContext);

  useEffect(() => {
    if (isFocused) {
      setShowActiveTracker(false);
    }
  }, [isFocused, setShowActiveTracker]);

  React.useEffect(() => {
    const onBackPress = () => {
      navigation.navigate('Dashboard');
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress,
    );
    return () => backHandler.remove();
  }, [navigation]);

  return (
    <Box className="flex flex-1 flex-col">
      {tracker?.active ? (
        <Box className="flex-1 py-4 px-4">
          <Text className="text-md font-bold mb-1">
            Your tracker is currently{' '}
            {tracker?.active ? (
              <Text className={'text-green-500'}>Active</Text>
            ) : (
              <Text className={'text-red-500'}>In Active</Text>
            )}
          </Text>
          <Text className="text-sm text-gray-600">
            Vehicle Name: {tracker?.vehicle?.name}
          </Text>
          <Text className="text-sm text-gray-600">
            Registration Number: {tracker?.vehicle?.registration_number}
          </Text>
          <Box>
            <Text className="text-md font-bold mt-2">Trip was started at</Text>
            <Text className="text-sm text-gray-600">
              {parseDateTime(tracker?.createdAt)?.isValid &&
                parseDateTime(tracker?.createdAt).toFormat('dd/MM/yy, hh:mm a')}
            </Text>
          </Box>
          <Box>
            <Text className="text-md font-bold mt-2">Start Location</Text>
            <Text className="text-sm text-gray-600">
              {tracker?.start_location}
            </Text>
          </Box>
          <Box>
            <Text className="text-md font-bold mt-2">Destination Location</Text>
            <Text className="text-sm text-gray-600">
              {tracker?.destination_location}
            </Text>
          </Box>
          {tracker?.active && (
            <Box>
              <Button onPress={handleUpdateTrackerToInactive}>
                <ButtonText>End Trip</ButtonText>
              </Button>
            </Box>
          )}
        </Box>
      ) : (
        <ScrollView>
          {map(allTrackersForToday, trk => (
            <Box className="flex flex-1 flex-col" key={trk._id}>
              <Text className="text-md font-bold mb-1">
                Your tracker is currently{' '}
                {trk?.active ? (
                  <Text className={'text-green-500'}>Active</Text>
                ) : (
                  <Text className={'text-red-500'}>In Active</Text>
                )}
              </Text>
              <Text className="text-sm text-gray-600">
                Vehicle Name: {trk?.vehicle?.name}
              </Text>
              <Text className="text-sm text-gray-600">
                Registration Number: {trk?.vehicle?.registration_number}
              </Text>
              <Box>
                <Text className="text-md font-bold mt-2">
                  Trip was started at
                </Text>
                <Text className="text-sm text-gray-600">
                  {parseDateTime(trk?.createdAt)?.isValid &&
                    parseDateTime(trk?.createdAt).toFormat('dd/MM/yy, hh:mm a')}
                </Text>
              </Box>
              <Box>
                <Text className="text-md font-bold mt-2">Start Location</Text>
                <Text className="text-sm text-gray-600">
                  {trk?.start_location}
                </Text>
              </Box>
              <Box>
                <Text className="text-md font-bold mt-2">
                  Destination Location
                </Text>
                <Text className="text-sm text-gray-600">
                  {trk?.destination_location}
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
          ))}
        </ScrollView>
      )}
    </Box>
  );
};
