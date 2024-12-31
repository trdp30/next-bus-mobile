import {last} from 'lodash';

export const mergeTrackerDataToBeStored = ({response = {}, tracker = {}}) => {
  const {active, trackerLogs, isPrivate, updatedAt} = response;
  return {
    ...tracker,
    active,
    isPrivate,
    updatedAt,
    trackerLogs: [last(trackerLogs)],
  };
};
