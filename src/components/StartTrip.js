import {produce} from 'immer';
import map from 'lodash/map';
import React, {useContext, useReducer, useState} from 'react';
import {Alert} from 'react-native';
import Snackbar from 'react-native-snackbar';
import {Box} from '../components/ui/box';
import {Button, ButtonText} from '../components/ui/button';
import {Heading} from '../components/ui/heading';
import {ChevronDownIcon} from '../components/ui/icon';
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from '../components/ui/select';
import {VStack} from '../components/ui/vstack';
import {AuthContext} from '../contexts/AuthContext';
import {useGetPlacesQuery} from '../store/services/placeApi';
import {useCreateTrackerMutation} from '../store/services/trackerApi';
import {useGetVehiclesQuery} from '../store/services/vehicleApi';
import {getIsoGetStartOfDay} from '../utils/dateHelpers';

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
      // case 'SET_TRACKER_LOGS':
      //   draft.trackerLogs = action.payload;
      //   break;
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
function StartTrip({fetchTracker}) {
  const {user} = useContext(AuthContext);
  const {data: vehicleData, isLoading: vehicleLoading} = useGetVehiclesQuery();
  const {data: placeData, isLoading: placeLoading} = useGetPlacesQuery();
  const [createTracker] = useCreateTrackerMutation();
  const [isLoading, toggleLoading] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);

  const onError = error => {
    Alert.alert('Error', error?.data?.message, [
      {
        text: 'Proceed',
        onPress: async () => {
          if (error?.data?.message.includes('already started')) {
            await fetchTracker({
              driver: state?.driver || user?._id,
              vehicle: state?.vehicle,
              started_from: state?.started_from,
              trackerLogs: [], // add the current location as the first log
              destination: state?.destination,
              date: getIsoGetStartOfDay(),
            });
          }
          toggleLoading(false);
        },
      },
      {
        text: 'Make Changes',
        cancelable: true,
        onPress: () => {
          toggleLoading(false);
        },
      },
    ]);
  };

  const onSuccess = () => {
    Snackbar.show({
      text: 'Trip started successfully',
      duration: Snackbar.LENGTH_SHORT,
      backgroundColor: '#2E7D32',
      textColor: '#fff',
    });
    toggleLoading(false);
  };

  const handleSubmit = async () => {
    const {vehicle, started_from, destination} = state;
    if (!vehicle || !started_from || !destination) {
      return Alert.alert('Missing fields', 'Please fill all fields.');
    }
    toggleLoading(true);
    const response = await createTracker({
      driver: state?.driver || user?._id,
      vehicle: state?.vehicle,
      date: getIsoGetStartOfDay(),
      started_from: state?.started_from,
      trackerLogs: [], // add the current location as the first log
      destination: state?.destination,
    });

    if (response.error) {
      onError(response.error);
    } else {
      onSuccess(response.data);
    }
  };

  return (
    <Box className="h-4/6 w-full rounded bg-white p-6">
      <VStack space="4xl" reversed={false}>
        <Heading size="md" className="mt-4">
          Hello{' '}
          <Heading sub={true} italic={true}>
            {user?.name}
          </Heading>
          ,
        </Heading>
        <Box>
          <Heading size="sm">Starting your day!</Heading>
          <Heading size="sm">Lets start with confirming below data</Heading>
        </Box>
        <VStack space="4xl" reversed={false}>
          <Box>
            <Select
              onValueChange={e => dispatch({type: 'SET_VEHICLE', payload: e})}
              isDisabled={isLoading}>
              <SelectTrigger variant="outline" size="lg">
                <SelectInput placeholder="Select vehicle" />
                <SelectIcon className="mr-3" as={ChevronDownIcon} />
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  {vehicleLoading ? (
                    <></>
                  ) : (
                    <>
                      {map(vehicleData, vehicle => (
                        <SelectItem
                          key={vehicle._id}
                          label={vehicle.name}
                          value={vehicle._id}
                        />
                      ))}
                    </>
                  )}
                </SelectContent>
              </SelectPortal>
            </Select>
          </Box>
          <Box>
            <Select
              isDisabled={isLoading}
              onValueChange={e =>
                dispatch({type: 'SET_STARTED_FROM', payload: e})
              }>
              <SelectTrigger variant="outline" size="lg">
                <SelectInput placeholder="Select starting location" />
                <SelectIcon className="mr-3" as={ChevronDownIcon} />
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  {placeLoading ? (
                    <></>
                  ) : (
                    <>
                      {map(placeData, place => (
                        <SelectItem
                          key={place._id}
                          label={place.name}
                          value={place._id}
                        />
                      ))}
                    </>
                  )}
                </SelectContent>
              </SelectPortal>
            </Select>
          </Box>
          <Box>
            <Select
              isDisabled={isLoading}
              onValueChange={e =>
                dispatch({type: 'SET_DESTINATION', payload: e})
              }>
              <SelectTrigger variant="outline" size="lg">
                <SelectInput placeholder="Select destination location" />
                <SelectIcon className="mr-3" as={ChevronDownIcon} />
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  {placeLoading ? (
                    <></>
                  ) : (
                    <>
                      {map(placeData, place => (
                        <SelectItem
                          key={place._id}
                          label={place.name}
                          value={place._id}
                        />
                      ))}
                    </>
                  )}
                </SelectContent>
              </SelectPortal>
            </Select>
          </Box>
        </VStack>
        <Button
          size="md"
          variant="solid"
          action="primary"
          isDisabled={isLoading}>
          <ButtonText onPress={handleSubmit} isDisabled={isLoading}>
            Start Trip
          </ButtonText>
        </Button>
      </VStack>
    </Box>
  );
}

export default StartTrip;
