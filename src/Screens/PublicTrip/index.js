import TrackerMap from '@/src/components/TrackerMap';
import ApplicationContext from '@/src/contexts/ApplicationContext';
import {TrackerContext} from '@/src/contexts/TrackerContext';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useContext, useEffect, useMemo} from 'react';
import {BackHandler} from 'react-native';

export const PublicTrip = () => {
  const {
    currentTracker,
    handleUpdateTrackerToInactive,
    allTrackersForToday,
    isTrackerActive,
  } = useContext(TrackerContext);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const {setShowActiveTracker} = useContext(ApplicationContext);

  const lastActiveTracker = useMemo(() => {
    return allTrackersForToday?.length ? allTrackersForToday[0] : null;
  }, [allTrackersForToday]);

  const tracker = useMemo(() => {
    return currentTracker || lastActiveTracker;
  }, [lastActiveTracker, currentTracker]);

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
    <TrackerMap currentTracker={tracker} isTrackerActive={isTrackerActive} />
  );

  // return (
  //   <Box className="flex flex-1 flex-col">
  //     {tracker?.active ? (
  //       <Box className="flex-1 py-4 px-4">
  //         <Text className="text-md font-bold mb-1">
  //           Your tracker is currently{' '}
  //           {tracker?.active ? (
  //             <Text className={'text-green-500'}>Active</Text>
  //           ) : (
  //             <Text className={'text-red-500'}>In Active</Text>
  //           )}
  //         </Text>
  //         <Text className="text-sm text-gray-600">
  //           Vehicle Name: {tracker?.vehicle?.name}
  //         </Text>
  //         <Text className="text-sm text-gray-600">
  //           Registration Number: {tracker?.vehicle?.registration_number}
  //         </Text>
  //         <Box>
  //           <Text className="text-md font-bold mt-2">Trip was started at</Text>
  //           <Text className="text-sm text-gray-600">
  //             {parseDateTime(tracker?.createdAt)?.isValid &&
  //               parseDateTime(tracker?.createdAt).toFormat('dd/MM/yy, hh:mm a')}
  //           </Text>
  //         </Box>
  //         <Box>
  //           <Text className="text-md font-bold mt-2">Start Location</Text>
  //           <Text className="text-sm text-gray-600">
  //             {tracker?.started_from?.name}
  //           </Text>
  //         </Box>
  //         <Box>
  //           <Text className="text-md font-bold mt-2">Destination Location</Text>
  //           <Text className="text-sm text-gray-600">
  //             {tracker?.destination?.name}
  //           </Text>
  //         </Box>
  //         {tracker?.active && (
  //           <Box>
  //             <Button onPress={handleUpdateTrackerToInactive}>
  //               <ButtonText>End Trip</ButtonText>
  //             </Button>
  //           </Box>
  //         )}
  //       </Box>
  //     ) : (
  //       <ScrollView>
  //         {map(allTrackersForToday, trk => (
  //           <Box className="flex flex-1 flex-col" key={trk._id}>
  //             <Text className="text-md font-bold mb-1">
  //               Your tracker is currently{' '}
  //               {trk?.active ? (
  //                 <Text className={'text-green-500'}>Active</Text>
  //               ) : (
  //                 <Text className={'text-red-500'}>In Active</Text>
  //               )}
  //             </Text>
  //             <Text className="text-sm text-gray-600">
  //               Vehicle Name: {trk?.vehicle?.name}
  //             </Text>
  //             <Text className="text-sm text-gray-600">
  //               Registration Number: {trk?.vehicle?.registration_number}
  //             </Text>
  //             <Box>
  //               <Text className="text-md font-bold mt-2">
  //                 Trip was started at
  //               </Text>
  //               <Text className="text-sm text-gray-600">
  //                 {parseDateTime(trk?.createdAt)?.isValid &&
  //                   parseDateTime(trk?.createdAt).toFormat('dd/MM/yy, hh:mm a')}
  //               </Text>
  //             </Box>
  //             <Box>
  //               <Text className="text-md font-bold mt-2">Start Location</Text>
  //               <Text className="text-sm text-gray-600">
  //                 {tracker?.started_from?.name}
  //               </Text>
  //             </Box>
  //             <Box>
  //               <Text className="text-md font-bold mt-2">
  //                 Destination Location
  //               </Text>
  //               <Text className="text-sm text-gray-600">
  //                 {trk?.destination?.name}
  //               </Text>
  //             </Box>
  //             {trk?.active && (
  //               <Box>
  //                 <Button onPress={() => handleUpdateTrackerToInactive(trk)}>
  //                   <ButtonText>End Trip</ButtonText>
  //                 </Button>
  //               </Box>
  //             )}
  //           </Box>
  //         ))}
  //       </ScrollView>
  //     )}
  //   </Box>
  // );
};
