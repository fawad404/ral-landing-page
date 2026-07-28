'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useMyPartner, useUpdateMyPartner, useUploadPartnerLogo } from '@/hooks/usePartners';

export default function VendorProfilePage() {
  const { data: partners, isLoading, isError } = useMyPartner();
  const partner = partners?.[0];
  const update = useUpdateMyPartner(partner?._id ?? '');
  const uploadLogo = useUploadPartnerLogo(partner?._id ?? '');
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (partner) {
      setName(partner.name ?? '');
      setCategory(partner.category ?? '');
      setDescription(partner.description ?? '');
      setEmail(partner.contactInfo?.email ?? '');
      setPhone(partner.contactInfo?.phone ?? '');
      setWebsite(partner.contactInfo?.website ?? '');
      setAddress(partner.contactInfo?.address ?? '');
    }
  }, [partner]);

  const handleSave = () => {
    if (!partner) return;
    update.mutate({ name, category, description, contactInfo: { email, phone, website, address } });
  };

  const handleDiscard = () => {
    if (!partner) return;
    setName(partner.name ?? '');
    setCategory(partner.category ?? '');
    setDescription(partner.description ?? '');
    setEmail(partner.contactInfo?.email ?? '');
    setPhone(partner.contactInfo?.phone ?? '');
    setWebsite(partner.contactInfo?.website ?? '');
    setAddress(partner.contactInfo?.address ?? '');
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadLogo.mutate(file);
    e.target.value = '';
  };

  if (isLoading) return (
    <div className="p-8 flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-[#09488B] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (isError) return (
    <div className="p-8 flex flex-col gap-4">
      <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4">
        <p className="text-sm font-semibold text-red-700">Failed to load your profile. Please refresh the page.</p>
      </div>
    </div>
  );

  if (!partner) return (
    <div className="p-8 flex flex-col items-center justify-center gap-4 h-64 text-center">
      <p className="text-lg font-bold text-[#0F172A]">No Profile Found</p>
      <p className="text-sm text-[#64748B]">Create your partner profile from the dashboard first.</p>
    </div>
  );

  const inputCls = "w-full px-4 py-3 rounded-lg border border-solid border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#09488B33] focus:border-[#09488B] transition-colors placeholder-[#94A3B8]";

  return (
    <div className="w-full grow">
      <div className="p-8 pb-24 flex flex-col gap-6 max-w-3xl">
        <div>
          <h1 className="text-3xl font-black text-[#0F172A]">My Profile</h1>
          <p className="text-[#64748B] mt-1">Update your partner profile information.</p>
        </div>

        {/* Status banner */}
        {partner.status === 'pending' && (
          <div className="bg-yellow-50 border border-yellow-300 rounded-xl px-5 py-3">
            <p className="text-sm font-bold text-yellow-800">Pending Review</p>
            <p className="text-xs text-yellow-700 mt-0.5">Your profile is awaiting admin approval. You can still update your details.</p>
          </div>
        )}
        {partner.status === 'rejected' && (
          <div className="bg-red-50 border border-red-300 rounded-xl px-5 py-3">
            <p className="text-sm font-bold text-red-700">Profile Rejected</p>
            {partner.rejectionReason && <p className="text-xs text-red-600 mt-0.5">Reason: {partner.rejectionReason}</p>}
            <p className="text-xs text-red-600 mt-0.5">Please update your information and contact an administrator.</p>
          </div>
        )}
        {partner.status === 'approved' && !partner.isVisible && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-3">
            <p className="text-sm font-bold text-blue-800">Profile Approved — Currently Hidden</p>
            <p className="text-xs text-blue-700 mt-0.5">Your profile is approved but not yet visible to facilities. Admin controls visibility.</p>
          </div>
        )}
        {partner.status === 'approved' && partner.isVisible && (
          <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-3">
            <p className="text-sm font-bold text-green-800">Profile Active & Visible</p>
            <p className="text-xs text-green-700 mt-0.5">Your profile is live and visible to facilities on the platform.</p>
          </div>
        )}

        {/* Logo upload */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 flex flex-col gap-4">
          <p className="text-sm font-bold text-[#94A3B8] uppercase tracking-wide">Logo</p>
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-center overflow-hidden flex-shrink-0">
              {partner.logoUrl
                ? <img src={partner.logoUrl} alt={partner.name} className="w-full h-full object-contain p-1" />
                : <span className="text-3xl">🤝</span>
              }
            </div>
            <div className="flex flex-col gap-2">
              <button type="button" onClick={() => fileRef.current?.click()} disabled={uploadLogo.isPending}
                className="px-4 py-2 bg-[#09488B] text-white rounded-lg text-sm font-semibold hover:bg-[#073a70] disabled:opacity-60 transition-colors">
                {uploadLogo.isPending ? 'Uploading…' : partner.logoUrl ? 'Change Logo' : 'Upload Logo'}
              </button>
              <p className="text-xs text-[#94A3B8]">PNG, JPG or SVG. Max 5MB.</p>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 flex flex-col gap-5">
          <p className="text-sm font-bold text-[#94A3B8] uppercase tracking-wide">Basic Info</p>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#334155]">Business Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your business name" className={inputCls} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#334155]">Category</label>
              <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. home-health" className={inputCls} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#334155]">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Tell facilities about your services..." rows={4}
              className="w-full px-4 py-3 rounded-lg border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#09488B33] focus:border-[#09488B] transition-colors placeholder-[#94A3B8] resize-none" />
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 flex flex-col gap-5">
          <p className="text-sm font-bold text-[#94A3B8] uppercase tracking-wide">Contact Information</p>

          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#334155]">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="contact@yourcompany.com" className={inputCls} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#334155]">Phone</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(000) 000-0000" className={inputCls} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#334155]">Website <span className="text-[#94A3B8] font-normal">(Optional)</span></label>
            <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://yourcompany.com" className={inputCls} />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#334155]">Address <span className="text-[#94A3B8] font-normal">(Optional)</span></label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Business Ave, City, State" className={inputCls} />
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="w-full py-4 bg-[#FFFFFFCC] sticky bottom-0 left-0 px-8 border-t border-solid border-[#09488B1A] flex justify-end items-center gap-3">
        <button onClick={handleDiscard} className="px-6 py-3 rounded-lg">
          <p className="font-semibold text-sm text-[#475569]">Discard Changes</p>
        </button>
        <button onClick={handleSave} disabled={update.isPending}
          className="px-10 py-3 rounded-lg bg-[#09488B] hover:bg-[#073a70] disabled:opacity-50 transition-colors">
          <p className="font-bold text-sm text-white uppercase">{update.isPending ? 'Saving…' : 'Save Changes'}</p>
        </button>
      </div>
    </div>
  );
}
