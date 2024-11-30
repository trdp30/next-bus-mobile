import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {ContactSupport} from '../Screens/ContactSupport';
import {GetHelp} from '../Screens/GetHelp';
import {Profile} from '../Screens/Profile';
import Settings from '../Screens/Setting';

const Stack = createNativeStackNavigator({});

export default function SettingNavigation() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="SettingList" component={Settings} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="GetHelp" component={GetHelp} />
      <Stack.Screen name="ContactSupport" component={ContactSupport} />
    </Stack.Navigator>
  );
}
