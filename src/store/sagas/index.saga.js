import {fork} from 'redux-saga/effects';
import {sessionSaga} from './session.saga';

export default function* rootSaga() {
  yield fork(sessionSaga);
}
