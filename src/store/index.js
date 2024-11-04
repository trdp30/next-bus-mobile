import {configureStore} from '@reduxjs/toolkit';
import {setupListeners} from '@reduxjs/toolkit/query';
import {userApi} from './services/userApi';
import {sessionSlice} from './slices/session';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas/index.saga';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [sessionSlice.name]: sessionSlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(sagaMiddleware).concat(userApi.middleware),
});

sagaMiddleware.run(rootSaga);

setupListeners(store.dispatch);
