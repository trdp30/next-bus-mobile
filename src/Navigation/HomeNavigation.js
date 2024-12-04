import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {Home} from '../Screens/Home';
import Register from '../Screens/Register';

const Stack = createNativeStackNavigator({});

export default function HomeNavigation() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Dashboard" component={Home} />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  );
}
