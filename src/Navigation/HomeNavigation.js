import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import CollectPermission from '../Screens/CollectPermission';
import {Home} from '../Screens/Home';
import SelectTripType from '../Screens/SelectTripType';
import StartPublicTrip from '../Screens/StartPublicTrip';

const Stack = createNativeStackNavigator({});

export default function HomeNavigation() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Dashboard" component={Home} />
      <Stack.Screen name="SelectTripType" component={SelectTripType} />
      <Stack.Screen name="StartPublicTrip" component={StartPublicTrip} />
      <Stack.Screen name="CollectPermission" component={CollectPermission} />
    </Stack.Navigator>
  );
}
