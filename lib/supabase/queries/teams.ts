import { UserTeam } from '@/lib/models/user-team.model';
import { transformClientUserTeamToUserTeam } from '@/lib/transformers/user-team.transformer';
import { createClient } from '../server';

export async function getTeamsByUserId(userId: string): Promise<UserTeam[]> {
  const supabase = await createClient();

  const { data: teams } = await supabase
    .from('teams')
    .select('*,user_profile!inner(user_id)')
    .eq('user_profile.user_id', userId)
    .order('created_at', { ascending: false });

  return teams ? teams.map(team => transformClientUserTeamToUserTeam(team)) : [];
}
