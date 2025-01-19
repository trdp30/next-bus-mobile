import {Dropdown} from '@/src/components/Dropdown';
import {Box} from '@/src/components/ui/box';
import {Button, ButtonText} from '@/src/components/ui/button';
import {Pressable} from '@/src/components/ui/pressable';
import {Spinner} from '@/src/components/ui/spinner';
import {Text} from '@/src/components/ui/text';
import {AuthContext} from '@/src/contexts/AuthContext';
import {TrackerContext} from '@/src/contexts/TrackerContext';
import {useGetPlacesQuery} from '@/src/store/services/placeApi';
import {useGetVehiclesQuery} from '@/src/store/services/vehicleApi';
import {useNavigation} from '@react-navigation/native';
import classNames from 'classnames';
import {produce} from 'immer';
import React, {useCallback, useContext, useEffect, useReducer} from 'react';
import {Alert, BackHandler, useColorScheme} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';

const initialState = {
  vehicle: null,
  driver: null,
  trackerLogs: [],
  started_from: null,
  destination: null,
  isPrivate: false,
};

const reducer = (state, action) => {
  return produce(state, draft => {
    switch (action.type) {
      case 'SET_VEHICLE':
        draft.vehicle = action.payload;
        break;
      case 'SET_DRIVER':
        draft.driver = action.payload;
        break;
      case 'SET_STARTED_FROM':
        draft.started_from = action.payload;
        break;
      case 'SET_DESTINATION':
        draft.destination = action.payload;
        break;
      default:
        break;
    }
  });
};

function StartPublicTrip() {
  const navigation = useNavigation();
  const isDarkMode = useColorScheme() === 'dark';
  const {user} = useContext(AuthContext);

  const {data: vehicleData, isLoading: vehicleLoading} = useGetVehiclesQuery({
    currentUser: user?._id,
  });
  const {isTrackerActive} = useContext(TrackerContext);
  const {data: placeData, isLoading: placeLoading} = useGetPlacesQuery();
  const [state, dispatch] = useReducer(reducer, initialState);
  const {handleCreateTracker, createTrackerRequest} =
    useContext(TrackerContext);

  const navigateToPublicTrip = useCallback(() => {
    navigation.navigate('PublicTrip');
  }, [navigation]);

  const onError = useCallback(() => {
    const error = createTrackerRequest?.error;
    Alert.alert(
      'Oops!, Something went wrong',
      error?.message || 'An error occurred while creating the tracker.',
    );
  }, [createTrackerRequest]);

  const onSuccess = useCallback(() => {
    // Alert.alert('Success', 'Tracker created successfully.');
    // if (createTrackerRequest?.data?.existingTracker) {
    //   console.log(
    //     'createTrackerRequest?.data?.existingTracker',
    //     createTrackerRequest?.data?.existingTracker,
    //   );
    // }
    // console.log('createTrackerRequest', createTrackerRequest);
    // navigateToPublicTrip();
  }, []);

  const handleSubmit = async () => {
    const {vehicle, started_from, destination} = state;
    if (!vehicle || !started_from || !destination) {
      return Alert.alert('Waring', 'Please fill all fields.');
    }
    if (started_from === destination) {
      return Alert.alert(
        'Waring',
        'Start and destination location cannot be same.',
      );
    }
    handleCreateTracker(state);
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

  useEffect(() => {
    const {isError, isSuccess} = createTrackerRequest;
    if (isError) {
      onError();
    }
    if (isSuccess) {
      onSuccess();
    }
  }, [createTrackerRequest, onSuccess, onError]);

  useEffect(() => {
    if (isTrackerActive) {
      navigateToPublicTrip();
    }
  }, [navigateToPublicTrip, isTrackerActive]);

  useEffect(() => {
    if (!vehicleLoading) {
      if (vehicleData?.length === 1) {
        dispatch({type: 'SET_VEHICLE', payload: vehicleData[0]});
      } else if (!vehicleData?.length) {
        Alert.alert('No vehicle found', 'Please add vehicle first.', [
          {
            text: 'Ok',
            onPress: () => navigation.navigate('AddVehicle'),
            isPreferred: true,
            style: 'default',
          },
          {
            text: 'Cancel',
            isPreferred: false,
            style: 'cancel',
          },
        ]);
      }
    }
  }, [vehicleLoading, vehicleData, navigation]);

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
      <Box className="flex h-[35%] flex-col py-14 justify-end">
        <Text className="text-4xl font-bold text-center">Public Trip</Text>
        <Box>
          <Text className="text-md text-center px-10">
            Lets start with confirming below data
          </Text>
        </Box>
      </Box>
      <Box className="flex flex-1 p-4">
        <Box
          className={classNames(
            'flex flex-1 shadow-lg bg-white rounded-lg justify-center items-center',
          )}>
          {placeLoading && vehicleLoading ? (
            <Box>
              <Spinner size="14" className="mr-6" />
              <Text className="py-2">Loading...</Text>
            </Box>
          ) : (
            <Box className="flex flex-1 w-full gap-y-4 p-6">
              <Box className="">
                <Dropdown
                  isDisabled={createTrackerRequest?.isLoading}
                  options={vehicleData}
                  isLoading={vehicleLoading}
                  emptyOptionContent={
                    <Box>
                      <Text className="text-gray-500">
                        No vehicle found. Add a vehicle first.
                      </Text>
                      <Button onPress={() => navigation.navigate('AddVehicle')}>
                        <ButtonText>Add Vehicle</ButtonText>
                      </Button>
                    </Box>
                  }
                  placeholder="Select Vehicle"
                  onSelectedChange={e =>
                    dispatch({type: 'SET_VEHICLE', payload: e})
                  }
                />
              </Box>
              <Box className="w-full">
                <Dropdown
                  isDisabled={createTrackerRequest?.isLoading}
                  options={placeData}
                  placeholder="Select Starting location"
                  onSelectedChange={e =>
                    dispatch({type: 'SET_STARTED_FROM', payload: e})
                  }
                />
              </Box>
              <Box>
                <Dropdown
                  isDisabled={createTrackerRequest?.isLoading}
                  options={placeData}
                  placeholder="Select destination location"
                  onSelectedChange={e =>
                    dispatch({type: 'SET_DESTINATION', payload: e})
                  }
                />
              </Box>
              <Button
                size="md"
                variant="solid"
                action="primary"
                onPress={handleSubmit}
                isDisabled={createTrackerRequest?.isLoading}>
                <ButtonText isDisabled={createTrackerRequest?.isLoading}>
                  Start Trip
                </ButtonText>
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default StartPublicTrip;
