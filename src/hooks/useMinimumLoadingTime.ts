import { useEffect, useRef, useState } from 'react';

/**
 * @param isLoading - The actual loading state from the query
 * @param minimumMs - Minimum time to show loading (default: 2000ms)
 * @returns boolean indicating whether to show loading
 */
export function useMinimumLoadingTime(
  isLoading: boolean,
  minimumMs: number = 2000
): boolean {
  const [showLoading, setShowLoading] = useState(isLoading);
  const loadingStartTimeRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isLoading && !loadingStartTimeRef.current) {
      loadingStartTimeRef.current = Date.now();
      setShowLoading(true);
    } else if (!isLoading && loadingStartTimeRef.current) {
      const elapsed = Date.now() - loadingStartTimeRef.current;
      const remaining = minimumMs - elapsed;

      if (remaining > 0) {
        timerRef.current = setTimeout(() => {
          setShowLoading(false);
          loadingStartTimeRef.current = null;
          timerRef.current = null;
        }, remaining);
      } else {
        setShowLoading(false);
        loadingStartTimeRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isLoading, minimumMs]);

  return showLoading;
}
