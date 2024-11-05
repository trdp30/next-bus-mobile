import {createApi} from '@reduxjs/toolkit/query/react';
import baseQuery from './baseQuery';

export const placeApi = createApi({
  reducerPath: 'placeApi',
  baseQuery: baseQuery,
  tagTypes: ['Place'],
  endpoints: build => ({
    getPlaceIdById: build.query({
      query: placeId => `place/${placeId}`,
      providesTags: result =>
        result ? [{type: 'Place', id: result?._id}] : ['Place'],
    }),
    getPlaces: build.query({
      query: queryParams => ({
        url: 'place',
        params: queryParams,
      }),
      providesTags: result =>
        result
          ? [
              ...result.map(({_id}) => ({type: 'Place', id: _id})),
              {type: 'Place', id: 'LIST'},
            ]
          : [{type: 'Place', id: 'LIST'}],
    }),
    updatePlace: build.mutation({
      query({id, ...payload}) {
        return {
          url: `place/${id}`,
          method: 'PUT',
          body: payload,
        };
      },
      invalidatesTags: (result, error, arg) => [{type: 'Place', id: arg.id}],
    }),
    createPlace: build.mutation({
      query: payload => ({
        url: 'place',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Place'],
    }),
  }),
});

export const {useGetPlacesQuery} = placeApi;
