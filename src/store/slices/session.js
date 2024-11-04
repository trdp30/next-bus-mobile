import {createSlice} from '@reduxjs/toolkit';
import {userApi} from '../services/userApi';

const initialState = {
  fbUser: null,
  user: null,
  driver: null,
  tracker: null,
  owner: null,
  vehicle: null,
};

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    authenticated: (state, action) => {
      state.fbUser = action.payload;
    },
    unauthenticated: () => {
      return initialState;
    },
    setDriver: (state, action) => {
      state.driver = action?.payload;
    },
    setOwner: (state, action) => {
      state.owner = action?.payload;
    },
    setTracker: (state, action) => {
      state.tracker = action?.payload;
    },
    setVehicle: (state, action) => {
      state.vehicle = action?.payload;
    },
  },
  extraReducers: builder => {
    builder.addMatcher(
      userApi.endpoints.getCurrentUser.matchFulfilled,
      (state, {payload}) => {
        state.user = payload;
      },
    );
  },
});

// Action creators are generated for each case reducer function
export const {
  authenticated,
  unauthenticated,
  setDriver,
  setOwner,
  setTracker,
  setVehicle,
} = sessionSlice.actions;

export default sessionSlice.reducer;
