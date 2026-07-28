'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMyPartner, useCreateMyPartner } from '@/hooks/usePartners';
import { useAuthStore } from '@/store/authStore';
import { APP_ROUTES } from '@/api/endpoints';
import type { CreatePartnerDto } from '@/types/partner.types';

const createSchema = z.object({
  name: z.string().min(1, 'Business name is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
  contactInfo: z.object({
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    phone: z.string().optional(),
    website: z.string().optional(),
    address: z.string().optional(),
  }).optional(),
});
type CreateForm = z.infer<typeof createSchema>;

const inputCls = "w-full px-4 py-3 rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#09488B33] focus:border-[#09488B] transition-colors placeholder-[#94A3B8]";

function CreateProfileForm() {
  const create = useCreateMyPartner();
  const { register, handleSubmit, formState: { errors } } = useForm<CreateForm>({ resolver: zodResolver(createSchema) });

  const onSubmit = (data: CreateForm) => {
    const payload: CreatePartnerDto = {
      name: data.name,
      category: data.category,
      description: data.description,
      contactInfo: data.contactInfo,
    };
    create.mutate(payload);
  };

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
      <div className="px-6 py-5 border-b border-[#E2E8F0] bg-[#F8FAFC]">
        <h2 className="text-lg font-bold text-[#0F172A]">Create Your Partner Profile</h2>
        <p className="text-sm text-[#64748B] mt-0.5">Submit your business information for admin review. You'll be notified once approved.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#334155]">Business Name *</label>
            <input {...register('name')} placeholder="e.g. ABC Home Health" className={inputCls} />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#334155]">Category *</label>
            <input {...register('category')} placeholder="e.g. home-health, pharmacy" className={inputCls} />
            {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#334155]">Description <span className="text-[#94A3B8] font-normal">(Optional)</span></label>
          <textarea {...register('description')} rows={3} placeholder="Describe your services for facilities..."
            className="w-full px-4 py-3 rounded-lg border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#09488B33] focus:border-[#09488B] resize-none placeholder-[#94A3B8]" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#334155]">Contact Email</label>
            <input {...register('contactInfo.email')} type="email" placeholder="contact@yourbusiness.com" className={inputCls} />
            {errors.contactInfo?.email && <p className="text-xs text-red-500">{errors.contactInfo.email.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#334155]">Phone</label>
            <input {...register('contactInfo.phone')} placeholder="(000) 000-0000" className={inputCls} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#334155]">Website</label>
            <input {...register('contactInfo.website')} placeholder="https://yourbusiness.com" className={inputCls} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#334155]">Address</label>
            <input {...register('contactInfo.address')} placeholder="123 Main St, City, AZ" className={inputCls} />
          </div>
        </div>

        <button type="submit" disabled={create.isPending}
          className="bg-[#09488B] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#073a70] disabled:opacity-60 transition-colors mt-1">
          {create.isPending ? 'Submitting…' : 'Submit for Review'}
        </button>
      </form>
    </div>
  );
}

export default function VendorDashboardPage() {
  const { data: partners, isLoading, isError, refetch } = useMyPartner();
  const user = useAuthStore((s) => s.user);
  const partner = partners?.[0];

  if (isLoading) return (
    <div className="p-8 flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-[#09488B] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (isError) return (
    <div className="p-8 flex flex-col gap-4 max-w-4xl">
      <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 flex items-center justify-between">
        <p className="text-sm font-semibold text-red-700">Failed to load your partner profile.</p>
        <button onClick={() => refetch()} className="text-xs font-semibold text-[#09488B] hover:underline ml-4">Retry</button>
      </div>
    </div>
  );

  return (
    <div className="p-8 flex flex-col gap-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-black text-[#0F172A]">
          Welcome{user?.firstName ? `, ${user.firstName}` : ''}
        </h1>
        <p className="text-[#64748B] mt-1">Your vendor partner overview.</p>
      </div>

      {/* No profile yet → show create form */}
      {!partner && <CreateProfileForm />}

      {/* Pending approval banner */}
      {partner?.status === 'pending' && (
        <div className="bg-yellow-50 border border-yellow-300 rounded-xl px-5 py-4">
          <p className="text-sm font-bold text-yellow-800">Profile Under Review</p>
          <p className="text-xs text-yellow-700 mt-0.5">Your profile has been submitted and is awaiting admin approval. We'll update you once it's reviewed.</p>
        </div>
      )}

      {/* Rejected banner */}
      {partner?.status === 'rejected' && (
        <div className="bg-red-50 border border-red-300 rounded-xl px-5 py-4">
          <p className="text-sm font-bold text-red-700">Profile Rejected</p>
          {partner.rejectionReason && (
            <p className="text-xs text-red-600 mt-1">Reason: {partner.rejectionReason}</p>
          )}
          <p className="text-xs text-red-600 mt-1">Please update your profile and contact an administrator.</p>
        </div>
      )}

      {/* Approved profile card */}
      {partner && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 flex flex-col gap-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {partner.logoUrl ? (
                <img src={partner.logoUrl} alt={partner.name} className="w-14 h-14 rounded-xl object-cover border border-[#E2E8F0]" />
              ) : (
                <div className="w-14 h-14 bg-[#F1F5F9] rounded-xl flex items-center justify-center text-2xl">🤝</div>
              )}
              <div>
                <p className="text-xl font-black text-[#0F172A]">{partner.name}</p>
                <p className="text-sm text-[#64748B] capitalize mt-0.5">{partner.category}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
                partner.status === 'approved' ? 'bg-green-100 text-green-700' :
                partner.status === 'rejected' ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {partner.status}
              </span>
              {partner.status === 'approved' && (
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${partner.isVisible ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                  {partner.isVisible ? 'Visible to Facilities' : 'Hidden'}
                </span>
              )}
            </div>
          </div>

          {partner.description && (
            <p className="text-sm text-[#475569] leading-relaxed">{partner.description}</p>
          )}

          {partner.contactInfo && Object.values(partner.contactInfo).some(Boolean) && (
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#F1F5F9]">
              {partner.contactInfo.email && (
                <div>
                  <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wide">Email</p>
                  <p className="text-sm text-[#0F172A] mt-0.5">{partner.contactInfo.email}</p>
                </div>
              )}
              {partner.contactInfo.phone && (
                <div>
                  <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wide">Phone</p>
                  <p className="text-sm text-[#0F172A] mt-0.5">{partner.contactInfo.phone}</p>
                </div>
              )}
              {partner.contactInfo.website && (
                <div>
                  <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wide">Website</p>
                  <p className="text-sm text-[#09488B] mt-0.5">{partner.contactInfo.website}</p>
                </div>
              )}
              {partner.contactInfo.address && (
                <div>
                  <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wide">Address</p>
                  <p className="text-sm text-[#0F172A] mt-0.5">{partner.contactInfo.address}</p>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-3 pt-2 border-t border-[#F1F5F9]">
            <div>
              <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wide">Member Since</p>
              <p className="text-sm text-[#0F172A] mt-0.5">{new Date(partner.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <Link href={APP_ROUTES.VENDOR_PROFILE}
            className="w-full text-center bg-[#09488B] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#073a70] transition-colors">
            Edit Profile
          </Link>
        </div>
      )}
    </div>
  );
}
