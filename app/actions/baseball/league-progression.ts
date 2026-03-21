'use server';

import { LeagueProgression } from '@/lib/models';
import { Database } from '@/lib/supabase/database.model';
import { createClient } from '@/lib/supabase/server';
import { transformClientLeagueProgressionToLeagueProgression } from '@/lib/transformers/league-progression';

export async function insertLeagueProgression(
  payload: Database['public']['Tables']['league_progression']['Insert'][]
): Promise<LeagueProgression[]> {
  const supabase = await createClient();

  const { data: leagueProgression, error } = await supabase.from('league_progression').insert(payload).select();

  if (error) {
    console.error('Error inserting league progression:', error);
    throw error;
  }

  const hasData = leagueProgression && leagueProgression.length > 0;

  return hasData ? leagueProgression.map(entity => transformClientLeagueProgressionToLeagueProgression(entity)) : [];
}
