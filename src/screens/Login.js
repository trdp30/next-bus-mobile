import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {Button} from 'native-base';

const Login = ({navigation}) => {
  // useEffect(() => {
  //   GoogleSignin.configure({
  //     // Your Google Cloud Platform configuration here
  //   });
  // }, []);

  const handleGoogleSignIn = async () => {
    try {
      navigation.navigate('Home');
      //   await GoogleSignin.signIn();
      //   const currentUser = await GoogleSignin.getCurrentUser();
      //   console.log(currentUser);
      // Handle user information and navigation to the next screen
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <Button onPress={handleGoogleSignIn}>Sign in with Google</Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default Login;
