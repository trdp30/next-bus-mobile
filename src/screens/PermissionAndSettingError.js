import React, {useContext} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import {openSettings} from 'react-native-permissions';
import {LocationContext} from '../contexts/LocationContext';
import {catchError} from '../utils/catchError';

const PermissionAndSettingError = () => {
  const {currentLocationError, reInitiateCheck} = useContext(LocationContext);

  const handleOpenSettings = retry => {
    if (retry) {
      reInitiateCheck();
    } else {
      openSettings().catch(() => catchError('Failed to open settings'));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{String(currentLocationError)}</Text>
        {String(currentLocationError).includes('re-open') ? (
          <>
            <Button
              title="Go setting"
              onPress={() => handleOpenSettings(false)}
            />
            <Button title="Retry" onPress={() => handleOpenSettings(true)} />
          </>
        ) : (
          <>
            <Text>Once done, click here</Text>
            <Button title="Retry" onPress={() => handleOpenSettings(true)} />
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorContainer: {
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default PermissionAndSettingError;
