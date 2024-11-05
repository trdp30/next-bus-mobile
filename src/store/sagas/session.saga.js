import {call, fork, put, select, takeLatest} from 'redux-saga/effects';
import {
  authenticated,
  getCurrentUserLoaded,
  storeUserRole,
} from '../slices/session';
import {userApi} from '../services/userApi';
import {catchError} from '../../utils/catchError';
import {selectUser} from '../selectors/session.selector';
import {getCurrentRole} from '../../utils/roles';
import {vehicleApi} from '../services/vehicleApi';

function* authenticatedWorker() {
  try {
    yield put(userApi.endpoints.getCurrentUser.initiate());
  } catch (error) {
    yield call(catchError, error);
  }
}

function* authenticatedWatcher() {
  yield takeLatest(authenticated.type, authenticatedWorker);
}

function* currentUserWorker() {
  try {
    const user = yield select(selectUser);
    const currentRole = yield call(getCurrentRole, user);
    yield put(storeUserRole(currentRole));
    /*
      todo: fetch all the vehicle own by the owner or by the driver.
      if the current user
      - owner: load all the vehicles owned by the user. load all the drivers linked to the vehicles
      - driver: load all the vehicles where current user is driver
    */
    yield put(vehicleApi.endpoints.getVehicles.initiate());
  } catch (error) {
    yield call(catchError, error);
  }
}

function* currentUserWatcher() {
  yield takeLatest(getCurrentUserLoaded, currentUserWorker);
}

export function* sessionSaga() {
  yield fork(authenticatedWatcher);
  yield fork(currentUserWatcher);
}