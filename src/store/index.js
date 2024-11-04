import {configureStore} from '@reduxjs/toolkit';
import {setupListeners} from '@reduxjs/toolkit/query';
import {userApi} from './services/userApi';
import {sessionSlice} from './slices/session';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas/index.saga';
import logger from 'redux-logger';
import {trackerApi} from './services/trackerApi';
import {vehicleApi} from './services/vehicleApi';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [sessionSlice.name]: sessionSlice.reducer,
    [trackerApi.reducerPath]: trackerApi.reducer,
    [vehicleApi.reducerPath]: vehicleApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware()
      .concat(logger)
      .concat(sagaMiddleware)
      .concat(userApi.middleware)
      .concat(trackerApi.middleware)
      .concat(vehicleApi.middleware),
});

sagaMiddleware.run(rootSaga);

setupListeners(store.dispatch);
