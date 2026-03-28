'use server';

import { LeagueProgression } from '@/lib/models';
import { Database } from '@/lib/supabase/database.model';
import { createClient } from '@/lib/supabase/server';
import { transformClientLeagueProgressionToLeagueProgression } from '@/lib/transformers/league-progression';

export async function insertLeagueProgression(
  payload: Database['public']['Tables']['league_progression']['Insert'][]
): Promise<LeagueProgression[]> {
  const supabase = await createClient();

  const { data: leagueProgression, error } = await supabase
    .from('league_progression')
    .upsert(payload, {
      onConflict: 'espn_league_id, espn_league_team_id, espn_scoring_period_id',
      ignoreDuplicates: true, // this option exists on upsert, not insert
    })
    .select();

  if (error) {
    console.error('Error inserting league progression:', error);
    throw error;
  }

  const hasData = leagueProgression && leagueProgression.length > 0;

  return hasData ? leagueProgression.map(entity => transformClientLeagueProgressionToLeagueProgression(entity)) : [];
}
