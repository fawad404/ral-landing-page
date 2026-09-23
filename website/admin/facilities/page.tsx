'use client';
import React, { useState } from 'react';
import { useFacilities, useFlaggedFacilities, useApproveFacility, useRejectFacility, useToggleFacilityVisibility } from '@/hooks/useFacilities';
import type { Facility } from '@/types/facility.types';

const STATUS_BADGE: Record<string, string> = {
  approved: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  rejected: 'bg-red-100 text-red-500',
};

// A facility is only live (public search, discharge-planner requests) when it
// is approved AND visible, so pending/rejected ones never show as "Visible".
function visibility(f: Facility) {
  if (f.status !== 'approved') {
    return { label: 'Not live', cls: 'bg-gray-100 text-gray-500', title: 'Only approved facilities appear publicly or receive requests' };
  }
  return f.isVisible
    ? { label: 'Visible', cls: 'bg-green-100 text-green-700', title: 'Live: appears publicly and receives requests' }
    : { label: 'Hidden', cls: 'bg-gray-100 text-gray-500', title: 'Approved but hidden by admin' };
}

function FacilityDrawer({ facility, onClose }: { facility: Facility; onClose: () => void }) {
  const addr = facility.address
    ? [facility.address.street, facility.address.city, facility.address.state, facility.address.zipCode, facility.address.country]
        .filter(Boolean).join(', ')
    : null;

  const ownerName = typeof facility.ownerId === 'object'
    ? [facility.ownerId.firstName, facility.ownerId.lastName].filter(Boolean).join(' ') || facility.ownerId.email
    : null;
  const ownerEmail = typeof facility.ownerId === 'object' ? facility.ownerId.email : null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      {/* Drawer */}
      <div className="relative w-full max-w-lg h-full bg-white shadow-2xl flex flex-col overflow-hidden animate-slide-in-right">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E2E8F0] flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#0F172A]">{facility.name}</h2>
            {addr && <p className="text-sm text-[#64748B] mt-0.5">{addr}</p>}
          </div>
          <button onClick={onClose} className="text-[#94A3B8] hover:text-[#0F172A] text-2xl leading-none mt-0.5">×</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {/* Status row */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${STATUS_BADGE[facility.status]}`}>{facility.status}</span>
            <span title={visibility(facility).title} className={`text-xs font-semibold px-3 py-1 rounded-full ${visibility(facility).cls}`}>
              {visibility(facility).label}
            </span>
            {facility.isFlagged && <span className="text-xs font-semibold px-3 py-1 rounded-full bg-red-100 text-red-500">Flagged</span>}
          </div>

          {/* Owner */}
          {(ownerName || ownerEmail) && (
            <Section title="Owner">
              {ownerName && <Detail label="Name" value={ownerName} />}
              {ownerEmail && <Detail label="Email" value={ownerEmail} />}
            </Section>
          )}

          {/* Core stats */}
          <Section title="Capacity & Availability">
            <div className="grid grid-cols-2 gap-4">
              <StatCard label="Total Capacity" value={String(facility.capacity)} />
              <StatCard label="Available Beds" value={String(facility.availabilityCount)} />
            </div>
          </Section>

          {/* Contact */}
          {(facility.phone || facility.email || facility.website) && (
            <Section title="Contact Information">
              {facility.phone && <Detail label="Phone" value={facility.phone} />}
              {facility.email && <Detail label="Email" value={facility.email} />}
              {facility.website && <Detail label="Website" value={facility.website} />}
            </Section>
          )}

          {/* Description */}
          {facility.description && (
            <Section title="Description">
              <p className="text-sm text-[#475569] leading-relaxed">{facility.description}</p>
            </Section>
          )}

          {/* Services */}
          {facility.services?.length > 0 && (
            <Section title="Services Offered">
              <div className="flex flex-wrap gap-2">
                {facility.services.map(s => (
                  <span key={s} className="text-xs font-medium px-2.5 py-1 bg-[#09488B1A] text-[#09488B] rounded-full">{s}</span>
                ))}
              </div>
            </Section>
          )}

          {/* Pricing */}
          {facility.pricing && (facility.pricing.min || facility.pricing.max) && (
            <Section title="Pricing">
              <p className="text-sm text-[#475569]">
                {facility.pricing.currency ?? '$'}{facility.pricing.min ?? '—'} – {facility.pricing.currency ?? '$'}{facility.pricing.max ?? '—'} / month
              </p>
            </Section>
          )}

          {/* Photos */}
          {facility.photos && facility.photos.length > 0 && (
            <Section title={`Photos (${facility.photos.length})`}>
              <div className="grid grid-cols-3 gap-2">
                {facility.photos.map((photo, i) => (
                  <div key={i} className="aspect-square rounded-xl overflow-hidden border border-[#E2E8F0] bg-[#F8FAFC]">
                    <img src={photo.url} alt={photo.label || `Photo ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Policies */}
          {facility.policies && Object.values(facility.policies).some(Boolean) && (
            <Section title="Policies">
              {Object.entries(facility.policies).filter(([, v]) => v).map(([key, value]) => (
                <div key={key} className="mb-3">
                  <p className="text-xs font-bold text-[#0F172A] capitalize mb-1">{key}</p>
                  <p className="text-sm text-[#475569]">{value}</p>
                </div>
              ))}
            </Section>
          )}

          {/* Dates */}
          <Section title="Timestamps">
            <Detail label="Created" value={new Date(facility.createdAt).toLocaleString()} />
            <Detail label="Last Updated" value={new Date(facility.lastUpdated).toLocaleString()} />
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest mb-3">{title}</p>
      {children}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start py-1.5 border-b border-[#F1F5F9] last:border-0">
      <span className="text-sm text-[#64748B]">{label}</span>
      <span className="text-sm font-medium text-[#0F172A] text-right max-w-[55%]">{value}</span>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 text-center">
      <p className="text-2xl font-black text-[#0F172A]">{value}</p>
      <p className="text-xs text-[#64748B] mt-1">{label}</p>
    </div>
  );
}

