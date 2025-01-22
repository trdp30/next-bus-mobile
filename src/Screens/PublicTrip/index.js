import TrackerMap from '@/src/components/TrackerMap';
import TrackerOptions from '@/src/components/TrackerOptions';
import {Box} from '@/src/components/ui/box';
import {Button, ButtonText} from '@/src/components/ui/button';
import {Text} from '@/src/components/ui/text';
import ApplicationContext from '@/src/contexts/ApplicationContext';
import {TrackerContext} from '@/src/contexts/TrackerContext';
import {parseDateTime} from '@/src/utils/dateHelpers';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {map} from 'lodash';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import {BackHandler, ScrollView, StyleSheet} from 'react-native';

export const PublicTrip = () => {
  const {
    currentTracker,
    handleUpdateTrackerToInactive,
    allTrackersForToday,
    isTrackerActive,
  } = useContext(TrackerContext);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const {setShowActiveTracker} = useContext(ApplicationContext);
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['10%', '25%', '50%', '90%'], []);

  const lastActiveTracker = useMemo(() => {
    return allTrackersForToday?.length ? allTrackersForToday[0] : null;
  }, [allTrackersForToday]);

  const tracker = useMemo(() => {
    return currentTracker || lastActiveTracker;
  }, [lastActiveTracker, currentTracker]);

  const handleSheetChanges = useCallback(index => {
    console.log('handleSheetChanges', index);
  }, []);

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

  if (tracker?.active) {
    return (
      <Box className="flex flex-1 flex-col">
        <Box className="flex flex-1 max-h-[92%]">
          <TrackerMap
            currentTracker={tracker}
            isTrackerActive={isTrackerActive}
            handleUpdateTrackerToInactive={handleUpdateTrackerToInactive}
          />
        </Box>
        {currentTracker?.active && (
          <BottomSheet
            ref={bottomSheetRef}
            onChange={handleSheetChanges}
            snapPoints={snapPoints}>
            <BottomSheetView style={styles.contentContainer}>
              <Box>
                <TrackerOptions />
              </Box>
            </BottomSheetView>
          </BottomSheet>
        )}
      </Box>
    );
  } else {
    return (
      <Box className="flex flex-1 flex-col">
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
                  {tracker?.started_from?.name}
                </Text>
              </Box>
              <Box>
                <Text className="text-md font-bold mt-2">
                  Destination Location
                </Text>
                <Text className="text-sm text-gray-600">
                  {trk?.destination?.name}
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
      </Box>
    );
  }
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
  },
});
