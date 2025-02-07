import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import React, {useContext} from 'react';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {AuthContext} from '../contexts/AuthContext';
import MonitoringTrackerProvider from '../contexts/MonitoringTrackerContext';
import TrackerProvider from '../contexts/TrackerContext';
import AuthNavigation from './AuthNavigation';
import HomeNavigation from './HomeNavigation';
import SettingNavigation from './SettingNavigation';

const Tab = createBottomTabNavigator();

const screenOptions = ({route}) => ({
  headerShown: false,
  tabBarIcon: ({focused, color, size}) => {
    let iconName;

    if (route.name === 'Home') {
      iconName = 'home';
    } else if (route.name === 'Setting') {
      iconName = 'settings';
    } else if (route.name === 'Road') {
      iconName = 'bus';
    }

    // Return the icon component
    if (iconName === 'bus') {
      return <Ionicons name={iconName} size={size} color={color} />;
    }
    return <Icon name={iconName} size={size} color={color} />;
  },
  tabBarActiveTintColor: 'teal',
  tabBarInactiveTintColor: 'gray',
});
export default function BottomTabNavigation() {
  const {isAuthenticated, userDataLoaded, user} = useContext(AuthContext);
  return (
    <NavigationContainer>
      <TrackerProvider>
        <MonitoringTrackerProvider>
          {isAuthenticated && userDataLoaded && user?._id ? (
            <Tab.Navigator screenOptions={screenOptions}>
              <Tab.Screen name="Home" component={HomeNavigation} />
              {/* <Tab.Screen name="Road" component={Road} /> */}
              <Tab.Screen name="Setting" component={SettingNavigation} />
            </Tab.Navigator>
          ) : (
            <AuthNavigation />
          )}
        </MonitoringTrackerProvider>
      </TrackerProvider>
    </NavigationContainer>
  );
}
