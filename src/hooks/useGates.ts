import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/src/lib/api';
import { GateSchema } from '@/src/lib/types';

export function useGates() {
  return useQuery({
    queryKey: ['gates'],
    queryFn: async () => {
      const data = await api.get<unknown>('/gates');
      const parsed = z.array(GateSchema).parse(data);
      return parsed.sort((a, b) => a.name.localeCompare(b.name));
    },
  });
}
