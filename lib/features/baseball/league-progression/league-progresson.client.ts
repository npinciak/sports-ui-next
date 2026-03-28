import { LeagueProgression } from '@/lib/models';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const LeagueProgressionClient = createApi({
  reducerPath: 'leagueProgressionClient',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['LeagueProgression'],
  endpoints: builder => ({
    getLeagueProgression: builder.query<{ data: LeagueProgression[] }, void>({
      query: () => '/league-progression',
      providesTags: ['LeagueProgression'],
    }),
  }),
});
