import React, {useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../screens/Home';
import Login from '../screens/Login';
import {AuthContext} from '../contexts/AuthContext';
import ProfileDetails from '../screens/ProfileDetails';

const Stack = createNativeStackNavigator();

function Navigation() {
  const {isAuthenticated} = useContext(AuthContext);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="ProfileDetails" component={ProfileDetails} />
          </>
        ) : (
          <Stack.Screen name="Login" component={Login} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;
