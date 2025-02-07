import {createApi} from '@reduxjs/toolkit/query/react';
import baseQuery from './baseQuery';

export const trackerApi = createApi({
  reducerPath: 'trackerApi',
  baseQuery: baseQuery,
  tagTypes: ['Trackers'],
  endpoints: build => ({
    getTrackerById: build.query({
      query: trackerId => `tracker/${trackerId}`,
      providesTags: result =>
        result ? [{type: 'Trackers', id: result?._id}] : ['Trackers'],
    }),
    getTrackers: build.query({
      query: queryParams => ({
        url: 'tracker',
        params: queryParams,
      }),
      providesTags: result =>
        result
          ? [
              ...result.map(({_id}) => ({type: 'Trackers', id: _id})),
              {type: 'Trackers', id: 'LIST'},
            ]
          : [{type: 'Trackers', id: 'LIST'}],
    }),
    subscribeTrackers: build.query({
      query: queryParams => ({
        url: 'tracker/subscribe',
        params: queryParams,
      }),
      providesTags: result =>
        result
          ? [
              ...result.map(({_id}) => ({type: 'Trackers', id: _id})),
              {type: 'Trackers', id: 'LIST'},
            ]
          : [{type: 'Trackers', id: 'LIST'}],
      transformResponse: response => response,
    }),
    updateTrackerActive: build.mutation({
      query({id, ...payload}) {
        return {
          url: `tracker/${id}`,
          method: 'PUT',
          body: payload,
        };
      },
      invalidatesTags: (result, error, arg) => [
        {type: 'Trackers', id: arg._id},
      ],
    }),
    createTracker: build.mutation({
      query: payload => ({
        url: 'tracker',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Trackers'],
    }),
  }),
});

export const {
  useGetTrackerByIdQuery,
  useCreateTrackerMutation,
  useGetTrackersQuery,
  useLazyGetTrackersQuery,
  useUpdateTrackerActiveMutation,
  useSubscribeTrackersQuery,
} = trackerApi;
