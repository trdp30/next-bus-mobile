import {catchError} from '@/src/utils/catchError';
import {
  formatLocation,
  getNewCurrentPosition,
} from '@/src/utils/permissionHelpers';
import {Alert} from 'react-native';
import Config from 'react-native-config';
import {END, eventChannel} from 'redux-saga';
import {
  call,
  cancelled,
  fork,
  put,
  select,
  take,
  takeLatest,
} from 'redux-saga/effects';
import {selectTracker} from '../selectors/session.selector';
import {trackerApi} from '../services/trackerApi';
import {
  locationChangeWatcherStarted,
  locationChangeWatcherStopped,
  startLocationChangeWatcher,
  stopLocationChangeWatcher,
} from '../slices/session';

const clearWatch = subscriptionId => {
  // subscriptionId !== null && Geolocation.clearWatch(subscriptionId);
  clearInterval(subscriptionId);
};

function locationWatcherChannel() {
  return eventChannel(emitter => {
    const subscriptionId = setInterval(() => {
      getNewCurrentPosition()
        .then(position => emitter(formatLocation(position)))
        .catch(error => {
          Alert.alert('Error', JSON.stringify(error));
          emitter(END);
        });
    }, Config.POLLING_INTERVAL);
    // const subscriptionId = Geolocation.watchPosition(
    //   position => {
    //     getCurrentPosition({
    //       onSuccess: location => {
    //         emitter({...position, ...location});
    //       },
    //       onError: error => {
    //         console.log('getCurrentPosition Error', JSON.stringify(error));
    //         emitter(END);
    //       },
    //     });
    //   },
    //   error => {
    //     console.log('WatchPosition Error', JSON.stringify(error));
    //     emitter(END);
    //   },
    // );
    // The subscriber must return an unsubscribe function
    return () => {
      clearWatch(subscriptionId);
    };
  });
}

let locationChannel = null;
function* startLocationWorker() {
  locationChannel = yield call(locationWatcherChannel);
  try {
    while (true) {
      yield put(locationChangeWatcherStarted());
      const location = yield take(locationChannel);
      const tracker = yield select(selectTracker);
      if (tracker?._id && location) {
        // yield put(updateTrackerLogs({location: formatLocation(location)}));
        yield put(
          trackerApi.endpoints.updateTrackerLog.initiate({
            id: tracker?._id,
            location,
          }),
        );
      }
    }
  } catch (error) {
    console.log('startLocationWatcher error caught: ', error);
    yield call(catchError, error);
  } finally {
    if (yield cancelled()) {
      locationChannel.close();
      console.log('startLocationWatcher terminated');
    }
  }
}

function* stopLocationWorker() {
  try {
    console.log('stopLocationWorker called');
    if (locationChannel?.close) {
      locationChannel.close();
    }
    yield put(locationChangeWatcherStopped());
  } catch (error) {
    yield call(catchError, error);
  }
}

// function* uploadTrackerLogsWorker() {
//   try {
//     const tracker = yield select(selectTracker);
//     const location = yield select(selectCurrentLocation);
//     console.log('api call', tracker, location, new Date());
//     if (tracker?._id && location) {
//       yield put(
//         trackerApi.endpoints.updateTrackerLog.initiate({
//           id: tracker?._id,
//           location,
//         }),
//       );
//     }
//   } catch (error) {
//     yield call(catchError, error);
//   }
// }

function* startLocationWatcher() {
  yield takeLatest(startLocationChangeWatcher.type, startLocationWorker);
}

function* stopLocationWatcher() {
  yield takeLatest(stopLocationChangeWatcher.type, stopLocationWorker);
}

// function* uploadTrackerLogsWatcher() {
//   yield debounce(10000, updateCurrentLocation.type, uploadTrackerLogsWorker);
// }

export function* trackerRootSaga() {
  yield fork(startLocationWatcher);
  yield fork(stopLocationWatcher);
  // yield fork(uploadTrackerLogsWatcher);
}
