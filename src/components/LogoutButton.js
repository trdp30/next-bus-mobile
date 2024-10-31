import React, {useContext} from 'react';
import {Button} from 'native-base';
import {AuthContext} from '../contexts/AuthContext';

const LogoutButton = () => {
  const {signOut} = useContext(AuthContext);
  return <Button onPress={signOut}>Logout</Button>;
};

export default LogoutButton;
