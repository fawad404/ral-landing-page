"use client";
import { NewSubmissionIcon, PreviousSubmission, SocialGrowth, SubmitIcon, UploadFileIcon } from "@/assets";
import Header from "@/components/global/header";
import React, { useRef, useState } from "react";
import CustomSelect from "@/components/global/CustomSelect";
import { useMySocialBoosts, useSubmitSocialBoost, useDeleteSocialBoost } from "@/hooks/useSocialBoost";
import type { SocialBoostStatus } from "@/types/social-boost.types";

const statusConfig: Record<SocialBoostStatus, { label: string; bg: string; text: string }> = {
  approved: { label: "APPROVED", bg: "#10B9811A", text: "#10B981" },
  pending: { label: "PENDING", bg: "#F59E0B1A", text: "#F59E0B" },
  posted: { label: "POSTED", bg: "#09488B1A", text: "#09488B" },
  rejected: { label: "REJECTED", bg: "#EF44441A", text: "#EF4444" },
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const categories = ["Facility Update", "Team Event", "Maintenance", "Community", "Resident Activity", "Announcement"];
const channels = ["Facebook", "Instagram", "LinkedIn", "Website", "All Channels"];

const SocialBoostComponent = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("Facility Update");
  const [channel, setChannel] = useState("Facebook");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data: submissions = [], isLoading, isError, refetch } = useMySocialBoosts();
  const submitMutation = useSubmitSocialBoost();
  const deleteMutation = useDeleteSocialBoost();

  const handleFile = (file: File) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/quicktime'];
    if (!allowed.includes(file.type)) {
      alert('Only JPG, PNG, GIF, WebP, MP4, MOV files are allowed');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      alert('File must be under 50MB');
      return;
    }
    setSelectedFile(file);
  };

  const handleSubmit = () => {
    if (!caption.trim()) {
      alert('Please add a caption before submitting.');
      return;
    }
    submitMutation.mutate(
      { caption, category, channel, file: selectedFile ?? undefined },
      {
        onSuccess: () => {
          setCaption('');
          setSelectedFile(null);
        },
      }
    );
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 p-10">
      <Header
        title="Social Boost"
        description="Submit photos and updates for the RAL Connect social channels."
      />

      <div className="grid grid-cols-2 gap-8 items-start">

        {/* LEFT: New Submission */}
        <div className="bg-white rounded-xl border border-solid border-[#E2E8F0] shadow-[0px_1px_2px_0px_#0000000D] p-6 flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <NewSubmissionIcon />
            <p className="text-[20px] font-bold text-[#0F172A] font-space">New Submission</p>
          </div>

          {/* Drag & Drop Area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const file = e.dataTransfer.files[0];
              if (file) handleFile(file);
            }}
            className={`w-full h-auto rounded-xl border-2 p-10 border-dashed flex flex-col items-center justify-center gap-2 transition-colors duration-150 cursor-pointer ${
              dragOver ? "border-[#09488B] bg-[#09488B08]" : "border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#94A3B8]"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/quicktime"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />
            <UploadFileIcon />
            {selectedFile ? (
              <div className="text-center">
                <p className="text-sm font-semibold text-[#09488B]">{selectedFile.name}</p>
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                  className="text-xs text-[#EF4444] hover:underline mt-1"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="text-center">
                <span className="text-base font-bold text-[#0F172A]">Drag &amp; drop files here </span>
                <span className="text-sm text-[#94A3B8]">or </span>
                <span className="text-sm font-semibold text-[#09488B]">browse files</span>
              </div>
            )}
            <p className="text-[10px] text-[#94A3B8] uppercase tracking-wide font-medium">
              Supports JPG, PNG, MP4 up to 50MB
            </p>
          </div>

          {/* Caption */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-[#334155]">Caption / Description</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Describe the update, include hashtags, or specify location..."
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-solid border-[#E2E8F0] text-sm text-[#0F172A] resize-none focus:outline-none focus:ring-2 focus:ring-[#09488B33] focus:border-[#09488B] transition-colors placeholder-[#94A3B8]"
            />
          </div>

          {/* Category + Target Channel */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-[#334155]">Category</label>
              <CustomSelect
                value={category}
                onChange={setCategory}
                options={categories.map((c) => ({ value: c, label: c }))}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-[#334155]">Target Channel</label>
              <CustomSelect
                value={channel}
                onChange={setChannel}
                options={channels.map((c) => ({ value: c, label: c }))}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={submitMutation.isPending}
            className="w-full py-3.5 bg-[#09488B] rounded-xl flex items-center justify-center gap-2 hover:bg-[#083d77] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <SubmitIcon />
            <span className="text-sm font-bold text-white uppercase tracking-wide">
              {submitMutation.isPending ? 'Submitting...' : 'Submit Post'}
            </span>
          </button>
        </div>

        {/* RIGHT: Previous Submissions */}
        <div className="bg-white rounded-xl border border-solid border-[#E2E8F0] shadow-[0px_1px_2px_0px_#0000000D] p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PreviousSubmission />
              <p className="text-[20px] font-bold text-[#0F172A]">Previous Submissions</p>
            </div>
          </div>

          {isLoading && (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 rounded-lg bg-[#F1F5F9] animate-pulse" />
              ))}
            </div>
          )}

          {isError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-center justify-between">
              <p className="text-sm text-red-600">Failed to load submissions</p>
              <button onClick={() => refetch()} className="text-sm font-semibold text-red-600 hover:underline">Retry</button>
            </div>
          )}

          {!isLoading && !isError && submissions.length === 0 && (
            <p className="text-sm text-[#94A3B8] py-4 text-center">No submissions yet</p>
          )}

          {!isLoading && !isError && (
            <div className="flex flex-col gap-4 w-full">
              {submissions.slice(0, 5).map((s) => {
                const cfg = statusConfig[s.status] ?? statusConfig.pending;
                return (
                  <div key={s._id} className="flex items-center justify-between gap-4 p-3 rounded-lg border border-solid border-[#F1F5F9]">
                    {/* Thumbnail */}
                    <div className={`w-16 h-16 rounded-lg shrink-0 flex items-center justify-center ${s.fileUrl ? "bg-linear-to-br from-[#CBD5E1] to-[#94A3B8]" : "bg-[#F1F5F9] border border-solid border-[#E2E8F0]"}`}>
                      {s.fileUrl ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z" fill="white" fillOpacity="0.7" />
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M17 10.5V7C17 6.45 16.55 6 16 6H4C3.45 6 3 6.45 3 7V17C3 17.55 3.45 18 4 18H16C16.55 18 17 17.55 17 17V13.5L21 17.5V6.5L17 10.5Z" fill="#94A3B8" />
                        </svg>
                      )}
                    </div>
                    {/* Info */}
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[#94A3B8] uppercase">{timeAgo(s.createdAt)}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0" style={{ background: cfg.bg, color: cfg.text }}>
                          {cfg.label}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-[#0F172A] truncate">{s.caption}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-[#64748B]">Category: {s.category}</p>
                        {s.status === 'pending' && (
                          <button
                            onClick={() => deleteMutation.mutate(s._id)}
                            disabled={deleteMutation.isPending}
                            className="text-xs text-[#EF4444] hover:underline disabled:opacity-50"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                      {s.reviewNotes && (
                        <p className="text-xs text-[#64748B] italic">Note: {s.reviewNotes}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Social Reach stat */}
          <div className="bg-[#09488B0D] rounded-lg p-4 flex gap-4 items-center justify-between mt-auto">
            <div className="w-fit h-auto flex justify-center items-center">
              <SocialGrowth />
            </div>
            <div className="flex-1 h-auto flex flex-col justify-center items-start">
              <span className="text-xs font-bold text-[#334155]">Total Submissions</span>
              <span className="text-[20px] font-black text-[#09488B]">
                {submissions.length} <span className="text-[#64748B] text-xs font-normal">all time</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialBoostComponent;
