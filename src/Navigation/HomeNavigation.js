import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import CollectPermission from '../Screens/CollectPermission';
import {Home} from '../Screens/Home';
import StartTrip from '../Screens/StartTrip';

const Stack = createNativeStackNavigator({});

export default function HomeNavigation() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Dashboard" component={Home} />
      <Stack.Screen name="StartTrip" component={StartTrip} />
      <Stack.Screen name="CollectPermission" component={CollectPermission} />
    </Stack.Navigator>
  );
}
