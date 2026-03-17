import { getFangraphsBattingProjections } from '@/app/actions/baseball/fangraphs';
import { FangraphsBatterProjectionsActions } from '@/lib/features/baseball/fangraphs-batters-projections.slice';
import { useAppDispatch } from '@/lib/hooks';
import { useEffect, useRef, useState } from 'react';

interface UseFangraphsBattingProjectionsOptions {
  enabled?: boolean;
}

export function useFangraphsBattingProjections(options: UseFangraphsBattingProjectionsOptions = {}) {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchedRef = useRef(false);

  const { enabled = true } = options;

  useEffect(() => {
    const fetchProjections = async () => {
      if (!enabled || fetchedRef.current) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const projections = await getFangraphsBattingProjections();

        if (projections) {
          dispatch(FangraphsBatterProjectionsActions.setAll(projections));
          fetchedRef.current = true;
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch Fangraphs batting projections';
        console.error('Failed to fetch Fangraphs batting projections:', err);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjections();
  }, [enabled, dispatch]);

  const refetch = () => {
    fetchedRef.current = false;
  };

  return {
    isLoading,
    error,
    refetch,
  };
}
