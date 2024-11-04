import {call, fork, put, takeLatest} from 'redux-saga/effects';
import {authenticated} from '../slices/session';
import {userApi} from '../services/userApi';
import {catchError} from '../../utils/catchError';

function* authenticatedWorker() {
  try {
    yield put(userApi.endpoints.getCurrentUser.initiate());
  } catch (error) {
    call(catchError, error);
  }
}

function* authenticatedWatcher() {
  yield takeLatest(authenticated.type, authenticatedWorker);
}

export function* sessionSaga() {
  yield fork(authenticatedWatcher);
}
