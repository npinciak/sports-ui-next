import { getFangraphsBattingLeaders } from '@/app/actions/baseball/fangraphs';
import { FangraphsBatterStatsActions } from '@/lib/features/baseball/fangraphs-batters-stats.slice';
import { useAppDispatch } from '@/lib/hooks';
import { FangraphsPlayerStatsRequest } from '@/lib/models/fangraphs/client.model';
import { useEffect, useRef, useState } from 'react';

interface UseFangraphsBattingDataOptions {
  month?: string;
  enabled?: boolean;
}

export function useFangraphsBattingData(playerIds: number[] | undefined, options: UseFangraphsBattingDataOptions = {}) {
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
        const fangraphsBattingLeaders = await getFangraphsBattingLeaders({
          ...FangraphsPlayerStatsRequest.requestBody,
          players: playerIds,
          month,
        });

        if (fangraphsBattingLeaders) {
          dispatch(FangraphsBatterStatsActions.setAll(fangraphsBattingLeaders));
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
