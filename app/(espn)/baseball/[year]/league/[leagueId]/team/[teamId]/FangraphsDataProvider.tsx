'use client';

import {
  selectPitcherFangraphIds,
  selectStartingBatterFangraphIds,
  selectTeamBatterList,
  selectTeamPitcherList,
} from '@/lib/features/baseball/selectors/roster.selector';
import { useAppSelector } from '@/lib/hooks';
import { useFangraphsBattingData } from '@/lib/hooks/useFangraphsBattingData';
import { useFangraphsBattingProjections } from '@/lib/hooks/useFangraphsBattingProjections';
import { useFangraphsPitchingData } from '@/lib/hooks/useFangraphsPitchingData';
import { useFangraphsPitchingProjections } from '@/lib/hooks/useFangraphsPitchingProjections';
import { ReactNode } from 'react';

interface FangraphsDataProviderProps {
  children: ReactNode;
  enabled?: boolean;
  showLoading?: boolean;
}

export function FangraphsDataProvider({ children, enabled = true, showLoading = false }: FangraphsDataProviderProps) {
  const batters = useAppSelector(selectTeamBatterList);
  const pitchers = useAppSelector(selectTeamPitcherList);

  // Wait for roster data to be loaded before fetching projections
  const hasRosterData = batters.length > 0 || pitchers.length > 0;
  const shouldFetchProjections = enabled && hasRosterData;

  // Step 1: Load projections first to get the Fangraphs IDs (only after roster data is available)
  const { isLoading: isBattingProjectionsLoading, error: battingProjectionsError } = useFangraphsBattingProjections({
    enabled: shouldFetchProjections,
  });
  const { isLoading: isPitchingProjectionsLoading, error: pitchingProjectionsError } = useFangraphsPitchingProjections({
    enabled: shouldFetchProjections,
  });

  // Step 2: Get the IDs (these will be populated after projections load)
  const mappedStartingBatterPlayerIds = useAppSelector(selectStartingBatterFangraphIds);
  const mappedPitcherPlayerIds = useAppSelector(selectPitcherFangraphIds);

  const projectionsLoaded = !isBattingProjectionsLoading && !isPitchingProjectionsLoading;
  const hasPlayerIds = mappedStartingBatterPlayerIds.length > 0 || mappedPitcherPlayerIds.length > 0;

  // Step 3: Only fetch stats data after projections are loaded and we have IDs
  const shouldFetchStats = projectionsLoaded && hasPlayerIds;

  const { isLoading: isBattingLoading, error: battingError } = useFangraphsBattingData(mappedStartingBatterPlayerIds, {
    enabled: enabled && shouldFetchStats,
  });
  const { isLoading: isPitchingLoading, error: pitchingError } = useFangraphsPitchingData(mappedPitcherPlayerIds, {
    enabled: enabled && shouldFetchStats,
  });

  if (
    showLoading &&
    (!hasRosterData || isBattingProjectionsLoading || isPitchingProjectionsLoading || isBattingLoading || isPitchingLoading)
  ) {
    return <div>Loading Fangraphs data...</div>;
  }

  if (battingProjectionsError || pitchingProjectionsError || battingError || pitchingError) {
    console.error('Fangraphs data error:', {
      battingProjectionsError,
      pitchingProjectionsError,
      battingError,
      pitchingError,
    });
  }

  return <>{children}</>;
}
