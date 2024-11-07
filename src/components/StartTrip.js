import React, {useContext, useEffect, useReducer} from 'react';
import { Box } from '../components/ui/box';
import { Heading } from '../components/ui/heading';
import { VStack } from '../components/ui/vstack';
import { AuthContext } from '../contexts/AuthContext';
import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from '../components/ui/select';
import { ChevronDownIcon } from '../components/ui/icon';
import { useGetVehiclesQuery } from '../store/services/vehicleApi';
import map from 'lodash/map';
import { Button, ButtonText } from '../components/ui/button';
import { useGetPlacesQuery } from '../store/services/placeApi';
import { useCreateTrackerMutation } from '../store/services/trackerApi';
import { produce } from 'immer';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Snackbar from 'react-native-snackbar';

const initialState = {
  vehicle: null,
  driver: null,
  trackerLogs: [],
  started_from: null,
  destination: null,
}

const reducer = (state, action) => {
  return produce(state, (draft) => {
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
  })
}
function StartTrip() {
  const {user} = useContext(AuthContext);
  const {data: vehicleData, isLoading: vehicleLoading, error: vehicleRequestError} = useGetVehiclesQuery();
  const {data: placeData, isLoading: placeLoading, error: placeRequestError} = useGetPlacesQuery();
  const [createTracker, trackerResponse] = useCreateTrackerMutation()
  const {isError,isLoading,isSuccess,error} = trackerResponse
  const [state, dispatch] = useReducer(reducer, initialState)
  const navigation = useNavigation();

  console.log("trackerResponse", trackerResponse)

  const handleSubmit = async () => {
    const {vehicle, started_from, destination} = state;
    if (!vehicle || !started_from || !destination) {
      return Alert.alert('Missing fields', 'Please fill all fields.');
    }
    createTracker({
      driver: state.driver || user._id,
      vehicle: state.vehicle,
      started_from: state.started_from,
      trackerLogs: [], // add the current location as the first log
      destination: state.destination,
    });
}

  useEffect(() => {
    if(!isLoading){
      if(isError) {
        Alert.alert('Error', error?.data?.message, [
          {
            text: 'OK',
            onPress: () => {
              if(error?.data?.message.includes('already started')) {
                navigation.navigate('Tracker')
              }
            }
        }])
      } else if(isSuccess) {
        Snackbar.show({
          text: 'Trip started successfully',
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: '#2E7D32',
          textColor: '#fff'
        });
        navigation.navigate('Tracker')
      }
    }
  },[isError,isLoading,isSuccess,error, navigation])


  return (
      <Box className="h-4/6 w-full bg-white p-6 rounded">
        <VStack space="4xl" reversed={false}>
          <Heading size="md" className="mt-4">Hello <Heading sub={true} italic={true}>{user?.name}</Heading>,</Heading>
          <Box>
            <Heading size="sm">Starting your day!</Heading>
            <Heading size="sm">Lets start with confirming below data</Heading>
          </Box>
          <VStack space="4xl" reversed={false}>
          <Box>
              <Select onValueChange={(e) => dispatch({type: 'SET_VEHICLE', payload: e})}>
                <SelectTrigger variant="outline" size="lg" >
                  <SelectInput placeholder="Select vehicle" />
                  <SelectIcon className="mr-3" as={ChevronDownIcon} />
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop/>
                  <SelectContent>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    {vehicleLoading ? (<></>) : (
                      <>
                        {map(vehicleData, (vehicle) => (
                          <SelectItem key={vehicle._id} label={vehicle.name} value={vehicle._id} />
                        ))}
                      </>
                    )}
                  </SelectContent>
                </SelectPortal>
              </Select>
            </Box>
            <Box>
            <Select onValueChange={(e) => dispatch({type: 'SET_STARTED_FROM', payload: e})}>
                <SelectTrigger variant="outline" size="lg" >
                  <SelectInput placeholder="Select starting location" />
                  <SelectIcon className="mr-3" as={ChevronDownIcon} />
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop/>
                  <SelectContent>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    {placeLoading ? (<></>) : (
                      <>
                        {map(placeData, (place) => (
                          <SelectItem key={place._id} label={place.name} value={place._id} />
                        ))}
                      </>
                    )}
                  </SelectContent>
                </SelectPortal>
              </Select>
              </Box>
              <Box>
            <Select onValueChange={(e) => dispatch({type: 'SET_DESTINATION', payload: e})}>
                <SelectTrigger variant="outline" size="lg" >
                  <SelectInput placeholder="Select destination location" />
                  <SelectIcon className="mr-3" as={ChevronDownIcon} />
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop/>
                  <SelectContent>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    {placeLoading ? (<></>) : (
                      <>
                        {map(placeData, (place) => (
                          <SelectItem key={place._id} label={place.name} value={place._id} />
                        ))}
                      </>
                    )}
                  </SelectContent>
                </SelectPortal>
              </Select>
              </Box>
          </VStack>
          <Button size="md" variant="solid" action="primary" disabled={isLoading}>
            <ButtonText onPress={handleSubmit} disabled={isLoading}>Start Trip</ButtonText>
          </Button>
        </VStack>
      </Box>
  );
}

export default StartTrip