// slices/apiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_API_URL || ''}/api`,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    // Get admin token from adminAuth slice
    const adminToken = getState().adminAuth?.adminInfo?.token;
    // Get user token from auth slice
    const userToken = getState().auth?.userInfo?.token;
    
    // Prioritize admin token for admin routes
    if (adminToken) {
      headers.set('Authorization', `Bearer ${adminToken}`);
    } 
    // Use user token for regular user routes
    else if (userToken) {
      headers.set('Authorization', `Bearer ${userToken}`);
    }
    
    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['User', 'Anonymous', 'Talent', 'Admin'],
  endpoints: (builder) => ({}),
});