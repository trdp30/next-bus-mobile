import React, {useContext} from 'react';
// import {Button} from 'native-base';
import {Button} from 'react-native';
import {AuthContext} from '../contexts/AuthContext';

const LogoutButton = () => {
  const {signOut} = useContext(AuthContext);
  // return <Button onPress={signOut}>Logout</Button>;
  return <Button onPress={signOut} title="Logout" />;
};

export default LogoutButton;
