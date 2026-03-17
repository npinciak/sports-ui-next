import { UserLeague } from '@/lib/models/user-league.model';
import { transformClientUserLeagueToUserLeague } from '@/lib/transformers/user-league.transformer';
import { createClient } from '../server';

export async function getLeaguesByUserId(userId: string): Promise<UserLeague[]> {
  const supabase = await createClient();

  const { data: leagues } = await supabase
    .from('leagues')
    .select('*,user_profile!inner(user_id)')
    .eq('user_profile.user_id', userId)
    .order('created_at', { ascending: false });

  return leagues ? leagues.map(league => transformClientUserLeagueToUserLeague(league)) : [];
}
