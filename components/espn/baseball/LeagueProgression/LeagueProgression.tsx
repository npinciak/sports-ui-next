'use client';

import { LeagueProgressionSelectors } from '@/lib/features/baseball/selectors';
import { useAppSelector } from '@/lib/hooks';

export default function LeagueProgression() {
  const progression = useAppSelector(state => LeagueProgressionSelectors.selectAll(state));

  console.log('progression', progression);

  return <div className="space-y-2"></div>;
}
