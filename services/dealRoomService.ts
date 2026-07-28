import apiClient from '@/lib/axios';
import { API_ENDPOINTS } from '@/api/endpoints';
import type { DealRoomRequest, DealRoomListing, CreateListingDto } from '@/types/deal-room.types';

export const dealRoomService = {
  requestAccess: async (): Promise<DealRoomRequest> => {
    const res = await apiClient.post<DealRoomRequest>(API_ENDPOINTS.DEAL_ROOM_REQUEST);
    return res.data;
  },

  getMyRequest: async (): Promise<DealRoomRequest | null> => {
    const res = await apiClient.get<DealRoomRequest | null>(API_ENDPOINTS.DEAL_ROOM_MY_REQUEST);
    return res.data;
  },

  getAll: async (status?: string): Promise<DealRoomRequest[]> => {
    const res = await apiClient.get<DealRoomRequest[]>(API_ENDPOINTS.DEAL_ROOM_ALL_REQUESTS, {
      params: status ? { status } : undefined,
    });
    return res.data;
  },

  approve: async (id: string): Promise<DealRoomRequest> => {
    const res = await apiClient.patch<DealRoomRequest>(API_ENDPOINTS.DEAL_ROOM_APPROVE(id));
    return res.data;
  },

  reject: async (id: string, rejectionReason?: string): Promise<DealRoomRequest> => {
    const res = await apiClient.patch<DealRoomRequest>(API_ENDPOINTS.DEAL_ROOM_REJECT(id), { rejectionReason });
    return res.data;
  },

  // Listings
  getListings: async (): Promise<DealRoomListing[]> => {
    const res = await apiClient.get<DealRoomListing[]>(API_ENDPOINTS.DEAL_ROOM_LISTINGS);
    return res.data;
  },

  getMyListings: async (): Promise<DealRoomListing[]> => {
    const res = await apiClient.get<DealRoomListing[]>(API_ENDPOINTS.DEAL_ROOM_LISTINGS_MY);
    return res.data;
  },

  createListing: async (dto: CreateListingDto): Promise<DealRoomListing> => {
    const form = new FormData();
    form.append('title', dto.title);
    form.append('description', dto.description);
    form.append('type', dto.type);
    if (dto.condition) form.append('condition', dto.condition);
    if (dto.price !== undefined) form.append('price', String(dto.price));
    if (dto.priceNegotiable !== undefined) form.append('priceNegotiable', String(dto.priceNegotiable));
    if (dto.contactEmail) form.append('contactEmail', dto.contactEmail);
    if (dto.contactPhone) form.append('contactPhone', dto.contactPhone);
    if (dto.image) form.append('image', dto.image);
    const res = await apiClient.post<DealRoomListing>(API_ENDPOINTS.DEAL_ROOM_LISTINGS, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  deleteListing: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.DEAL_ROOM_LISTING_DELETE(id));
  },
};
