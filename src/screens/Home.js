import React, {useContext} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {LocationContext} from '../contexts/LocationContext';
import LogoutButton from '../components/LogoutButton';

function Home() {
  const {isLocationEnabled} = useContext(LocationContext);
  return (
    <View style={styles.container}>
      <Text>Location: {isLocationEnabled ? 'Enabled' : 'Disabled'}</Text>
      <LogoutButton />
    </View>
  );
}

export default Home;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
  },
});
