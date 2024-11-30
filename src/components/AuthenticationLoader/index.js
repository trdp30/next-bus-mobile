import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import LoginLogo from '../LoginLogo';

export default function AuthenticationLoader() {
  return (
    <View style={styles.container}>
      <LoginLogo style={styles.logo} />
      <View style={styles.loaderText}>
        <Text>Authenticating...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    height: '20%',
    width: '30%',
  },
  loaderText: {
    position: 'absolute',
    bottom: '15%',
  },
});
