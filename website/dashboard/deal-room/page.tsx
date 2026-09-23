"use client";
import { DealRoomLock, PeerIcon, SecureIcon, VerifiedListingIcon } from "@/assets";
import Header from "@/components/global/header";
import React, { useRef, useState } from "react";
import CustomSelect from "@/components/global/CustomSelect";
import {
  useMyDealRoomRequest,
  useRequestDealRoomAccess,
  useDealRoomListings,
  useMyDealRoomListings,
  useCreateDealRoomListing,
  useDeleteDealRoomListing,
} from "@/hooks/useDealRoom";
import type { ListingType, ListingCondition, DealRoomListing } from "@/types/deal-room.types";

// ── Icons ────────────────────────────────────────────────────────────────────
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="currentColor" />
  </svg>
);
const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V6H4V4H9V3H15V4H20V6H19V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM9 17H11V8H9V17ZM13 17H15V8H13V17Z" fill="currentColor" />
  </svg>
);

// ── Type labels ───────────────────────────────────────────────────────────────
const typeLabels: Record<ListingType, string> = {
  equipment: "Equipment",
  "real-estate": "Real Estate",
  supplies: "Supplies",
  other: "Other",
};
const typeColors: Record<ListingType, string> = {
  equipment: "bg-blue-50 text-blue-700",
  "real-estate": "bg-purple-50 text-purple-700",
  supplies: "bg-green-50 text-green-700",
  other: "bg-gray-100 text-gray-600",
};
const conditionColors: Record<ListingCondition, string> = {
  new: "bg-[#10B9811A] text-[#10B981]",
  used: "bg-[#F59E0B1A] text-[#F59E0B]",
  "as-is": "bg-[#EF44441A] text-[#EF4444]",
};

// ── Gate pillars ──────────────────────────────────────────────────────────────
const pillars = [
  { icon: <SecureIcon />, title: "Secure Environment", subtitle: "Only verified members enter" },
  { icon: <PeerIcon />, title: "Peer-to-Peer", subtitle: "Direct owner negotiations" },
  { icon: <VerifiedListingIcon />, title: "Verified Listings", subtitle: "Authentic facility items" },
];

const statusConfig = {
  pending: { label: "Request Pending Review", bg: "#F59E0B1A", text: "#F59E0B", desc: "Your access request has been submitted and is awaiting admin review." },
  approved: { label: "Access Granted", bg: "#10B9811A", text: "#10B981", desc: "" },
  rejected: { label: "Request Rejected", bg: "#EF44441A", text: "#EF4444", desc: "Your request was not approved at this time." },
};

