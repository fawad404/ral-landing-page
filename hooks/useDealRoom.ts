'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { dealRoomService } from '@/services/dealRoomService';

export const DEAL_ROOM_KEYS = {
  myRequest: ['deal-room', 'my-request'] as const,
  all: (status?: string) => ['deal-room', 'all', status] as const,
};

export function useMyDealRoomRequest() {
  return useQuery({ queryKey: DEAL_ROOM_KEYS.myRequest, queryFn: dealRoomService.getMyRequest });
}

export function useAllDealRoomRequests(status?: string) {
  return useQuery({ queryKey: DEAL_ROOM_KEYS.all(status), queryFn: () => dealRoomService.getAll(status) });
}

export function useRequestDealRoomAccess() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: dealRoomService.requestAccess,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DEAL_ROOM_KEYS.myRequest });
      toast.success('Access request submitted! An admin will review it shortly.');
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Request failed'),
  });
}

export function useApproveDealRoomRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => dealRoomService.approve(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['deal-room'] });
      toast.success('Request approved');
    },
    onError: () => toast.error('Failed to approve request'),
  });
}

export function useRejectDealRoomRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => dealRoomService.reject(id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['deal-room'] });
      toast.success('Request rejected');
    },
    onError: () => toast.error('Failed to reject request'),
  });
}

// ── Listings ─────────────────────────────────────────────────────────────────

export const DEAL_ROOM_LISTING_KEYS = {
  all: ['deal-room', 'listings'] as const,
  my: ['deal-room', 'listings', 'my'] as const,
};

export function useDealRoomListings() {
  return useQuery({ queryKey: DEAL_ROOM_LISTING_KEYS.all, queryFn: dealRoomService.getListings });
}

export function useMyDealRoomListings() {
  return useQuery({ queryKey: DEAL_ROOM_LISTING_KEYS.my, queryFn: dealRoomService.getMyListings });
}

export function useCreateDealRoomListing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: dealRoomService.createListing,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DEAL_ROOM_LISTING_KEYS.all });
      qc.invalidateQueries({ queryKey: DEAL_ROOM_LISTING_KEYS.my });
      toast.success('Listing posted!');
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to create listing'),
  });
}

export function useDeleteDealRoomListing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: dealRoomService.deleteListing,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DEAL_ROOM_LISTING_KEYS.all });
      qc.invalidateQueries({ queryKey: DEAL_ROOM_LISTING_KEYS.my });
      toast.success('Listing removed');
    },
    onError: () => toast.error('Failed to delete listing'),
  });
}
