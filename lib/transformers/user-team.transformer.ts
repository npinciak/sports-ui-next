import { UserTeam } from '../models';
import { Database } from '../supabase/database.model';

export function transformClientUserTeamToUserTeam(clientUserTeam: Database['public']['Tables']['teams']['Row']): UserTeam {
  return {
    id: clientUserTeam.id,
    espnLeagueId: clientUserTeam.espn_league_id,
    espnLeagueTeamId: clientUserTeam.espn_league_team_id,
    teamName: clientUserTeam.team_name,
    sport: clientUserTeam.sport,
    year: clientUserTeam.year,
    userProfileId: clientUserTeam.user_profile_id,
    createdAt: clientUserTeam.created_at,
  };
}
