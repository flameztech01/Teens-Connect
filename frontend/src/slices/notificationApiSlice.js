// slices/notificationsApiSlice.js
import { apiSlice } from './apiSlice';

const NOTIFICATIONS_URL = '/notifications';

export const notificationsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get user notifications
    getUserNotifications: builder.query({
      query: ({ page = 1, limit = 20 } = {}) => {
        const params = new URLSearchParams();
        if (page) params.append('page', page);
        if (limit) params.append('limit', limit);
        
        return {
          url: `${NOTIFICATIONS_URL}/user?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Notifications'],
    }),

    // Get admin notifications
    getAdminNotifications: builder.query({
      query: ({ page = 1, limit = 20 } = {}) => {
        const params = new URLSearchParams();
        if (page) params.append('page', page);
        if (limit) params.append('limit', limit);
        
        return {
          url: `${NOTIFICATIONS_URL}/admin?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Notifications'],
    }),

    // Get unread count for user
    getUserUnreadCount: builder.query({
      query: () => ({
        url: `${NOTIFICATIONS_URL}/user/unread-count`,
        method: 'GET',
      }),
      providesTags: ['Notifications'],
    }),

    // Get unread count for admin
    getAdminUnreadCount: builder.query({
      query: () => ({
        url: `${NOTIFICATIONS_URL}/admin/unread-count`,
        method: 'GET',
      }),
      providesTags: ['Notifications'],
    }),

    // Get notification preferences
    getNotificationPreferences: builder.query({
      query: () => ({
        url: `${NOTIFICATIONS_URL}/preferences`,
        method: 'GET',
      }),
      providesTags: ['NotificationPreferences'],
    }),

    // Update notification preferences
    updateNotificationPreferences: builder.mutation({
      query: (preferences) => ({
        url: `${NOTIFICATIONS_URL}/preferences`,
        method: 'PUT',
        body: preferences,
      }),
      invalidatesTags: ['NotificationPreferences'],
    }),

    // Toggle sound
    toggleSound: builder.mutation({
      query: () => ({
        url: `${NOTIFICATIONS_URL}/toggle-sound`,
        method: 'PUT',
      }),
      invalidatesTags: ['NotificationPreferences'],
    }),

    // Toggle push notifications
    togglePushNotifications: builder.mutation({
      query: () => ({
        url: `${NOTIFICATIONS_URL}/toggle-push`,
        method: 'PUT',
      }),
      invalidatesTags: ['NotificationPreferences'],
    }),

    // Mark single notification as read
    markNotificationAsRead: builder.mutation({
      query: (id) => ({
        url: `${NOTIFICATIONS_URL}/${id}/read`,
        method: 'PUT',
      }),
      invalidatesTags: ['Notifications'],
    }),

    // Mark all user notifications as read
    markAllUserNotificationsAsRead: builder.mutation({
      query: () => ({
        url: `${NOTIFICATIONS_URL}/user/read-all`,
        method: 'PUT',
      }),
      invalidatesTags: ['Notifications'],
    }),

    // Mark all admin notifications as read
    markAllAdminNotificationsAsRead: builder.mutation({
      query: () => ({
        url: `${NOTIFICATIONS_URL}/admin/read-all`,
        method: 'PUT',
      }),
      invalidatesTags: ['Notifications'],
    }),

    // Delete single notification
    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `${NOTIFICATIONS_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notifications'],
    }),

    // Delete all user notifications
    deleteAllUserNotifications: builder.mutation({
      query: () => ({
        url: `${NOTIFICATIONS_URL}/user/delete-all`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notifications'],
    }),

    // Delete all admin notifications
    deleteAllAdminNotifications: builder.mutation({
      query: () => ({
        url: `${NOTIFICATIONS_URL}/admin/delete-all`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notifications'],
    }),

    // Subscribe to push notifications
    subscribeToPush: builder.mutation({
      query: (subscriptionData) => ({
        url: `${NOTIFICATIONS_URL}/subscribe`,
        method: 'POST',
        body: subscriptionData,
      }),
    }),

    // Unsubscribe from push notifications
    unsubscribeFromPush: builder.mutation({
      query: () => ({
        url: `${NOTIFICATIONS_URL}/unsubscribe`,
        method: 'POST',
      }),
    }),
  }),
});

// Export hooks
export const {
  // Queries
  useGetUserNotificationsQuery,
  useGetAdminNotificationsQuery,
  useGetUserUnreadCountQuery,
  useGetAdminUnreadCountQuery,
  useGetNotificationPreferencesQuery,
  
  // Mutations
  useUpdateNotificationPreferencesMutation,
  useToggleSoundMutation,
  useTogglePushNotificationsMutation,
  useMarkNotificationAsReadMutation,
  useMarkAllUserNotificationsAsReadMutation,
  useMarkAllAdminNotificationsAsReadMutation,
  useDeleteNotificationMutation,
  useDeleteAllUserNotificationsMutation,
  useDeleteAllAdminNotificationsMutation,
  useSubscribeToPushMutation,
  useUnsubscribeFromPushMutation,
} = notificationsApiSlice;