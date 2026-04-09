// slices/hireApiSlice.js
import { apiSlice } from './apiSlice';

const HIRE_URL = '/hire';

export const hireApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTalents: builder.query({
      query: ({ page = 1, limit = 10, search = '', skill = '', location = '' }) => {
        const params = new URLSearchParams();
        if (page) params.append('page', page);
        if (limit) params.append('limit', limit);
        if (search) params.append('search', search);
        if (skill) params.append('skill', skill);
        if (location) params.append('location', location);
        
        return {
          url: `${HIRE_URL}/talents?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Talent'],
    }),
    
    getTalentById: builder.query({
      query: (id) => ({
        url: `${HIRE_URL}/talent/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Talent', id }],
    }),
    
    getFeaturedTalents: builder.query({
      query: (limit = 6) => ({
        url: `${HIRE_URL}/talents/featured?limit=${limit}`,
        method: 'GET',
      }),
      providesTags: ['Talent'],
    }),
    
    getTalentsBySkill: builder.query({
      query: ({ skill, page = 1, limit = 10 }) => ({
        url: `${HIRE_URL}/talents/skill/${skill}?page=${page}&limit=${limit}`,
        method: 'GET',
      }),
      providesTags: ['Talent'],
    }),
    
    generateWhatsAppMessage: builder.mutation({
      query: (data) => ({
        url: `${HIRE_URL}/message`,
        method: 'POST',
        body: data,
      }),
    }),
    
    getTalentContact: builder.query({
      query: (id) => ({
        url: `${HIRE_URL}/talent/${id}/contact`,
        method: 'GET',
      }),
    }),
    
    searchTalents: builder.mutation({
      query: (searchParams) => ({
        url: `${HIRE_URL}/talents/search`,
        method: 'POST',
        body: searchParams,
      }),
    }),
    
    getHireStats: builder.query({
      query: () => ({
        url: `${HIRE_URL}/stats`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetTalentsQuery,
  useGetTalentByIdQuery,
  useGetFeaturedTalentsQuery,
  useGetTalentsBySkillQuery,
  useGenerateWhatsAppMessageMutation,
  useGetTalentContactQuery,
  useSearchTalentsMutation,
  useGetHireStatsQuery,
} = hireApiSlice;