import { useQuery } from '@tanstack/react-query';

import { api } from '@/src/lib/api';
import { TransportCost, TransportCostSchema } from '@/src/lib/types';

export function useTransport(
  distance?: number,
  passengers?: number,
  parking?: number
) {
  return useQuery<TransportCost>({
    queryKey: ['transport', { distance, passengers, parking }],
    enabled:
      distance !== undefined &&
      passengers !== undefined &&
      parking !== undefined,
    queryFn: async () => {
      const q = new URLSearchParams({
        passengers: String(passengers),
        parking: String(parking),
      });
      const d = await api.get<unknown>(
        `/transport/${distance}?${q.toString()}`
      );
      return TransportCostSchema.parse(d);
    },
  });
}
