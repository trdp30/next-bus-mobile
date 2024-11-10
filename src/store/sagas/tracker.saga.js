import {catchError} from '@/src/utils/catchError';
import {formatLocation, getCurrentPosition} from '@/src/utils/locationHelper';
import Geolocation from '@react-native-community/geolocation';
import {END, eventChannel} from 'redux-saga';
import {
  call,
  cancelled,
  debounce,
  fork,
  put,
  select,
  take,
  takeLatest,
} from 'redux-saga/effects';
import {
  selectCurrentLocation,
  selectTracker,
} from '../selectors/session.selector';
import {trackerApi} from '../services/trackerApi';
import {
  locationChangeWatcherStarted,
  locationChangeWatcherStopped,
  startLocationChangeWatcher,
  stopLocationChangeWatcher,
  updateCurrentLocation,
  updateTrackerLogs,
} from '../slices/session';

const clearWatch = subscriptionId => {
  subscriptionId !== null && Geolocation.clearWatch(subscriptionId);
  // clearInterval(subscriptionId);
};

function locationWatcherChannel() {
  return eventChannel(emitter => {
    // const subscriptionId = setInterval(() => {
    //   getCurrentPosition({
    //     onSuccess: position => {
    //       emitter(position);
    //     },
    //     onError: error => {
    //       console.log('getCurrentPosition Error', JSON.stringify(error));
    //       emitter(END);
    //     },
    //   });
    // }, 10000);
    const subscriptionId = Geolocation.watchPosition(
      position => {
        getCurrentPosition({
          onSuccess: location => {
            emitter({...position, ...location});
          },
          onError: error => {
            console.log('getCurrentPosition Error', JSON.stringify(error));
            emitter(END);
          },
        });
      },
      error => {
        console.log('WatchPosition Error', JSON.stringify(error));
        emitter(END);
      },
    );
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
      let location = yield take(locationChannel);
      const tracker = yield select(selectTracker);
      yield put(updateTrackerLogs({location: formatLocation(location)}));
      yield put(
        trackerApi.endpoints.updateTrackerLog.initiate({
          id: tracker?._id,
          location,
        }),
      );
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

function* uploadTrackerLogsWorker() {
  try {
    const tracker = yield select(selectTracker);
    const location = yield select(selectCurrentLocation);
    console.log('api call', tracker, location);
    if (selectTracker?._id && location) {
      yield put(
        trackerApi.endpoints.updateTrackerLog.initiate({
          id: tracker?._id,
          location,
        }),
      );
    }
  } catch (error) {
    yield call(catchError, error);
  }
}

function* startLocationWatcher() {
  yield takeLatest(startLocationChangeWatcher.type, startLocationWorker);
}

function* stopLocationWatcher() {
  yield takeLatest(stopLocationChangeWatcher.type, stopLocationWorker);
}

function* uploadTrackerLogsWatcher() {
  yield debounce(10000, updateCurrentLocation.type, uploadTrackerLogsWorker);
}

export function* trackerRootSaga() {
  yield fork(startLocationWatcher);
  yield fork(stopLocationWatcher);
  yield fork(uploadTrackerLogsWatcher);
}
