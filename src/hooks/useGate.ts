import { useQuery } from '@tanstack/react-query';

import { api } from '@/src/lib/api';
import { Gate, GateSchema } from '@/src/lib/types';

export function useGate(code: string) {
  return useQuery<Gate>({
    queryKey: ['gate', code],
    enabled: Boolean(code),
    queryFn: async () => {
      const d = await api.get<unknown>(`/gates/${encodeURIComponent(code)}`);
      return GateSchema.parse(d);
    },
  });
}
