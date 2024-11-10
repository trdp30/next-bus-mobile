import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useContext} from 'react';
import {AuthContext} from '../contexts/AuthContext';
import Home from '../screens/Home';
import Login from '../screens/Login';
import ProfileDetails from '../screens/ProfileDetails';
import Tracker from '../screens/Tracker';

const Stack = createNativeStackNavigator();

function Navigation() {
  const {isAuthenticated} = useContext(AuthContext);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Tracker" component={Tracker} />
            <Stack.Screen name="ProfileDetails" component={ProfileDetails} />
          </>
        ) : (
          <Stack.Screen
            name="Login"
            component={Login}
            options={{headerShown: false}}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;
