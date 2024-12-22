import {Box} from '@/src/components/ui/box';
import {Pressable} from '@/src/components/ui/pressable';
import {Text} from '@/src/components/ui/text';
import ApplicationContext from '@/src/contexts/ApplicationContext';
import {AuthContext} from '@/src/contexts/AuthContext';
import {TrackerContext} from '@/src/contexts/TrackerContext';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import classNames from 'classnames';
import React, {useContext, useEffect} from 'react';
import {useColorScheme} from 'react-native';

export function Home() {
  const isDarkMode = useColorScheme() === 'dark';
  const {user} = useContext(AuthContext);
  const navigation = useNavigation();
  const {isTrackerActive, tripType} = useContext(TrackerContext);
  const isFocused = useIsFocused();
  const {setShowActiveTracker} = useContext(ApplicationContext);

  useEffect(() => {
    if (isFocused) {
      setShowActiveTracker(true);
    }
    return () => {
      setShowActiveTracker(false);
    };
  }, [isFocused, setShowActiveTracker]);

  const handleStartTrip = () => {
    navigation.navigate('SelectTripType');
  };

  const handleViewTrip = () => {
    if (isTrackerActive) {
      navigation.navigate(tripType === 'public' ? 'PublicTrip' : 'PrivateTrip');
    }
  };

  return (
    <Box className="flex flex-1">
      <Box
        className={classNames(
          'absolute h-2/6 w-full top-0 rounded-b-[50%] shadow-md',
          isDarkMode ? 'bg-white' : 'bg-teal-200',
        )}
      />
      <Box className="flex h-2/6 justify-end py-5">
        <Text className="text-2xl font-bold text-center py-4">Hello</Text>
        <Text className="text-blue-600 text-4xl font-bold font-roboto text-center pb-6">
          {user?.name}
        </Text>
      </Box>
      <Box className="flex flex-1 p-6 justify-start gap-y-6">
        <Box className="flex flex-1 flex-col p-2 shadow-md bg-white rounded-lg justify-between">
          <Box className="py-6 px-4">
            <Box className="py-4">
              {isTrackerActive ? (
                <Text className="text-xl font-medium text-center">
                  You have an active trip.{' '}
                </Text>
              ) : (
                <Text className="text-xl font-medium text-center">
                  You have not started your trip yet.{' '}
                </Text>
              )}
            </Box>
          </Box>
          {/* <Pressable className="shadow-sm bg-teal-200 rounded-sm w-full">
            <Text className="text-3xl font-bold text-teal-700 py-4 text-center">
              Lets start
            </Text>
          </Pressable> */}
        </Box>
        {isTrackerActive ? (
          <Box className="flex w-full text-center justify-center items-center px-4">
            <Pressable
              className="shadow-sm bg-teal-200 rounded-sm w-full"
              onPress={handleViewTrip}>
              <Text className="text-3xl font-bold text-teal-900 py-4 text-center">
                View Trip
              </Text>
            </Pressable>
          </Box>
        ) : (
          <Box className="flex w-full text-center justify-center items-center px-4">
            <Pressable
              className="shadow-sm bg-teal-200 rounded-sm w-full"
              onPress={handleStartTrip}>
              <Text className="text-3xl font-bold text-teal-900 py-4 text-center">
                Lets start
              </Text>
            </Pressable>
          </Box>
        )}

        {/* <Box className="flex w-full text-center justify-center items-center px-4">
          <Pressable className="shadow-sm bg-amber-500 rounded-md w-full">
            <Text className="text-2xl font-bold text-white py-4 text-center">
              Lets start with private mode
            </Text>
          </Pressable>
        </Box> */}
      </Box>
    </Box>
  );
}
