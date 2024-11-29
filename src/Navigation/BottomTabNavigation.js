import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {Home} from '../Screens/Home';
import {Road} from '../Screens/Road';
import {Settings} from '../Screens/Setting';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{headerShown: false}}>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Setting" component={Settings} />
        <Tab.Screen name="Road" component={Road} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
