import React from 'react';
import {View, StyleSheet} from 'react-native';
import StartTrip from '../components/StartTrip';

function Home() {
  return (
    <View style={styles.container}>
      <StartTrip />
    </View>
  );
}

export default Home;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    padding: 20,
  },
});
