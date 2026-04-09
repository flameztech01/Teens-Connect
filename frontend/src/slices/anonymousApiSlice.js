import { apiSlice } from './apiSlice';

const ANONYMOUS_URL = '/anonymous';

export const anonymousApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create anonymous post (with media upload)
    createAnonymousPost: builder.mutation({
      query: (formData) => ({
        url: `${ANONYMOUS_URL}/post`,
        method: 'POST',
        body: formData,
        formData: true,
      }),
      invalidatesTags: ['Anonymous'],
    }),

    // Get user's own anonymous posts
    getMyAnonymousPosts: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => {
        const params = new URLSearchParams();
        if (page) params.append('page', page);
        if (limit) params.append('limit', limit);
        
        return {
          url: `${ANONYMOUS_URL}/my-posts?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Anonymous'],
    }),

    // Get all anonymous posts (Admin only)
    getAllAnonymousPosts: builder.query({
      query: ({ page = 1, limit = 20, date = '', isRead = '' } = {}) => {
        const params = new URLSearchParams();
        if (page) params.append('page', page);
        if (limit) params.append('limit', limit);
        if (date) params.append('date', date);
        if (isRead !== '') params.append('isRead', isRead);
        
        return {
          url: `${ANONYMOUS_URL}/admin/all?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Anonymous', 'AdminAnonymous'],
    }),

    // Get unread posts count (Admin)
    getUnreadCount: builder.query({
      query: () => ({
        url: `${ANONYMOUS_URL}/admin/unread-count`,
        method: 'GET',
      }),
      providesTags: ['Anonymous'],
    }),

    // Mark post as read (Admin)
    markAsRead: builder.mutation({
      query: (id) => ({
        url: `${ANONYMOUS_URL}/admin/${id}/read`,
        method: 'PUT',
      }),
      invalidatesTags: ['Anonymous', 'AdminAnonymous'],
    }),

    // View poster info (Admin)
    viewPoster: builder.query({
      query: (id) => ({
        url: `${ANONYMOUS_URL}/admin/${id}/view-poster`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Anonymous', id }],
    }),

    // Share post to WhatsApp (Admin)
    shareToWhatsApp: builder.mutation({
      query: ({ id, whatsappGroupLink, customMessage }) => ({
        url: `${ANONYMOUS_URL}/admin/${id}/share-whatsapp`,
        method: 'POST',
        body: { whatsappGroupLink, customMessage },
      }),
      invalidatesTags: ['Anonymous', 'AdminAnonymous'],
    }),

    // Share poster info to WhatsApp (Admin)
    sharePosterToWhatsApp: builder.mutation({
      query: ({ id, whatsappGroupLink, customMessage }) => ({
        url: `${ANONYMOUS_URL}/admin/${id}/share-poster-whatsapp`,
        method: 'POST',
        body: { whatsappGroupLink, customMessage },
      }),
      invalidatesTags: ['Anonymous', 'AdminAnonymous'],
    }),

    // Delete anonymous post (Admin)
    deleteAnonymousPost: builder.mutation({
      query: (id) => ({
        url: `${ANONYMOUS_URL}/admin/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Anonymous', 'AdminAnonymous'],
    }),
  }),
});

// Export hooks for each endpoint
export const {
  useCreateAnonymousPostMutation,
  useGetMyAnonymousPostsQuery,
  useGetAllAnonymousPostsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useViewPosterQuery,
  useShareToWhatsAppMutation,
  useSharePosterToWhatsAppMutation,
  useDeleteAnonymousPostMutation,
} = anonymousApiSlice;