function FacilityRow({ f, onApprove, onReject, onToggle, onView }: {
  f: Facility;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onToggle: (id: string, active: boolean) => void;
  onView: (f: Facility) => void;
}) {
  const addr = f.address ? `${f.address.city ?? ''}, ${f.address.zipCode ?? ''}`.replace(/^, |, $/, '') : '—';
  return (
    <tr className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC]">
      <td className="py-3 px-4">
        <p className="text-sm font-semibold text-[#0F172A]">{f.name}</p>
        <p className="text-xs text-[#64748B]">{addr}</p>
      </td>
      <td className="py-3 px-4">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_BADGE[f.status]}`}>{f.status}</span>
      </td>
      <td className="py-3 px-4 text-sm text-[#475569]">{f.availabilityCount} / {f.capacity}</td>
      <td className="py-3 px-4 text-xs text-[#64748B]">{new Date(f.lastUpdated).toLocaleDateString()}</td>
      <td className="py-3 px-4">
        {f.isFlagged ? <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">⚠ Flagged</span>
          : <span className="text-xs text-[#10B981]">✓ OK</span>}
      </td>
      <td className="py-3 px-4">
        <span title={visibility(f).title} className={`text-xs font-semibold px-2 py-0.5 rounded-full ${visibility(f).cls}`}>
          {visibility(f).label}
        </span>
      </td>
      <td className="py-3 px-4">
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => onView(f)}
            className="text-xs border border-[#09488B] text-[#09488B] px-2 py-1 rounded-lg hover:bg-[#09488B10]">
            View
          </button>
          {f.status === 'pending' && <>
            <button onClick={() => onApprove(f._id)} className="text-xs bg-[#09488B] text-white px-2 py-1 rounded-lg hover:bg-[#073a70]">Approve</button>
            <button onClick={() => onReject(f._id)} className="text-xs border border-red-300 text-red-500 px-2 py-1 rounded-lg hover:bg-red-50">Reject</button>
          </>}
          <button onClick={() => onToggle(f._id, !f.isVisible)}
            className="text-xs border border-[#E2E8F0] text-[#475569] px-2 py-1 rounded-lg hover:bg-[#F1F5F9]">
            {f.isVisible ? 'Hide' : 'Show'}
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function AdminFacilitiesPage() {
  const [tab, setTab] = useState<'all' | 'pending' | 'flagged'>('all');
  const [search, setSearch] = useState('');
  const [viewFacility, setViewFacility] = useState<Facility | null>(null);

  const allQuery = useFacilities(tab === 'pending' ? { status: 'pending' } : undefined);
  const flaggedQuery = useFlaggedFacilities();
  const approve = useApproveFacility();
  const reject = useRejectFacility();
  const toggle = useToggleFacilityVisibility();

  const source = tab === 'flagged' ? (flaggedQuery.data ?? []) : (allQuery.data ?? []);
  const filtered = source.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-8 flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-black text-[#0F172A]">Facilities</h1>
        <p className="text-[#64748B] mt-1">Review, approve and manage all facility listings.</p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex bg-[#F1F5F9] rounded-xl p-1 gap-0">
          {([['all', 'All'], ['pending', 'Pending Approval'], ['flagged', 'Flagged']] as const).map(([v, l]) => (
            <button key={v} onClick={() => setTab(v)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === v ? 'bg-white text-[#09488B] shadow-sm' : 'text-[#64748B]'}`}>
              {l}
            </button>
          ))}
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search facilities…"
          className="border border-[#E2E8F0] rounded-xl px-4 py-2 text-sm outline-none focus:border-[#09488B] w-64" />
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
        {allQuery.isLoading ? (
          <div className="flex justify-center items-center h-32"><div className="w-8 h-8 border-4 border-[#09488B] border-t-transparent rounded-full animate-spin" /></div>
        ) : allQuery.isError ? (
          <div className="flex flex-col items-center justify-center h-32 gap-3">
            <p className="text-sm font-semibold text-red-500">Failed to load facilities.</p>
            <button onClick={() => allQuery.refetch()} className="text-xs font-semibold text-[#09488B] hover:underline">Retry</button>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <tr>{['Facility', 'Status', 'Availability', 'Last Updated', 'Flag', 'Visibility', 'Actions'].map(h => (
                <th key={h} className="text-left py-3 px-4 text-xs font-bold text-[#64748B] uppercase tracking-wide">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {filtered.map(f => (
                <FacilityRow key={f._id} f={f}
                  onApprove={(id) => approve.mutate(id)}
                  onReject={(id) => reject.mutate(id)}
                  onToggle={(id, active) => toggle.mutate({ id, active })}
                  onView={(fac) => setViewFacility(fac)} />
              ))}
              {filtered.length === 0 && <tr><td colSpan={7} className="text-center py-10 text-[#94A3B8] text-sm">No facilities found</td></tr>}
            </tbody>
          </table>
        )}
      </div>

      {viewFacility && <FacilityDrawer facility={viewFacility} onClose={() => setViewFacility(null)} />}
    </div>
  );
}
