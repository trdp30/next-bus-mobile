import TrackerMap from '@/src/components/TrackerMap';
import TrackerOptions from '@/src/components/TrackerOptions';
import {Box} from '@/src/components/ui/box';
import ApplicationContext from '@/src/contexts/ApplicationContext';
import MonitoringTrackerProvider from '@/src/contexts/MonitoringTrackerContext';
import {TrackerContext} from '@/src/contexts/TrackerContext';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {map} from 'lodash';
import React, {useContext, useEffect, useMemo} from 'react';
import {BackHandler, ScrollView, StyleSheet} from 'react-native';
import {InActiveTrackerCard} from './InActiveTrackerCard';

export const PublicTrip = () => {
  const {currentTracker, allTrackersForToday} = useContext(TrackerContext);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const {setShowActiveTracker} = useContext(ApplicationContext);
  const snapPoints = useMemo(() => ['10%', '25%', '50%', '90%'], []);

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
  }, [navigation, isFocused]);

  if (currentTracker?.active) {
    return (
      <MonitoringTrackerProvider>
        <Box className="flex flex-1 flex-col">
          <Box className="flex flex-1 max-h-[92%]">
            <TrackerMap />
          </Box>
          <BottomSheet snapPoints={snapPoints}>
            <BottomSheetView style={styles.contentContainer}>
              <Box>
                <TrackerOptions />
              </Box>
            </BottomSheetView>
          </BottomSheet>
        </Box>
      </MonitoringTrackerProvider>
    );
  } else {
    return (
      <Box className="flex flex-1 flex-col">
        <ScrollView>
          {map(allTrackersForToday, trk => (
            <InActiveTrackerCard trk={trk} key={trk._id} />
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
