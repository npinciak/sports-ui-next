import { getFangraphsPitchingLeaders } from '@/app/actions/baseball/fangraphs';
import { useAppDispatch } from '@/lib/hooks';
import { FangraphsPlayerStatsRequest } from '@/lib/models/fangraphs/client.model';
import { useEffect, useRef, useState } from 'react';
import { FangraphsPitcherStatsActions } from '../features/baseball/fangraphs-pitchers-stats.slice';

interface UseFangraphsPitchingDataOptions {
  month?: string;
  enabled?: boolean;
}

export function useFangraphsPitchingData(playerIds: number[] | undefined, options: UseFangraphsPitchingDataOptions = {}) {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchedPlayerIdsRef = useRef('');

  const { month = '0', enabled = true } = options;

  useEffect(() => {
    const fetchFangraphsData = async () => {
      if (!enabled || !playerIds?.length) {
        return;
      }

      // Prevent refetching the same data
      const playerIdsKey = playerIds.join(',');
      if (fetchedPlayerIdsRef.current === playerIdsKey) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const fangraphsPitchingLeaders = await getFangraphsPitchingLeaders({
          ...FangraphsPlayerStatsRequest.requestBody,
          stats: 'pit',
          players: playerIds,
          month,
        });

        if (fangraphsPitchingLeaders) {
          dispatch(FangraphsPitcherStatsActions.setAll(fangraphsPitchingLeaders));
          fetchedPlayerIdsRef.current = playerIdsKey;
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch Fangraphs data';
        console.error('Failed to fetch Fangraphs data:', err);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFangraphsData();
  }, [playerIds, month, enabled, dispatch]);

  const refetch = () => {
    fetchedPlayerIdsRef.current = '';
    // This will trigger the useEffect to run again
  };

  return {
    isLoading,
    error,
    refetch,
  };
}
