'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { intelligenceHubService } from '@/services/intelligenceHubService';
import type { ContentItemFilters, IHSource } from '@/types/intelligence-hub.types';

export const IH_KEYS = {
  stats: ['ih-stats'] as const,
  categories: ['ih-categories'] as const,
  sources: ['ih-sources'] as const,
  items: (filters: ContentItemFilters) => ['ih-items', filters] as const,
  item: (id: string) => ['ih-item', id] as const,
};

// ─── STATS ────────────────────────────────────────────────────────────────────

export function useIHStats() {
  return useQuery({
    queryKey: IH_KEYS.stats,
    queryFn: intelligenceHubService.getStats,
    refetchInterval: 30000,
  });
}

// ─── CATEGORIES ───────────────────────────────────────────────────────────────

export function useIHCategories() {
  return useQuery({
    queryKey: IH_KEYS.categories,
    queryFn: intelligenceHubService.getCategories,
    staleTime: Infinity,
  });
}

// ─── INGEST ───────────────────────────────────────────────────────────────────

export function useTriggerIngest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: intelligenceHubService.triggerIngest,
    onSuccess: (result) => {
      if (result.imported > 0) {
        toast.success(
          `Ingestion complete — ${result.imported} new article${result.imported !== 1 ? 's' : ''} imported`,
          { duration: 5000 },
        );
      } else {
        toast.info(
          `Nothing new — ${result.alreadyExists} already in DB, ${result.notRelevant} not relevant`,
          { duration: 5000 },
        );
      }
      if (result.errors > 0) {
        toast.error(
          `${result.errors} source${result.errors !== 1 ? 's' : ''} failed:\n${result.failedSources.slice(0, 3).join('\n')}`,
          { duration: 8000 },
        );
      }
      qc.invalidateQueries({ queryKey: IH_KEYS.stats });
      qc.invalidateQueries({ queryKey: ['ih-items'] });
    },
    onError: (err: any) => {
      const message: string =
        err?.response?.data?.message ??
        err?.message ??
        'Ingestion failed';
      toast.error(message, { duration: 6000 });
    },
  });
}

// ─── SOURCES ──────────────────────────────────────────────────────────────────

export function useIHSources() {
  return useQuery({
    queryKey: IH_KEYS.sources,
    queryFn: intelligenceHubService.getSources,
  });
}

export function useCreateSource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<IHSource>) => intelligenceHubService.createSource(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: IH_KEYS.sources });
      toast.success('Source added');
    },
    onError: () => toast.error('Failed to add source'),
  });
}

export function useUpdateSource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<IHSource> }) =>
      intelligenceHubService.updateSource(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: IH_KEYS.sources });
      toast.success('Source updated');
    },
    onError: () => toast.error('Failed to update source'),
  });
}

export function useDeleteSource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => intelligenceHubService.deleteSource(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: IH_KEYS.sources });
      toast.success('Source deleted');
    },
    onError: () => toast.error('Failed to delete source'),
  });
}

// ─── CONTENT ITEMS ────────────────────────────────────────────────────────────

export function useIHItems(filters: ContentItemFilters) {
  return useQuery({
    queryKey: IH_KEYS.items(filters),
    queryFn: () => intelligenceHubService.getItems(filters),
    placeholderData: (prev) => prev,
  });
}

export function useIHItem(id: string) {
  return useQuery({
    queryKey: IH_KEYS.item(id),
    queryFn: () => intelligenceHubService.getItemById(id),
    enabled: !!id,
  });
}

export function useUpdateItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, any> }) =>
      intelligenceHubService.updateItem(id, data),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: ['ih-items'] });
      qc.setQueryData(IH_KEYS.item(updated._id), updated);
      qc.invalidateQueries({ queryKey: IH_KEYS.stats });
      toast.success('Saved');
    },
    onError: () => toast.error('Failed to save'),
  });
}

export function useDeleteItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => intelligenceHubService.deleteItem(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ih-items'] });
      qc.invalidateQueries({ queryKey: IH_KEYS.stats });
      toast.success('Item deleted');
    },
    onError: () => toast.error('Failed to delete'),
  });
}

export function useReprocessItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => intelligenceHubService.reprocessItem(id),
    onSuccess: (updated) => {
      qc.setQueryData(IH_KEYS.item(updated._id), updated);
      qc.invalidateQueries({ queryKey: ['ih-items'] });
      toast.success('AI reprocessing complete');
    },
    onError: (err: any) => {
      const message: string =
        err?.response?.data?.message ??
        err?.message ??
        'Reprocessing failed';
      toast.error(message, { duration: 6000 });
    },
  });
}
