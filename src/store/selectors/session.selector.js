import {createSelector} from '@reduxjs/toolkit';

export const selectSession = state => state.session;
export const selectUser = createSelector(selectSession, state => state.user);
export const selectFbUser = createSelector(
  selectSession,
  state => state.fbUser,
);
