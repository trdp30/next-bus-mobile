import {createSelector} from '@reduxjs/toolkit';

export const selectSession = state => state.session;
export const selectUser = createSelector(selectSession, state => state.user);
export const selectFbUser = createSelector(
  selectSession,
  state => state.fbUser,
);
export const selectDriver = createSelector(
  selectSession,
  state => state.driver,
);

export const selectOwner = createSelector(selectSession, state => state.owner);

export const selectTracker = createSelector(
  selectSession,
  state => state.tracker,
);

export const selectVehicle = createSelector(
  selectSession,
  state => state.vehicle,
);
