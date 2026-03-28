import { LeagueProgression } from '@/lib/models';
import { transformClientLeagueProgressionToLeagueProgression } from '@/lib/transformers/league-progression';
import { createClient } from '../server';

export async function getLeagueProgression(): Promise<LeagueProgression[]> {
  const supabase = await createClient();

  const { data } = await supabase.from('league_progression').select('*').order('created_at', { ascending: false });

  return data ? data.map(entity => transformClientLeagueProgressionToLeagueProgression(entity)) : [];
}
