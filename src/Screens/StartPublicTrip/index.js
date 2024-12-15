import {Dropdown} from '@/src/components/Dropdown';
import {Box} from '@/src/components/ui/box';
import {Button, ButtonText} from '@/src/components/ui/button';
import {Pressable} from '@/src/components/ui/pressable';
import {Spinner} from '@/src/components/ui/spinner';
import {Text} from '@/src/components/ui/text';
import {useGetPlacesQuery} from '@/src/store/services/placeApi';
import {useGetVehiclesQuery} from '@/src/store/services/vehicleApi';
import {useNavigation} from '@react-navigation/native';
import classNames from 'classnames';
import {produce} from 'immer';
import React, {
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import {Alert, useColorScheme} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {TrackerContext} from '@/src/contexts/TrackerContext';

const initialState = {
  vehicle: null,
  driver: null,
  trackerLogs: [],
  started_from: null,
  destination: null,
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

  const {data: vehicleData, isLoading: vehicleLoading} = useGetVehiclesQuery();
  const {data: placeData, isLoading: placeLoading} = useGetPlacesQuery();
  const [state, dispatch] = useReducer(reducer, initialState);
  const {handleCreateTracker, createTrackerRequest} =
    useContext(TrackerContext);

  console.log('state', state);

  const onError = error => {
    Alert.alert(
      'Oops!, Something went wrong',
      error.message || 'An error occurred while creating the tracker.',
    );
  };

  const onSuccess = useCallback(() => {
    Alert.alert('Success', 'Tracker created successfully.');
    if (createTrackerRequest?.data?.existingTracker) {
      console.log(
        'createTrackerRequest?.data?.existingTracker',
        createTrackerRequest?.data?.existingTracker,
      );
    }
    console.log('createTrackerRequest', createTrackerRequest);
  }, [createTrackerRequest]);

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

  const handleBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    const {isError, isSuccess} = createTrackerRequest;
    if (isError) {
      onError();
    }
    if (isSuccess) {
      onSuccess();
    }
  }, [createTrackerRequest, onSuccess]);

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
