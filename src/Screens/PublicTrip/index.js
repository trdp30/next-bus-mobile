import {Box} from '@/src/components/ui/box';
import {Text} from '@/src/components/ui/text';
import ApplicationContext from '@/src/contexts/ApplicationContext';
import {TrackerContext} from '@/src/contexts/TrackerContext';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useContext, useEffect, useMemo} from 'react';
import {BackHandler} from 'react-native';

export const PublicTrip = () => {
  const {currentTracker, vehicles} = useContext(TrackerContext);

  const vehicle = useMemo(() => {
    if (vehicles && Array.isArray(vehicles)) {
      return vehicles?.find(v => v._id === currentTracker?.vehicle);
    }
    return null;
  }, [vehicles, currentTracker]);

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
          Vehicle Name: {vehicle?.name}
        </Text>
        <Text className="text-sm text-gray-600">
          Registration Number: {vehicle?.registration_number}
        </Text>
      </Box>
    </Box>
  );
};
