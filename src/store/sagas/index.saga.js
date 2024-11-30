import {fork} from 'redux-saga/effects';
import {sessionSaga} from './session.saga';
// import {trackerRootSaga} from './tracker.saga';

export default function* rootSaga() {
  yield fork(sessionSaga);
  // yield fork(trackerRootSaga);
}
