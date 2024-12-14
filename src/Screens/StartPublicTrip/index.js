import {Box} from '@/src/components/ui/box';
import {Pressable} from '@/src/components/ui/pressable';
import {Text} from '@/src/components/ui/text';
import {useNavigation} from '@react-navigation/native';
import classNames from 'classnames';
import {produce} from 'immer';
import React from 'react';
import {useColorScheme} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';

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
function StartPublicTrip() {
  const navigation = useNavigation();
  const isDarkMode = useColorScheme() === 'dark';

  // const {user} = useContext(AuthContext);
  // const {data: vehicleData, isLoading: vehicleLoading} = useGetVehiclesQuery();
  // const {data: placeData, isLoading: placeLoading} = useGetPlacesQuery();
  // const [createTracker] = useCreateTrackerMutation();
  // const [isLoading, toggleLoading] = useState(false);
  // const [state, dispatch] = useReducer(reducer, initialState);

  // const onError = error => {
  //   Alert.alert('Error', error?.data?.message, [
  //     {
  //       text: 'Proceed',
  //       onPress: async () => {
  //         if (error?.data?.message.includes('already started')) {
  //           await fetchTracker({
  //             driver: state?.driver || user?._id,
  //             vehicle: state?.vehicle,
  //             started_from: state?.started_from,
  //             trackerLogs: [], // add the current location as the first log
  //             destination: state?.destination,
  //             date: getIsoGetStartOfDay(),
  //           });
  //         }
  //         toggleLoading(false);
  //       },
  //     },
  //     {
  //       text: 'Make Changes',
  //       cancelable: true,
  //       onPress: () => {
  //         toggleLoading(false);
  //       },
  //     },
  //   ]);
  // };

  // const onSuccess = () => {
  //   Snackbar.show({
  //     text: 'Trip started successfully',
  //     duration: Snackbar.LENGTH_SHORT,
  //     backgroundColor: '#2E7D32',
  //     textColor: '#fff',
  //   });
  //   toggleLoading(false);
  // };

  // const handleSubmit = async () => {
  //   const {vehicle, started_from, destination} = state;
  //   if (!vehicle || !started_from || !destination) {
  //     return Alert.alert('Missing fields', 'Please fill all fields.');
  //   }
  //   toggleLoading(true);
  //   const response = await createTracker({
  //     driver: state?.driver || user?._id,
  //     vehicle: state?.vehicle,
  //     date: getIsoGetStartOfDay(),
  //     started_from: state?.started_from,
  //     trackerLogs: [], // add the current location as the first log
  //     destination: state?.destination,
  //   });

  //   if (response.error) {
  //     onError(response.error);
  //   } else {
  //     onSuccess(response.data);
  //   }
  // };

  const handleBack = () => {
    navigation.goBack();
  };

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
      <Box>
        <Box>
          {/* <Select
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
          </Select> */}
        </Box>
        <Box>
          {/* <Select
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
          </Select> */}
        </Box>
        <Box>
          {/* <Select
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
          </Select> */}
        </Box>
      </Box>
      {/* <Button
        size="md"
        variant="solid"
        action="primary"
        onPress={handleSubmit}
        isDisabled={isLoading}>
        <ButtonText isDisabled={isLoading}>Start Trip</ButtonText>
      </Button> */}
    </Box>
  );
}

export default StartPublicTrip;
