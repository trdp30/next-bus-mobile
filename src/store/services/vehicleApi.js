import {createApi} from '@reduxjs/toolkit/query/react';
import baseQuery from './baseQuery';

export const vehicleApi = createApi({
  reducerPath: 'vehicleApi',
  baseQuery: baseQuery,
  tagTypes: ['Vehicle'],
  endpoints: build => ({
    getVehicleIdById: build.query({
      query: vehicleId => `vehicle/${vehicleId}`,
      providesTags: result =>
        result ? [{type: 'Vehicle', id: result?._id}] : ['Vehicle'],
    }),
    getVehicles: build.query({
      query: queryParams => ({
        url: 'vehicle',
        params: queryParams,
      }),
      providesTags: result =>
        result
          ? [
              ...result.map(({_id}) => ({type: 'Vehicle', id: _id})),
              {type: 'Vehicle', id: 'LIST'},
            ]
          : [{type: 'Vehicle', id: 'LIST'}],
    }),
    updateVehicle: build.mutation({
      query({id, ...payload}) {
        return {
          url: `vehicle/${id}`,
          method: 'PUT',
          body: payload,
        };
      },
      invalidatesTags: (result, error, arg) => [{type: 'Vehicle', id: arg.id}],
    }),
    createVehicle: build.mutation({
      query: payload => ({
        url: 'vehicle',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Vehicle'],
    }),
  }),
});

export const {useGetVehiclesQuery} = vehicleApi;
