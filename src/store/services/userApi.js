import {createApi} from '@reduxjs/toolkit/query/react';
import baseQuery from './baseQuery';
import {getCurrentUserLoaded} from '../slices/session';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQuery,
  tagTypes: ['Users'],
  endpoints: build => ({
    getCurrentUser: build.query({
      query: () => 'user/me',
      providesTags: result =>
        result ? [{type: 'Users', id: result?._id}] : ['Users'],
      onQueryStarted: async (id, {dispatch, queryFulfilled}) => {
        const {data} = await queryFulfilled;
        if (data) {
          dispatch(getCurrentUserLoaded(data));
        }
      },
    }),
    getUserById: build.query({
      query: userId => `user/${userId}`,
      providesTags: result =>
        result ? [{type: 'Users', id: result?._id}] : ['Users'],
    }),
    getUsers: build.query({
      query: queryParams => ({
        url: 'user',
        params: queryParams,
      }),
      providesTags: result =>
        result
          ? [
              ...result.map(({_id}) => ({type: 'Users', id: _id})),
              {type: 'Users', id: 'LIST'},
            ]
          : [{type: 'Users', id: 'LIST'}],
    }),
    updateUser: build.mutation({
      query({id, ...payload}) {
        return {
          url: `user/${id}`,
          method: 'PUT',
          body: payload,
        };
      },
      invalidatesTags: (result, error, arg) => [{type: 'Users', id: arg.id}],
    }),
    createUser: build.mutation({
      query: payload => ({
        url: 'user',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Users'],
    }),
  }),
});

export const {useGetCurrentUserQuery} = userApi;
