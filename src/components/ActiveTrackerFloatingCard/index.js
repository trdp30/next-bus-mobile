import {Box} from '@/src/components/ui/box';
import {Text} from '@/src/components/ui/text';
import {TrackerContext} from '@/src/contexts/TrackerContext';
import {useNavigation} from '@react-navigation/native';
import React, {useContext, useEffect, useRef} from 'react';
import {Animated, Easing, Pressable} from 'react-native';

const ActiveTrackerFloatingCard = () => {
  const {currentTracker} = useContext(TrackerContext);
  const navigation = useNavigation();

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
      <Pressable onPress={() => navigation.navigate('PublicTrip')}>
        <Box className="absolute bottom-[3.8rem] w-full bg-teal-100 shadow-lg p-4 rounded-t-lg flex-row items-center">
          <Box className="flex-1">
            <Text className="text-md font-bold mb-1">
              Your tracker is currently{' '}
              {currentTracker?.active ? (
                <Text className={'text-green-500'}>Active</Text>
              ) : (
                <Text className={'text-red-500'}>In Active</Text>
              )}
            </Text>
            <Text className="text-sm text-gray-600">
              Vehicle Name: {currentTracker?.vehicle?.name}
            </Text>
            <Text className="text-sm text-gray-600">
              Registration Number:{' '}
              {currentTracker?.vehicle?.registration_number}
            </Text>
          </Box>
        </Box>
      </Pressable>
    </Animated.View>
  );
};

export default ActiveTrackerFloatingCard;
