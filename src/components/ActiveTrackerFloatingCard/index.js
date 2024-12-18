import React, {useContext, useMemo, useRef, useEffect} from 'react';
import {TrackerContext} from '@/src/contexts/TrackerContext';
import {Box} from '@/src/components/ui/box';
import {Text} from '@/src/components/ui/text';
import {Animated, Easing} from 'react-native';

const ActiveTrackerFloatingCard = () => {
  const {currentTracker, vehicles} = useContext(TrackerContext);
  const vehicle = useMemo(() => {
    if (vehicles && Array.isArray(vehicles)) {
      return vehicles?.find(v => v._id === currentTracker?.vehicle);
    }
    return null;
  }, [vehicles, currentTracker]);

  const slideAnim = useRef(new Animated.Value(100)).current; // Initial position off-screen

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [slideAnim]);

  return (
    <Animated.View style={{transform: [{translateY: slideAnim}]}}>
      <Box className="absolute bottom-[3.8rem] w-full bg-teal-100 shadow-lg p-4 rounded-t-lg flex-row items-center">
        <Box className="flex-1">
          <Text className="text-md font-bold mb-1">
            Your tracker is currently{' '}
            <Text className={'text-green-500'}>Active</Text>
          </Text>
          <Text className="text-sm text-gray-600">
            Vehicle Name: {vehicle?.name}
          </Text>
          <Text className="text-sm text-gray-600">
            Registration Number: {vehicle?.registration_number}
          </Text>
        </Box>
      </Box>
    </Animated.View>
  );
};

export default ActiveTrackerFloatingCard;
