import {AuthContext} from '@/src/contexts/AuthContext';
import {useNavigation} from '@react-navigation/native';
import {useContext, useEffect} from 'react';
import {Text, View} from 'react-native';

export function Home() {
  const {userDataLoaded, user, fbUser} = useContext(AuthContext);

  console.log('userDataLoaded, user', userDataLoaded, user, fbUser);
  const navigation = useNavigation();

  useEffect(() => {
    if (userDataLoaded) {
      if (!user) {
        navigation.navigate('Register');
      }
    }
  }, [user, userDataLoaded, navigation]);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Home Screen</Text>
    </View>
  );
}
