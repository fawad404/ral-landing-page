'use client';
import React, { useState } from 'react';
import { SearchIcon } from '@/assets';
import Header from '@/components/global/header';
import { useVisibleCaregivers } from '@/hooks/useCaregivers';
import type { Caregiver } from '@/types/caregiver.types';
import { CERTIFICATIONS, AVAILABILITY_OPTIONS } from '@/types/caregiver.types';

const CaregiverCard = ({ caregiver }: { caregiver: Caregiver }) => (
  <div className="bg-white rounded-xl border border-solid border-[#E2E8F0] overflow-hidden flex flex-col">
    {/* Header strip */}
    <div className="w-full h-28 bg-linear-to-br from-[#EFF6FF] to-[#DBEAFE] flex items-center justify-center relative">
      <div className="w-16 h-16 rounded-full bg-[#09488B] flex items-center justify-center text-white text-2xl font-bold shadow">
        {caregiver.firstName[0]}{caregiver.lastName[0]}
      </div>
      {caregiver.experienceYears > 0 && (
        <div className="absolute top-3 right-3 bg-white rounded-full px-2.5 py-1 text-xs font-bold text-[#09488B] shadow-sm">
          {caregiver.experienceYears}y exp
        </div>
      )}
    </div>

    {/* Body */}
    <div className="p-5 flex flex-col gap-3 flex-1">
      <div>
        <p className="text-lg font-bold text-[#0F172A]">{caregiver.firstName} {caregiver.lastName}</p>
        {caregiver.city && (
          <p className="text-xs text-[#64748B] mt-0.5">
            <svg className="inline w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {caregiver.city}, {caregiver.state ?? 'AZ'}
          </p>
        )}
      </div>

      {/* Certifications */}
      {caregiver.certifications.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {caregiver.certifications.map(c => (
            <span key={c} className="px-2.5 py-1 bg-[#EFF6FF] text-[#09488B] text-xs font-semibold rounded-full">{c}</span>
          ))}
        </div>
      )}

      {/* Availability */}
      {caregiver.availability.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {caregiver.availability.map(a => (
            <span key={a} className="px-2.5 py-1 bg-[#F0FDF4] text-green-700 text-xs font-semibold rounded-full">{a}</span>
          ))}
        </div>
      )}

      {/* Specializations */}
      {caregiver.specializations.length > 0 && (
        <p className="text-xs text-[#64748B]">
          <span className="font-semibold text-[#475569]">Specialties: </span>
          {caregiver.specializations.join(', ')}
        </p>
      )}

      {caregiver.bio && (
        <p className="text-xs text-[#64748B] line-clamp-2">{caregiver.bio}</p>
      )}
    </div>

    {/* Footer */}
    <div className="px-5 pb-5">
      {caregiver.phone || caregiver.email ? (
        <a
          href={caregiver.phone ? `tel:${caregiver.phone}` : `mailto:${caregiver.email}`}
          className="w-full flex items-center justify-center gap-2 bg-[#09488B] text-white text-xs font-bold py-2.5 rounded-lg hover:bg-[#083d77] transition-colors"
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Contact
        </a>
      ) : (
        <div className="w-full flex items-center justify-center bg-[#F1F5F9] text-[#94A3B8] text-xs font-semibold py-2.5 rounded-lg">
          No contact info
        </div>
      )}
    </div>
  </div>
);

export default function CaregiversPage() {
  const [search, setSearch] = useState('');
  const [certFilter, setCertFilter] = useState('');
  const [availFilter, setAvailFilter] = useState('');

  const params: Record<string, string> = {};
  if (search.trim()) params.search = search.trim();
  if (certFilter) params.certification = certFilter;
  if (availFilter) params.availability = availFilter;

  const { data: caregivers = [], isLoading, isError } = useVisibleCaregivers(params);

  return (
    <div className="w-full h-full flex flex-col gap-8 p-10">
      <Header
        title="Caregiver Directory"
        description="Find qualified caregivers available in the Arizona area."
      />

      {/* Search */}
      <div className="relative w-full">
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <SearchIcon />
        </div>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, city, or specialty..."
          className="w-full pl-12 pr-4 py-4.5 rounded-xl border border-solid border-[#E2E8F0] bg-white text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#09488B33] focus:border-[#09488B] transition-colors placeholder-[#94A3B8] shadow-[0px_1px_2px_0px_#0000000D]"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wide">Filter:</span>

        {/* Certification filter */}
        <select value={certFilter} onChange={e => setCertFilter(e.target.value)}
          className="px-4 py-2 rounded-full text-xs font-semibold border border-[#E2E8F0] bg-white text-[#475569] focus:outline-none focus:border-[#09488B]">
          <option value="">All Certifications</option>
          {CERTIFICATIONS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        {/* Availability filter */}
        <select value={availFilter} onChange={e => setAvailFilter(e.target.value)}
          className="px-4 py-2 rounded-full text-xs font-semibold border border-[#E2E8F0] bg-white text-[#475569] focus:outline-none focus:border-[#09488B]">
          <option value="">All Availability</option>
          {AVAILABILITY_OPTIONS.map(a => <option key={a} value={a}>{a}</option>)}
        </select>

        {(certFilter || availFilter || search) && (
          <button onClick={() => { setCertFilter(''); setAvailFilter(''); setSearch(''); }}
            className="px-4 py-2 rounded-full text-xs font-semibold text-red-600 border border-red-200 hover:bg-red-50 transition-colors">
            Clear Filters
          </button>
        )}

        <span className="ml-auto text-xs text-[#94A3B8]">{caregivers.length} caregiver{caregivers.length !== 1 ? 's' : ''} found</span>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-8 h-8 border-4 border-[#09488B] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : isError ? (
        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4">
          <p className="text-sm font-semibold text-red-700">Failed to load caregiver directory. Please try again later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-5">
          {caregivers.map(c => (
            <CaregiverCard key={c._id} caregiver={c} />
          ))}
          {caregivers.length === 0 && (
            <div className="col-span-3 py-20 flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-[#F1F5F9] flex items-center justify-center text-2xl">👤</div>
              <p className="text-base font-semibold text-[#94A3B8]">No caregivers found</p>
              <p className="text-sm text-[#CBD5E1]">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
