// slices/adminApiSlice.js
import { apiSlice } from './apiSlice';

const ADMIN_URL = '/admin';

export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    adminLogin: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/login`,
        method: 'POST',
        body: data,
      }),
    }),
    adminLogout: builder.mutation({
      query: () => ({
        url: `${ADMIN_URL}/logout`,
        method: 'POST',
      }),
    }),
    getAdminProfile: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/profile`,
        method: 'GET',
      }),
      providesTags: ['Admin'],
    }),
  }),
});

export const {
  useAdminLoginMutation,
  useAdminLogoutMutation,
  useGetAdminProfileQuery,
} = adminApiSlice;