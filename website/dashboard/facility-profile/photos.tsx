"use client";
import React, { useRef, useState } from "react";
import { useMyFacilities } from "@/hooks/useFacilities";
import { useAddFacilityPhoto, useRemoveFacilityPhoto } from "@/hooks/useFacilities";

const UploadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M11 16V7.85L8.4 10.45L7 9L12 4L17 9L15.6 10.45L13 7.85V16H11ZM6 20C5.45 20 4.97917 19.8042 4.5875 19.4125C4.19583 19.0208 4 18.55 4 18V15H6V18H18V15H20V18C20 18.55 19.8042 19.0208 19.4125 19.4125C19.0208 19.8042 18.55 20 18 20H6Z" fill="#94A3B8" />
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V6H4V4H9V3H15V4H20V6H19V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM17 6H7V19H17V6ZM9 17H11V8H9V17ZM13 17H15V8H13V17Z" fill="#EF4444" />
  </svg>
);

const labelSlots = [
  "Exterior / Front View",
  "Lobby / Common Area",
  "Resident Bedroom",
  "Dining Room",
  "Outdoor / Garden",
  "Resident Bathroom",
];

const Photos = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingLabel, setPendingLabel] = useState<string | null>(null);
  const { data: facilities = [], isLoading, isError } = useMyFacilities();
  const facility = facilities[0];

  const addPhoto = useAddFacilityPhoto(facility?._id ?? '');
  const removePhoto = useRemoveFacilityPhoto(facility?._id ?? '');

  const photos = facility?.photos ?? [];

  const handleSlotClick = (label: string) => {
    setPendingLabel(label);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !pendingLabel || !facility) return;
    addPhoto.mutate({ file, label: pendingLabel });
    e.target.value = '';
    setPendingLabel(null);
  };

  const handleRemove = (filename: string) => {
    if (!facility) return;
    removePhoto.mutate(filename);
  };

  if (isLoading) {
    return (
      <div className="mx-10 mt-6 grid grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-44 rounded-xl bg-[#F1F5F9] animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-10 mt-6 p-4 rounded-xl bg-red-50 border border-red-200">
        <p className="text-sm text-red-600">Failed to load facility data. Please refresh the page.</p>
      </div>
    );
  }

  if (!facility) {
    return (
      <div className="mx-10 mt-6 p-4 rounded-xl bg-[#09488B0D] border border-[#09488B1A]">
        <p className="text-sm font-semibold text-[#09488B]">No facility registered yet. Photos will be available once your facility is created.</p>
      </div>
    );
  }

  // Build slots: real photos first, then empty slots for standard labels not yet uploaded
  const uploadedLabels = new Set(photos.map((p) => p.label));
  const emptySlots = labelSlots.filter((l) => !uploadedLabels.has(l));

  return (
    <div className="w-full grow">
      <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" className="hidden" onChange={handleFileChange} />
      <div className="mx-10 mb-10 flex flex-col gap-6">
        {/* Banner */}
        <div className="bg-[#09488B0D] border border-solid border-[#09488B1A] rounded-xl px-6 py-4 flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-semibold text-[#09488B]">
              {photos.length} of {labelSlots.length} photos uploaded
            </p>
            <p className="text-xs font-normal text-[#475569]">
              Add high-quality photos to attract more prospective residents. Recommended: JPG or PNG, max 5MB each.
            </p>
          </div>
          <div className="w-14 h-14 flex-shrink-0">
            <svg viewBox="0 0 56 56" fill="none" className="w-full h-full">
              <circle cx="28" cy="28" r="28" fill="#09488B" fillOpacity="0.1" />
              <path d="M20 38C19.45 38 18.9792 37.8042 18.5875 37.4125C18.1958 37.0208 18 36.55 18 36V20C18 19.45 18.1958 18.9792 18.5875 18.5875C18.9792 18.1958 19.45 18 20 18H36C36.55 18 37.0208 18.1958 37.4125 18.5875C37.8042 18.9792 38 19.45 38 20V36C38 36.55 37.8042 37.0208 37.4125 37.4125C37.0208 37.8042 36.55 38 36 38H20ZM20 36H36V20H20V36ZM21 34H35L30.25 27.5L26.75 32L24.25 28.75L21 34Z" fill="#09488B" />
            </svg>
          </div>
        </div>

        {/* Photo grid */}
        <div className="grid grid-cols-3 gap-4">
          {/* Uploaded photos */}
          {photos.map((photo) => (
            <div key={photo.publicId} className="flex flex-col gap-2">
              <div className="w-full h-44 rounded-xl overflow-hidden relative border-2 border-[#09488B]">
                <img src={photo.url} alt={photo.label} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 inset-x-0 bg-[#00000040] px-3 py-2">
                  <p className="text-white text-xs font-semibold truncate">{photo.label}</p>
                </div>
              </div>
              <button
                onClick={() => handleRemove(photo.publicId)}
                disabled={removePhoto.isPending}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#EF4444] hover:text-red-700 transition-colors self-end disabled:opacity-50"
              >
                <TrashIcon />
                Remove
              </button>
            </div>
          ))}

          {/* Empty slots */}
          {emptySlots.map((label) => (
            <div key={label} className="flex flex-col gap-2">
              <div
                onClick={() => handleSlotClick(label)}
                className="w-full h-44 rounded-xl border-2 border-dashed border-[#CBD5E1] bg-[#F8FAFC] hover:border-[#94A3B8] cursor-pointer flex flex-col items-center justify-center gap-2 transition-colors duration-150"
              >
                {addPhoto.isPending && pendingLabel === label ? (
                  <div className="w-6 h-6 border-2 border-[#09488B] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <UploadIcon />
                    <p className="text-xs font-semibold text-[#64748B] text-center px-3">{label}</p>
                    <p className="text-xs text-[#94A3B8]">Click to upload</p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Photos;
