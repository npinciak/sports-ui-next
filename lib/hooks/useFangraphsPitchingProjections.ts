import { getFangraphsPitchingProjections } from '@/app/actions/baseball/fangraphs';
import { FangraphsPitcherProjectionsActions } from '@/lib/features/baseball/fangraphs-pitchers-projections.slice';
import { useAppDispatch } from '@/lib/hooks';
import { useEffect, useRef, useState } from 'react';

interface UseFangraphsPitchingProjectionsOptions {
  enabled?: boolean;
}

export function useFangraphsPitchingProjections(options: UseFangraphsPitchingProjectionsOptions = {}) {
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
        const projections = await getFangraphsPitchingProjections();

        if (projections) {
          dispatch(FangraphsPitcherProjectionsActions.setAll(projections));
          fetchedRef.current = true;
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch Fangraphs pitching projections';
        console.error('Failed to fetch Fangraphs pitching projections:', err);
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
