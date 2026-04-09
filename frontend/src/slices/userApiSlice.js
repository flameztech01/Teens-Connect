import { apiSlice } from './apiSlice';

const USER_URL = '/users';

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Google Signup with file uploads
    googleSignup: builder.mutation({
      query: (formData) => ({
        url: `${USER_URL}/google/signup`,
        method: 'POST',
        body: formData,
        formData: true, // Important for file uploads
      }),
    }),

    // Google Login
    googleLogin: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/google/login`,
        method: 'POST',
        body: data,
      }),
    }),

    // Get user by ID
    getUserById: builder.query({
      query: (id) => ({
        url: `${USER_URL}/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),

    // Get all users
    getUsers: builder.query({
      query: ({ page = 1, limit = 10, search = '', role = '', authMethod = '' } = {}) => {
        const params = new URLSearchParams();
        if (page) params.append('page', page);
        if (limit) params.append('limit', limit);
        if (search) params.append('search', search);
        if (role) params.append('role', role);
        if (authMethod) params.append('authMethod', authMethod);
        
        return {
          url: `${USER_URL}?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: (result) => 
        result
          ? [
              ...result.users.map(({ _id }) => ({ type: 'User', id: _id })),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),

    // Update profile with file uploads
    updateProfile: builder.mutation({
      query: (formData) => ({
        url: `${USER_URL}/profile`,
        method: 'PUT',
        body: formData,
        formData: true,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],
    }),

    // Logout
    logout: builder.mutation({
      query: () => ({
        url: `${USER_URL}/logout`,
        method: 'POST',
      }),
    }),

    // Delete account
    deleteAccount: builder.mutation({
      query: () => ({
        url: `${USER_URL}/account`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGoogleSignupMutation,
  useGoogleLoginMutation,
  useGetUserByIdQuery,
  useGetUsersQuery,
  useUpdateProfileMutation,
  useLogoutMutation,
  useDeleteAccountMutation,
} = userApiSlice;