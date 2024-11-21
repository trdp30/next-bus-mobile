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
            {/*
            Registration follow
            1: Once user login, if the user have not selected the current role previously, then redirect to the role selection page.
            2: If the user have selected the role previously, then redirect to the role specific screen.
            3: If owner -> show the vehicle list screen.
            4: If driver ->
                - If owner already assign a vehicle for the day to the driver then land directly to the tracker screen.
                - If owner have not assign a vehicle for the day to the driver then land to the vehicle list screen.(vehicle assigned to the driver)
            5: If passenger -> show the select vehicle type screen. Where user can select what type of vehicle he/she want to track.
          */}
            {/*
            Owner follow
            1: Show the vehicle list screen.
            2: Show the add vehicle screen.
            3: Show the driver list screen.
            4: Show the add driver screen.
            5: Show the vehicle tracker screen.

            1: Show the vehicle list screen.
               - Show the vehicle list what owner have added.
               - Show the add vehicle button.
            2: Show the add vehicle screen.
                - Show the form to add the vehicle.
                - Once the vehicle is added, show to option to add driver and add another vehicle button and redirect to the vehicle list screen.
                - Show a button to navigate to the tracker screen, where owner can track the his added vehicles.
            3: Once the owner click on a vehicle from the vehicle list, show the driver list screen.
                - Where owner can see the driver list and can add new driver. From there owner can select and confirm a driver for the day.
                - Once confirm the tracker data should get created.
                - Once this is done, redirect to the vehicle list.
                - In the vehicle list, show a button to navigate to the tracker screen, where owner can track the his added vehicles.
                - Vehicle of the owner only can be seen in the tracker screen if the tracker is created for the vehicle for the day.
                - In the vehicle list view we have to show label that the vehicle is in the running mode. Nothing but if the tracker is created for the vehicle show the label.
          */}
            {/*
            Driver follow.
            1: Show the vehicle list screen.
              - If tracker is already created for the day for the driver from the owner, then redirected to the tracker screen and show a start trip button at the button.
              - If tracker is not created for the day for the driver from the owner, then show the vehicle list screen.
              - If only one vehicle present in the list, then directly show the tracker screen and show the start strip button.
          */}
            {/* Passenger follow */}
            {/* Admin follow */}
            {/* <Stack.Screen name="Registration" component={Registration} />
            <Stack.Screen name="Vehicle" component={Vehicles} />
            <Stack.Screen name="AddVehicle" component={AddVehicles} /> */}
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
