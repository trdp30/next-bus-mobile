import {MonitoringTrackerContext} from '@/src/contexts/MonitoringTrackerContext';
import {map} from 'lodash';
import React, {Fragment, useContext} from 'react';
import {Marker} from 'react-native-maps';
import TravelerImage from '../../assets/traveler_xs.png';

export const ObservingVehicleMarker = () => {
  const {monitoringTrackerLocations} = useContext(MonitoringTrackerContext);
  return (
    <>
      {map(monitoringTrackerLocations, monitoringTracker => (
        <Fragment key={monitoringTracker?._id}>
          {monitoringTracker?.location?.latitude &&
          monitoringTracker?.location?.longitude ? (
            <Marker
              key={monitoringTracker?._id}
              coordinate={{
                latitude: monitoringTracker?.location?.latitude,
                longitude: monitoringTracker?.location?.longitude,
              }}
              title={`${monitoringTracker?.vehicle?.name}, ${monitoringTracker?.vehicle?.registration_number}`}
              image={TravelerImage}
              rotation={monitoringTracker?.location?.heading}
            />
          ) : (
            <></>
          )}
        </Fragment>
      ))}
    </>
  );
};
