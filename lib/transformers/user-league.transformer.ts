import { UserLeague } from '../models/user-league.model';
import { Database } from '../supabase/database.model';

export function transformClientUserLeagueToUserLeague(clientUserLeague: Database['public']['Tables']['leagues']['Row']): UserLeague {
  return {
    id: clientUserLeague.id,
    espnLeagueId: clientUserLeague.espn_league_id,
    sport: clientUserLeague.sport,
    year: clientUserLeague.year,
    leagueName: clientUserLeague.league_name,
    userProfileId: clientUserLeague.user_profile_id,
    createdAt: clientUserLeague.created_at,
  };
}
