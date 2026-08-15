import { apiSlice } from './apiSlice';

const USER_URL = '/users';

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ============================================
    // EMAIL/PASSWORD AUTHENTICATION
    // ============================================

    // Signup with email and password (sends OTP)
    signup: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/signup`,
        method: 'POST',
        body: data,
      }),
    }),

    // Verify OTP to complete registration
    verifyOTP: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/verify-otp`,
        method: 'POST',
        body: data,
      }),
    }),

    // Resend OTP
    resendOTP: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/resend-otp`,
        method: 'POST',
        body: data,
      }),
    }),

    // Login with email and password
    login: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/login`,
        method: 'POST',
        body: data,
      }),
    }),

    // Forgot password - request OTP
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/forgot-password`,
        method: 'POST',
        body: data,
      }),
    }),

    // Reset password with OTP
    resetPassword: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/reset-password`,
        method: 'POST',
        body: data,
      }),
    }),

    // ============================================
    // GOOGLE OAUTH AUTHENTICATION
    // ============================================

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

    // ============================================
    // USER MANAGEMENT
    // ============================================

    // Get current user profile
    getProfile: builder.query({
      query: () => ({
        url: `${USER_URL}/profile`,
        method: 'GET',
      }),
      providesTags: (result) => [{ type: 'User', id: result?._id || 'PROFILE' }],
    }),

    // Get user by ID
    getUserById: builder.query({
      query: (id) => ({
        url: `${USER_URL}/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),

    // Get all users (admin only)
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

    // Update user role (admin only)
    updateUserRole: builder.mutation({
      query: ({ userId, role }) => ({
        url: `${USER_URL}/${userId}/role`,
        method: 'PUT',
        body: { role },
      }),
      invalidatesTags: (result, error, { userId }) => [{ type: 'User', id: userId }],
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

// ============================================
// EXPORTED HOOKS
// ============================================

export const {
  // Email/Password Auth
  useSignupMutation,
  useVerifyOTPMutation,
  useResendOTPMutation,
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  
  // Google Auth
  useGoogleSignupMutation,
  useGoogleLoginMutation,
  
  // User Management
  useGetProfileQuery,
  useGetUserByIdQuery,
  useGetUsersQuery,
  useUpdateProfileMutation,
  useUpdateUserRoleMutation,
  useLogoutMutation,
  useDeleteAccountMutation,
} = userApiSlice;