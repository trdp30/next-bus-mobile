import {catchError} from '@/src/utils/catchError';
import {createApi} from '@reduxjs/toolkit/query/react';
import {getCurrentUserLoaded} from '../slices/session';
import baseQuery from './baseQuery';

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
        try {
          const {data} = await queryFulfilled;
          if (data) {
            dispatch(getCurrentUserLoaded(data));
          }
        } catch (error) {
          catchError(error);
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

export const {
  useGetCurrentUserQuery,
  useGetUserByIdQuery,
  useLazyGetUserByIdQuery,
} = userApi;
