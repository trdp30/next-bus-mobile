import {configureStore} from '@reduxjs/toolkit';
import {setupListeners} from '@reduxjs/toolkit/query';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas/index.saga';
// import {placeApi} from './services/placeApi';
// import {trackerApi} from './services/trackerApi';
import {userApi} from './services/userApi';
// import {vehicleApi} from './services/vehicleApi';
import {sessionSlice} from './slices/session';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [sessionSlice.name]: sessionSlice.reducer,
    // [trackerApi.reducerPath]: trackerApi.reducer,
    // [vehicleApi.reducerPath]: vehicleApi.reducer,
    // [placeApi.reducerPath]: placeApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware()
      // .concat(logger)
      .concat(sagaMiddleware)
      .concat(userApi.middleware),
  // .concat(trackerApi.middleware)
  // .concat(vehicleApi.middleware)
  // .concat(placeApi.middleware),
});

sagaMiddleware.run(rootSaga);

setupListeners(store.dispatch);
