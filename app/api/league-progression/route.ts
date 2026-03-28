import { insertLeagueProgression } from '@/app/actions/baseball/league-progression';
import { getLeagueProgression } from '@/lib/supabase/queries/league-progression';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_: NextRequest) {
  const data = await getLeagueProgression();

  return NextResponse.json({
    metadata: {
      count: data.length,
    },
    data,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const data = await insertLeagueProgression(body);

  return NextResponse.json({
    metadata: {
      count: data.length,
    },
    data,
  });
}
