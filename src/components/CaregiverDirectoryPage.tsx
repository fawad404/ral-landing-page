'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Navbar from './Navbar';

const WORK_AREAS = ['Phoenix', 'Glendale', 'Peoria', 'Surprise', 'Scottsdale', 'Mesa', 'Chandler', 'Tempe', 'Gilbert', 'Other'] as const;
const SHIFTS = ['Morning', 'Afternoon', 'Evening', 'Overnight', 'Weekdays', 'Weekends', 'PRN', 'Live-In'] as const;
const PAGE_SIZE = 20;

interface Caregiver {
  _id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  city?: string;
  workAreas: string[];
  availability: string[];
  certifications: string[];
  experienceYears: number;
  availableNow: boolean;
  bio?: string;
  updatedAt: string;
}

interface PaginatedResponse {
  data: Caregiver[];
  total: number;
  page: number;
  totalPages: number;
}

function formatLastUpdated(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Updated today';
  if (diffDays === 1) return 'Updated yesterday';
  if (diffDays < 7) return `Updated ${diffDays} days ago`;
  return `Updated ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
}

function CaregiverCard({ c }: { c: Caregiver }) {
  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow">
      {/* Card header strip */}
      <div className="w-full h-auto pb-5 pt-12 bg-linear-to-br from-[#EFF6FF] to-[#DBEAFE] flex items-center px-5 gap-4 relative">
        <div className="w-14 h-14 rounded-full bg-brand flex items-center justify-center text-white text-xl font-black shadow shrink-0">
          {c.firstName[0]}{c.lastName[0]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base font-bold text-text-dark truncate">{c.firstName} {c.lastName}</p>
          {c.city && (
            <p className="text-xs text-text-subtle flex items-center gap-1 mt-0.5">
              <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {c.city}, AZ
            </p>
          )}
        </div>
        {c.availableNow ? (
          <span className="absolute top-3 left-3 flex items-center gap-1.5 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Available Now
          </span>
        ) : c.experienceYears > 0 ? (
          <span className="absolute top-3 right-3 bg-white text-brand text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
            {c.experienceYears}y exp
          </span>
        ) : null}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        {c.experienceYears > 0 && c.availableNow && (
          <p className="text-xs font-semibold text-text-subtle">{c.experienceYears} years experience</p>
        )}

        {c.workAreas.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-text-faint uppercase tracking-wide mb-1.5">Work Areas</p>
            <div className="flex flex-wrap gap-1.5">
              {c.workAreas.map(a => (
                <span key={a} className="px-2.5 py-1 bg-[#EFF6FF] text-brand text-xs font-semibold rounded-full">{a}</span>
              ))}
            </div>
          </div>
        )}

        {c.availability.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-text-faint uppercase tracking-wide mb-1.5">Shifts</p>
            <div className="flex flex-wrap gap-1.5">
              {c.availability.map(s => (
                <span key={s} className="px-2.5 py-1 bg-[#F0FDF4] text-green-700 text-xs font-semibold rounded-full">{s}</span>
              ))}
            </div>
          </div>
        )}

        {c.certifications.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-text-faint uppercase tracking-wide mb-1.5">Credentials</p>
            <div className="flex flex-wrap gap-1.5">
              {c.certifications.map(cert => (
                <span key={cert} className="px-2.5 py-1 bg-[#FDF4FF] text-purple-700 text-xs font-semibold rounded-full">{cert}</span>
              ))}
            </div>
          </div>
        )}

        {c.bio && <p className="text-xs text-text-subtle line-clamp-2 leading-relaxed">{c.bio}</p>}

        <p className="text-xs text-text-faint mt-auto pt-1">{formatLastUpdated(c.updatedAt)}</p>
      </div>

      {/* Contact buttons */}
      <div className="px-5 pb-5 flex gap-2">
        {c.phone ? (
          <a href={`tel:${c.phone}`}
            className="flex-1 flex items-center justify-center gap-1.5 bg-brand text-white text-xs font-bold py-2.5 rounded-xl hover:bg-[#083d77] transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Call
          </a>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-[#F1F5F9] text-[#CBD5E1] text-xs font-semibold py-2.5 rounded-xl">No phone</div>
        )}
        {c.email ? (
          <a href={`mailto:${c.email}`}
            className="flex-1 flex items-center justify-center gap-1.5 border border-brand text-brand text-xs font-bold py-2.5 rounded-xl hover:bg-[#EFF6FF] transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Email
          </a>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-[#F1F5F9] text-[#CBD5E1] text-xs font-semibold py-2.5 rounded-xl">No email</div>
        )}
      </div>
    </div>
  );
}

export default function CaregiverDirectoryPage() {
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [cityFilter, setCityFilter] = useState('');
  const [availableNowFilter, setAvailableNowFilter] = useState(false);
  const [shiftFilter, setShiftFilter] = useState('');

  const fetchCaregivers = useCallback(async (currentPage: number) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (cityFilter) params.set('workArea', cityFilter);
      if (availableNowFilter) params.set('availableNow', 'true');
      if (shiftFilter) params.set('shift', shiftFilter);
      params.set('page', String(currentPage));
      params.set('limit', String(PAGE_SIZE));

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/caregivers/visible?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const json: PaginatedResponse = await res.json();
      setCaregivers(json.data);
      setTotal(json.total);
      setTotalPages(json.totalPages);
    } catch {
      setError('Failed to load caregivers. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [cityFilter, availableNowFilter, shiftFilter]);

  useEffect(() => { setPage(1); }, [cityFilter, availableNowFilter, shiftFilter]);
  useEffect(() => { fetchCaregivers(page); }, [fetchCaregivers, page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setCityFilter('');
    setAvailableNowFilter(false);
    setShiftFilter('');
  };

  const hasFilters = cityFilter || availableNowFilter || shiftFilter;

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      {/* Page header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-text-dark">Caregiver Directory</h1>
              <p className="text-text-subtle mt-1.5">Browse qualified caregivers available across Arizona. Contact them directly.</p>
            </div>
            <Link href="/caregiver-apply"
              className="inline-flex items-center gap-2 bg-brand text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-[#083d77] transition-colors whitespace-nowrap self-start sm:self-auto">
              Apply as Caregiver →
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">

        {/* Legal Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4">
          <p className="text-xs text-amber-800 leading-relaxed">
            <span className="font-bold">Disclaimer: </span>
            RAL Connect does not employ, supervise, verify, or guarantee caregivers listed in this directory. Facility owners/managers are responsible for interviews, credential verification, background checks, and hiring decisions.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-border p-5">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex flex-col gap-1.5 min-w-40">
              <label className="text-xs font-semibold text-text-faint uppercase tracking-wide">City / Area</label>
              <select value={cityFilter} onChange={e => setCityFilter(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-border bg-white text-sm text-text-dark outline-none focus:border-brand transition-colors">
                <option value="">All Cities</option>
                {WORK_AREAS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1.5 min-w-40">
              <label className="text-xs font-semibold text-text-faint uppercase tracking-wide">Shift Type</label>
              <select value={shiftFilter} onChange={e => setShiftFilter(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-border bg-white text-sm text-text-dark outline-none focus:border-brand transition-colors">
                <option value="">All Shifts</option>
                {SHIFTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-text-faint uppercase tracking-wide">Available Now</label>
              <button type="button" onClick={() => setAvailableNowFilter(v => !v)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${
                  availableNowFilter ? 'bg-green-500 border-green-500 text-white' : 'border-border bg-white text-text-muted hover:border-brand'
                }`}>
                <span className={`w-2 h-2 rounded-full ${availableNowFilter ? 'bg-white' : 'bg-[#CBD5E1]'}`} />
                {availableNowFilter ? 'Available Now Only' : 'Show All'}
              </button>
            </div>

            {hasFilters && (
              <button onClick={clearFilters}
                className="px-4 py-2.5 text-sm font-semibold text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors">
                Clear Filters
              </button>
            )}

            <span className="ml-auto text-sm text-text-faint self-end pb-0.5">
              {loading ? 'Loading...' : `${total} caregiver${total !== 1 ? 's' : ''} found`}
            </span>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-border overflow-hidden animate-pulse">
                <div className="h-24 bg-[#F1F5F9]" />
                <div className="p-5 flex flex-col gap-3">
                  <div className="h-3 bg-border rounded w-3/4" />
                  <div className="h-3 bg-border rounded w-1/2" />
                  <div className="flex gap-1.5">
                    <div className="h-6 w-16 bg-border rounded-full" />
                    <div className="h-6 w-16 bg-border rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 flex items-center justify-between">
            <p className="text-sm font-semibold text-red-700">{error}</p>
            <button onClick={() => fetchCaregivers(page)} className="text-sm font-bold text-red-600 hover:underline">Retry</button>
          </div>
        ) : caregivers.length === 0 ? (
          <div className="py-24 flex flex-col items-center gap-4 bg-white rounded-2xl border border-border">
            <div className="w-16 h-16 rounded-full bg-[#F1F5F9] flex items-center justify-center text-3xl">👤</div>
            <p className="text-lg font-bold text-text-faint">No caregivers found</p>
            <p className="text-sm text-[#CBD5E1]">Try adjusting your filters.</p>
            {hasFilters && (
              <button onClick={clearFilters} className="text-sm font-bold text-brand hover:underline">Clear all filters</button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {caregivers.map(c => <CaregiverCard key={c._id} c={c} />)}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 py-4">
            <button onClick={() => handlePageChange(page - 1)} disabled={page <= 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border bg-white text-sm font-semibold text-text-muted hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Prev
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .reduce<(number | 'ellipsis')[]>((acc, p, idx, arr) => {
                  if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('ellipsis');
                  acc.push(p);
                  return acc;
                }, [])
                .map((item, idx) =>
                  item === 'ellipsis' ? (
                    <span key={`e-${idx}`} className="px-2 text-text-faint text-sm">…</span>
                  ) : (
                    <button key={item} onClick={() => handlePageChange(item as number)}
                      className={`w-9 h-9 rounded-xl text-sm font-semibold transition-colors ${
                        page === item ? 'bg-brand text-white' : 'border border-border bg-white text-text-muted hover:bg-surface'
                      }`}>
                      {item}
                    </button>
                  )
                )}
            </div>

            <button onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border bg-white text-sm font-semibold text-text-muted hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              Next
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="bg-white border border-border rounded-2xl p-6 text-center">
          <p className="text-base font-bold text-text-dark">Are you a caregiver in Arizona?</p>
          <p className="text-sm text-text-subtle mt-1">Submit your profile and get discovered by RAL facility owners.</p>
          <Link href="/caregiver-apply"
            className="inline-flex mt-4 bg-brand text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-[#083d77] transition-colors">
            Apply to the Directory →
          </Link>
        </div>
      </div>
    </div>
  );
}
