import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useContext, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import LogoutButton from '../components/LogoutButton';
import StartTrip from '../components/StartTrip';
import {ApplicationContext} from '../contexts/ApplicationContext';
import {useLazyFindTrackerQuery} from '../store/services/trackerApi';

function Home() {
  const {tracker} = useContext(ApplicationContext);
  const [findTracker] = useLazyFindTrackerQuery();

  const navigation = useNavigation();

  const fetchTracker = useCallback(
    async payload => {
      const {vehicle, date} = payload;
      const queryParams = {
        vehicle,
        date,
      };
      const response = await findTracker(queryParams);
      if (response?.error) {
        // Todo: Handle error
      }
    },
    [findTracker],
  );

  useEffect(() => {
    if (tracker?._id) {
      navigation.navigate('Tracker');
    }
  }, [tracker, navigation, fetchTracker]);

  return (
    <View style={styles.container}>
      <StartTrip fetchTracker={fetchTracker} />
      <LogoutButton />
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
