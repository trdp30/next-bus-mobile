import React from 'react';
import {StyleSheet, Text, View, Alert, Button} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

export default function GetCurrentLocationExample({location, setLocation}) {
  const getCurrentPosition = () => {
    Geolocation.getCurrentPosition(
      pos => {
        setLocation(JSON.stringify(pos));
      },
      error => Alert.alert('GetCurrentPosition Error', JSON.stringify(error)),
      {enableHighAccuracy: true},
    );
  };

  console.log('position', location);

  return (
    <View>
      <Text>
        <Text style={styles.title}>Current position: </Text>
        {JSON.stringify(location)}
      </Text>
      <Button title="Get Current Position" onPress={getCurrentPosition} />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: '500',
  },
});
