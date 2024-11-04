import React from 'react';
import Profile from '../components/Profile';
import {useGetCurrentUserQuery} from '../store/services/userApi';

const ProfileDetails = () => {
  const {data, isFetching, isLoading, error} = useGetCurrentUserQuery();
  return <Profile data={data} />;
};

export default ProfileDetails;
