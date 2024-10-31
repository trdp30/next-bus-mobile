import React, {useContext} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {AuthContext} from '../contexts/AuthContext';
import {GoogleSigninButton} from '@react-native-google-signin/google-signin';

const Login = ({navigation}) => {
  const {signInWithGoogle, isAuthenticating} = useContext(AuthContext);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigation.navigate('Home');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={handleGoogleSignIn}
        disabled={isAuthenticating}
      />
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
