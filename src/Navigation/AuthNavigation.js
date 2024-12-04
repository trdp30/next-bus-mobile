import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useContext} from 'react';
import {AuthContext} from '../contexts/AuthContext';
import Login from '../Screens/Login';
import Register from '../Screens/Register';

const Stack = createNativeStackNavigator({});

export default function AuthNavigation() {
  const {isAuthenticated} = useContext(AuthContext);
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {isAuthenticated ? (
        <Stack.Screen name="Register" component={Register} />
      ) : (
        <Stack.Screen name="Login" component={Login} />
      )}
    </Stack.Navigator>
  );
}
