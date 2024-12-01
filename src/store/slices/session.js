// import {getIsoGetStartOfDay} from '@/src/utils/dateHelpers';
// import {formatLocation} from '@/src/utils/locationHelper';
import {createSlice} from '@reduxjs/toolkit';
// import {trackerApi} from '../services/trackerApi';
import {userApi} from '../services/userApi';

const initialState = {
  fbUser: null,
  user: null,
  driver: null,
  tracker: null,
  owner: null,
  vehicle: null,
  role: null,
  currentLocation: null,
  // date: getIsoGetStartOfDay(),
  isLocationChangeWatcherActive: false,
  userDataLoaded: false,
};

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    authenticated: (state, action) => {
      state.fbUser = action.payload;
      // state.userDataLoaded = false;
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
    getCurrentUserLoaded: state => {
      debugger;
      state.userDataLoaded = true;
    },
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
        // date: action.payload.date || getIsoGetStartOfDay(),
        started_from: action.payload.started_from,
        destination: action.payload.destination,
      };
    },
    startLocationChangeWatcher: () => {},
    locationChangeWatcherStarted: state => {
      state.isLocationChangeWatcherActive = true;
    },
    stopLocationChangeWatcher: () => {},
    locationChangeWatcherStopped: state => {
      state.isLocationChangeWatcherActive = false;
    },
    updateTrackerLogs: (state, action) => {
      if (Array.isArray(state.tracker.trackerLogs)) {
        state.tracker.trackerLogs.push(action.payload);
      } else {
        state.tracker.trackerLogs = [action.payload];
      }
    },
    updateCurrentLocation: (state, action) => {
      // state.currentLocation = formatLocation(action.payload);
    },
  },
  extraReducers: builder => {
    builder.addMatcher(
      userApi.endpoints.getCurrentUser.matchFulfilled,
      (state, {payload}) => {
        state.user = payload;
      },
    );
    // .addMatcher(
    //   trackerApi.endpoints.createTracker.matchFulfilled,
    //   (state, {payload}) => {
    //     state.tracker = payload;
    //   },
    // )
    // .addMatcher(
    //   trackerApi.endpoints.findTracker.matchFulfilled,
    //   (state, {payload}) => {
    //     state.tracker = Array.isArray(payload) ? payload[0] : payload;
    //   },
    // );
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
  startLocationChangeWatcher,
  locationChangeWatcherStarted,
  stopLocationChangeWatcher,
  locationChangeWatcherStopped,
  updateTrackerLogs,
  updateCurrentLocation,
} = sessionSlice.actions;

export default sessionSlice.reducer;