// ── Create Listing Form ───────────────────────────────────────────────────────
function CreateListingForm({ onClose }: { onClose: () => void }) {
  const imageRef = useRef<HTMLInputElement>(null);
  const createMutation = useCreateDealRoomListing();

  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "equipment" as ListingType,
    condition: "used" as ListingCondition,
    price: "",
    priceNegotiable: false,
    contactEmail: "",
    contactPhone: "",
  });
  const [image, setImage] = useState<File | null>(null);

  const set = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) return;
    createMutation.mutate(
      {
        title: form.title,
        description: form.description,
        type: form.type,
        condition: form.condition,
        price: form.price ? Number(form.price) : 0,
        priceNegotiable: form.priceNegotiable,
        contactEmail: form.contactEmail || undefined,
        contactPhone: form.contactPhone || undefined,
        image: image ?? undefined,
      },
      { onSuccess: onClose },
    );
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl w-full max-w-lg p-6 flex flex-col gap-5 shadow-xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-[#0F172A]">Post a New Listing</p>
          <button type="button" onClick={onClose} className="text-[#94A3B8] hover:text-[#475569]">✕</button>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-[#334155]">Title *</label>
          <input value={form.title} onChange={(e) => set("title", e.target.value)} required
            className="border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#09488B]"
            placeholder="e.g. Hospital Bed – Electric Adjustable" />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-[#334155]">Description *</label>
          <textarea value={form.description} onChange={(e) => set("description", e.target.value)} required rows={3}
            className="border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-[#09488B]"
            placeholder="Describe the item, its condition, dimensions, etc." />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#334155]">Type *</label>
            <CustomSelect
              value={form.type}
              onChange={(v) => set("type", v)}
              options={(Object.keys(typeLabels) as ListingType[]).map((t) => ({ value: t, label: typeLabels[t] }))}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#334155]">Condition</label>
            <CustomSelect
              value={form.condition}
              onChange={(v) => set("condition", v)}
              options={[
                { value: 'new', label: 'New' },
                { value: 'used', label: 'Used' },
                { value: 'as-is', label: 'As-Is' },
              ]}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#334155]">Price ($)</label>
            <input type="number" min="0" value={form.price} onChange={(e) => set("price", e.target.value)}
              className="border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#09488B]"
              placeholder="0 = free" />
          </div>
          <div className="flex flex-col gap-1 justify-end">
            <label className="flex items-center gap-2 cursor-pointer pb-2">
              <input type="checkbox" checked={form.priceNegotiable} onChange={(e) => set("priceNegotiable", e.target.checked)}
                className="w-4 h-4 accent-[#09488B]" />
              <span className="text-sm text-[#334155]">Price negotiable</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#334155]">Contact Email</label>
            <input type="email" value={form.contactEmail} onChange={(e) => set("contactEmail", e.target.value)}
              className="border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#09488B]"
              placeholder="optional" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#334155]">Contact Phone</label>
            <input value={form.contactPhone} onChange={(e) => set("contactPhone", e.target.value)}
              className="border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#09488B]"
              placeholder="optional" />
          </div>
        </div>

        {/* Image upload */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-[#334155]">Photo (optional)</label>
          <input ref={imageRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp"
            className="hidden" onChange={(e) => setImage(e.target.files?.[0] ?? null)} />
          <div onClick={() => imageRef.current?.click()}
            className="border-2 border-dashed border-[#E2E8F0] rounded-lg p-4 text-center cursor-pointer hover:border-[#09488B] transition-colors">
            {image ? (
              <p className="text-sm text-[#09488B] font-semibold">{image.name}</p>
            ) : (
              <p className="text-sm text-[#94A3B8]">Click to upload image</p>
            )}
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-1">
          <button type="button" onClick={onClose}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold text-[#475569]">
            Cancel
          </button>
          <button type="submit" disabled={createMutation.isPending}
            className="px-6 py-2.5 bg-[#09488B] rounded-lg text-sm font-bold text-white hover:bg-[#083d77] disabled:opacity-60">
            {createMutation.isPending ? "Posting..." : "Post Listing"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ── Listing Card ──────────────────────────────────────────────────────────────
function ListingCard({ listing, isOwn, onDelete }: {
  listing: DealRoomListing;
  isOwn: boolean;
  onDelete: (id: string) => void;
}) {
  const ownerName = typeof listing.ownerId === "object"
    ? `${listing.ownerId.firstName ?? ""} ${listing.ownerId.lastName ?? ""}`.trim() || listing.ownerId.email
    : "—";

  return (
    <div className="bg-white rounded-xl border border-solid border-[#E2E8F0] overflow-hidden flex flex-col">
      {listing.imageUrl ? (
        <img src={listing.imageUrl} alt={listing.title} className="w-full h-40 object-cover" />
      ) : (
        <div className="w-full h-40 bg-[#F1F5F9] flex items-center justify-center">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z" fill="#CBD5E1" />
          </svg>
        </div>
      )}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-bold text-[#0F172A] leading-snug">{listing.title}</p>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${conditionColors[listing.condition]}`}>
            {listing.condition.toUpperCase()}
          </span>
        </div>

        <p className="text-xs text-[#64748B] line-clamp-2">{listing.description}</p>

        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${typeColors[listing.type]}`}>
            {typeLabels[listing.type]}
          </span>
          <span className="text-sm font-bold text-[#09488B]">
            {listing.price === 0 ? "Free" : `$${listing.price.toLocaleString()}`}
            {listing.priceNegotiable && <span className="text-xs font-normal text-[#64748B] ml-1">(negotiable)</span>}
          </span>
        </div>

        <div className="mt-auto pt-2 border-t border-[#F1F5F9] flex items-center justify-between">
          <div>
            <p className="text-xs text-[#64748B]">{listing.facilityName}</p>
            {(listing.contactEmail || listing.contactPhone) && (
              <p className="text-xs text-[#09488B]">{listing.contactEmail || listing.contactPhone}</p>
            )}
          </div>
          {isOwn && (
            <button onClick={() => onDelete(listing._id)}
              className="flex items-center gap-1 text-xs font-semibold text-[#EF4444] hover:text-red-700">
              <TrashIcon /> Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
const DealRoomComponent = () => {
  const { data: myRequest, isLoading: requestLoading, isError: requestError, refetch: refetchRequest, isFetching: requestFetching } = useMyDealRoomRequest();
  const requestMutation = useRequestDealRoomAccess();
  const { data: listings = [], isLoading: listingsLoading, isError: listingsError, refetch } = useDealRoomListings();
  const { data: myListings = [] } = useMyDealRoomListings();
  const deleteMutation = useDeleteDealRoomListing();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<string>("all");

  const status = myRequest?.status;
  const isApproved = status === "approved";

  const myListingIds = new Set(myListings.map((l) => l._id));
  const filtered = filter === "all" ? listings : listings.filter((l) => l.type === filter);

  if (!isApproved) {
    // Show gate
    const statusInfo = status ? statusConfig[status] : null;
    return (
      <div className="w-full h-full flex flex-col gap-10 p-10">
        <Header title="Deal Room" description="Private, owner-to-owner exchange for equipment, real estate, and resources." />
        <div className="w-full bg-white rounded-2xl border border-solid border-[#E2E8F0] shadow-[0px_20px_25px_-5px_#E2E8F080] px-10 py-16 flex flex-col items-center gap-6 relative">
          <div className="w-[calc(100%-10px)] h-1 absolute top-0 left-1/2 -translate-x-1/2 bgDealTopLine rounded-t-2xl" />
          <DealRoomLock />
          <div className="flex flex-col items-center gap-3 max-w-md text-center">
            <p className="text-[30px] font-bold text-[#0F172A] font-space">Owner Verification Required</p>
            <p className="text-lg font-normal text-[#64748B] leading-relaxed">
              Access to the Deal Room is restricted to verified facility owners to ensure a secure, high-trust exchange environment.
            </p>
          </div>
          <div className="flex flex-col items-center gap-4">
            {requestLoading ? (
              <div className="w-[320px] h-14 bg-[#F1F5F9] rounded-xl animate-pulse" />
            ) : requestError ? (
              // Don't offer "Request Access" when we simply couldn't load the status:
              // an approved facility would otherwise look locked out.
              <div className="w-[320px] px-6 py-4 rounded-xl flex flex-col items-center gap-3 text-center bg-[#F59E0B1A]">
                <span className="text-sm font-bold text-[#B45309]">Couldn&apos;t check your Deal Room access</span>
                <button onClick={() => refetchRequest()} disabled={requestFetching}
                  className="px-6 py-2 bg-[#09488B] rounded-lg text-sm font-bold text-white hover:bg-[#083d77] disabled:opacity-60">
                  {requestFetching ? "Checking..." : "Try again"}
                </button>
              </div>
            ) : statusInfo ? (
              <div className="w-[320px] px-6 py-4 rounded-xl flex flex-col items-center gap-1 text-center" style={{ background: statusInfo.bg }}>
                <span className="text-sm font-bold" style={{ color: statusInfo.text }}>{statusInfo.label}</span>
                {statusInfo.desc && <span className="text-xs text-[#64748B]">{statusInfo.desc}</span>}
                {status === "rejected" && myRequest?.rejectionReason && (
                  <span className="text-xs text-[#64748B] mt-1">Reason: {myRequest.rejectionReason}</span>
                )}
              </div>
            ) : (
              <button onClick={() => requestMutation.mutate()} disabled={requestMutation.isPending}
                className="px-8 py-4 bg-[#09488B] rounded-xl text-base font-bold text-white hover:bg-[#083d77] transition-colors w-[320px] flex items-center gap-2 justify-center disabled:opacity-60">
                {requestMutation.isPending ? "Submitting..." : "Request Access"}
                {!requestMutation.isPending && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" fill="white" />
                  </svg>
                )}
              </button>
            )}
          </div>
          <div className="w-full border-t border-solid border-[#F1F5F9] mt-4" />
          <div className="grid grid-cols-3 gap-8 w-full">
            {pillars.map((p) => (
              <div key={p.title} className="flex flex-col items-center gap-2 text-center">
                {p.icon}
                <p className="text-sm font-semibold text-[#0F172A]">{p.title}</p>
                <p className="text-xs text-[#64748B]">{p.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Approved — show marketplace
  return (
    <div className="w-full h-full flex flex-col gap-6 p-10">
      {showForm && <CreateListingForm onClose={() => setShowForm(false)} />}

      <div className="flex items-start justify-between">
        <Header title="Deal Room" description="Browse and post listings with other verified facility owners." />
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-5 py-3 bg-[#09488B] rounded-xl text-sm font-bold text-white hover:bg-[#083d77] transition-colors shrink-0">
          <PlusIcon /> Post Listing
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {["all", "equipment", "real-estate", "supplies", "other"].map((t) => (
          <button key={t} onClick={() => setFilter(t)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all capitalize ${
              filter === t ? "bg-[#09488B] text-white" : "bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]"
            }`}>
            {t === "all" ? "All" : typeLabels[t as ListingType]}
          </button>
        ))}
        <span className="ml-auto text-xs text-[#94A3B8]">{filtered.length} listing{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {listingsLoading && (
        <div className="grid grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-64 rounded-xl bg-[#F1F5F9] animate-pulse" />)}
        </div>
      )}

      {listingsError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between">
          <p className="text-sm text-red-600">Failed to load listings</p>
          <button onClick={() => refetch()} className="text-sm font-semibold text-red-600 hover:underline">Retry</button>
        </div>
      )}

      {!listingsLoading && !listingsError && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <p className="text-[#94A3B8] text-sm">No listings found. Be the first to post!</p>
          <button onClick={() => setShowForm(true)} className="text-sm font-semibold text-[#09488B] hover:underline">
            + Post a listing
          </button>
        </div>
      )}

      {!listingsLoading && !listingsError && filtered.length > 0 && (
        <div className="grid grid-cols-3 gap-6">
          {filtered.map((listing) => (
            <ListingCard
              key={listing._id}
              listing={listing}
              isOwn={myListingIds.has(listing._id)}
              onDelete={(id) => deleteMutation.mutate(id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DealRoomComponent;
