import { useQuery } from '@tanstack/react-query';

import { api } from '@/src/lib/api';
import { Journey, JourneySchema } from '@/src/lib/types';

export function useRoute(from?: string, to?: string) {
  return useQuery<Journey>({
    queryKey: ['route', { from, to }],
    enabled: Boolean(from && to),
    queryFn: async () => {
      const d = await api.get<unknown>(`/gates/${from}/to/${to}`);
      return JourneySchema.parse(d);
    },
  });
}
