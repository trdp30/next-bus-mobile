import {getStartOfDay} from '@/src/utils/dateHelpers';
import {createSlice} from '@reduxjs/toolkit';
import {trackerApi} from '../services/trackerApi';
import {userApi} from '../services/userApi';

const initialState = {
  fbUser: null,
  user: null,
  driver: null,
  tracker: null,
  owner: null,
  vehicle: null,
  role: null,
  date: getStartOfDay(new Date()),
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
    getCurrentUserLoaded: () => {},
    storeUserRole: (state, action) => {
      state.role = action.payload;
    },
    storeTrackerRelatedDetails: (state, action) => {
      state.vehicle = action.payload.vehicle;
      state.driver = action.payload.driver;
      state.tracker = {
        _id: action.payload._id,
        trackerLogs: action.payload.trackerLogs || [],
        driver: action.payload.driver,
        vehicle: action.payload.vehicle,
        date: action.payload.date || getStartOfDay(new Date()),
        started_from: action.payload.started_from,
        destination: action.payload.destination,
      };
    },
  },
  extraReducers: builder => {
    builder
      .addMatcher(
        userApi.endpoints.getCurrentUser.matchFulfilled,
        (state, {payload}) => {
          state.user = payload;
        },
      )
      .addMatcher(
        trackerApi.endpoints.createTracker.matchFulfilled,
        (state, {payload}) => {
          state.tracker = payload;
        },
      )
      .addMatcher(
        trackerApi.endpoints.findTracker.matchFulfilled,
        (state, {payload}) => {
          state.tracker = Array.isArray(payload) ? payload[0] : payload;
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
  getCurrentUserLoaded,
  storeUserRole,
  storeTrackerRelatedDetails,
} = sessionSlice.actions;

export default sessionSlice.reducer;
