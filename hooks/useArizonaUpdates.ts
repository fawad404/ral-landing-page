'use client';
import { useQuery } from '@tanstack/react-query';
import { arizonaUpdatesService } from '@/services/arizonaUpdatesService';

export function useArizonaUpdates(page = 1) {
  return useQuery({ queryKey: ['arizona-updates', page], queryFn: () => arizonaUpdatesService.list(page) });
}
