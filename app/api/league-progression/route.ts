import { getLeagueProgression } from '@/lib/supabase/queries/league-progression';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const data = await getLeagueProgression();

  return NextResponse.json({
    metadata: {
      count: data.length,
    },
    data,
  });
}
