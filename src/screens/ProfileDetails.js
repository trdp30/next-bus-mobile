import React from 'react';
import Profile from '../components/Profile';
import {gql, useQuery} from '@apollo/client';

const GET_USERS = gql`
  query MyQuery {
    owners {
      id
    }
  }
`;

const ProfileDetails = () => {
  const {loading, error, data} = useQuery(GET_USERS);
  console.log('loading, error, data', loading, error, data);

  return <Profile />;
};

export default ProfileDetails;
