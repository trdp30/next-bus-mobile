import {Box} from '@/src/components/ui/box';
import {ArrowRightIcon, Icon, ShareIcon} from '@/src/components/ui/icon';
import {Pressable} from '@/src/components/ui/pressable';
import {Text} from '@/src/components/ui/text';
import {AuthContext} from '@/src/contexts/AuthContext';
import {useNavigation} from '@react-navigation/native';
import classNames from 'classnames';
import {produce} from 'immer';
import React, {useContext} from 'react';
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
function SelectTripType() {
  const isDarkMode = useColorScheme() === 'dark';
  const {user} = useContext(AuthContext);
  const navigation = useNavigation();
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

  const handleStartTrip = type => {
    navigation.navigate('CollectPermission', {stripType: type});
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handlePublicStart = () => {
    navigation.navigate('StartPublicTrip');
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
            onPress={handlePublicStart}>
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
