import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useContext} from 'react';
import {ScrollView} from 'react-native';
import CollectPermission from '../Screens/CollectPermission';
import {Home} from '../Screens/Home';
import {PublicTrip} from '../Screens/PublicTrip';
import SelectTripType from '../Screens/SelectTripType';
import StartPublicTrip from '../Screens/StartPublicTrip';
import ApplicationContext from '../contexts/ApplicationContext';
import {TrackerContext} from '../contexts/TrackerContext';

const Stack = createNativeStackNavigator({});

export default function HomeNavigation() {
  const {showActiveTracker} = useContext(ApplicationContext);
  const {isTrackerActive} = useContext(TrackerContext);

  return (
    <ScrollView
      contentContainerStyle={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        marginBottom: showActiveTracker && isTrackerActive ? 100 : 'auto',
      }}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Dashboard" component={Home} />
        <Stack.Screen name="SelectTripType" component={SelectTripType} />
        <Stack.Screen name="CollectPermission" component={CollectPermission} />
        <Stack.Screen name="StartPublicTrip" component={StartPublicTrip} />
        <Stack.Screen name="PublicTrip" component={PublicTrip} />
      </Stack.Navigator>
    </ScrollView>
  );
}
