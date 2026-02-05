import {apiSlice} from './apiSlice';

const USER_URL = '/users';

export const userApiSlice = apiSlice.injecEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (data) => ({
                url: `${USER_URL}/register/`,
                method: 'POST',
                body: data,
            })
        })
    })
})