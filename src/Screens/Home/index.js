import {AuthContext} from '@/src/contexts/AuthContext';
import {useGetCurrentUserQuery} from '@/src/store/services/userApi';
import {useNavigation} from '@react-navigation/native';
import React, {useContext, useEffect} from 'react';
import {Text, View} from 'react-native';

export function Home() {
  const {userDataLoaded, handleVerifyUserRegistration, currentRole} =
    useContext(AuthContext);
  const navigation = useNavigation();
  const {data} = useGetCurrentUserQuery();
  console.log('home data', data);

  useEffect(() => {
    if (userDataLoaded) {
      handleVerifyUserRegistration(navigation);
    }
  }, [handleVerifyUserRegistration, navigation, userDataLoaded]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (userDataLoaded) {
        handleVerifyUserRegistration(navigation);
      }
    });
    return unsubscribe;
  }, [navigation, handleVerifyUserRegistration, userDataLoaded]);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Home Screen{currentRole}</Text>
    </View>
  );
}
