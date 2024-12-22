import {Box} from '@/src/components/ui/box';
import {ArrowRightIcon, Icon, ShareIcon} from '@/src/components/ui/icon';
import {Pressable} from '@/src/components/ui/pressable';
import {Text} from '@/src/components/ui/text';
import {TrackerContext} from '@/src/contexts/TrackerContext';
import {useNavigation} from '@react-navigation/native';
import classNames from 'classnames';
import React, {useCallback, useContext} from 'react';
import {BackHandler, useColorScheme} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';

function SelectTripType() {
  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useNavigation();
  const {isTrackerActive} = useContext(TrackerContext);

  const handleStartTrip = type => {
    navigation.navigate('CollectPermission', {stripType: type});
  };

  const handleBack = useCallback(() => {
    if (isTrackerActive) {
      navigation.navigate('Dashboard');
      return true;
    } else {
      navigation.goBack();
      return true;
    }
  }, [navigation, isTrackerActive]);

  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBack,
    );
    return () => backHandler.remove();
  }, [isTrackerActive, handleBack]);

  return (
    <Box className="flex flex-1">
      <Box className="absolute z-20 w-full px-4 pt-4 top-0">
        <Pressable onPress={handleBack}>
          <Box className="z-20 w-12 rounded-full p-2">
            <FeatherIcon name={'arrow-left'} size={28} />
          </Box>
        </Pressable>
      </Box>
      <Box
        className={classNames(
          'absolute h-2/6 w-full top-0 rounded-b-[50%] shadow-md',
          isDarkMode ? 'bg-white' : 'bg-teal-200',
        )}
      />
      <Box className="flex h-[35%] py-12">
        <Box className="flex flex-1 py-5 justify-end">
          <Text className="text-teal-900 text-4xl font-bold font-roboto text-center">
            Select Trip Type
          </Text>
        </Box>
      </Box>
      <Box className="flex flex-1">
        <Box className="flex w-full text-center justify-center items-center px-4 py-6 ">
          <Pressable
            className="rounded-md w-full shadow-sm bg-white border border-teal-900 py-8"
            onPress={() => handleStartTrip('public')}>
            <Text className="text-3xl font-bold text-teal-900 text-center">
              Start Public Trip
            </Text>
            <Text className="text-md text-black px-8 text-left">
              The trip will be visible to all users available or whoever
              requested in the app network.
            </Text>
          </Pressable>
          <Box className="shadow-sm bg-white rounded-full absolute bottom-0 ring-4">
            <Icon as={ShareIcon} className="text-typography-500 m-2 w-8 h-8" />
          </Box>
        </Box>
        <Box className="flex w-full text-center justify-center items-center px-4 py-6">
          <Pressable
            className="shadow-sm bg-white rounded-sm w-full border border-teal-900 py-8"
            onPress={() => handleStartTrip('private')}>
            <Text className="text-3xl font-bold text-teal-900 text-center">
              Start Private Trip
            </Text>
            <Text className="text-md text-black px-8 text-left">
              The trip will be visible only to the owner in the app network.
            </Text>
          </Pressable>
          <Box className="shadow-sm bg-white rounded-full absolute bottom-0 ring-4">
            <Icon
              as={ArrowRightIcon}
              className="text-typography-500 m-2 w-8 h-8"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default SelectTripType;
