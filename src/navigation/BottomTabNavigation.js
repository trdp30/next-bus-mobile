import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useContext} from 'react';
import {AuthContext} from '../contexts/AuthContext';
import Home from '../screens/Home';
import Login from '../screens/Login';
import ProfileDetails from '../screens/ProfileDetails';
import Register from '../screens/Register';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const AuthNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export function BottomTabNavigator() {
  const {isAuthenticated} = useContext(AuthContext);
  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <Tab.Navigator>
          <Tab.Screen name="Register" component={Register} />
          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen name="Profile" component={ProfileDetails} />
        </Tab.Navigator>
      ) : (
        <AuthNavigation />
      )}
    </NavigationContainer>
  );
}
