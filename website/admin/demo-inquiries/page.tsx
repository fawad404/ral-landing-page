'use client';
import React, { useState } from 'react';
import { useDemoInquiries, useDeleteDemoInquiry, useUpdateDemoInquiry } from '@/hooks/useDemoInquiries';
import type { DemoInquiry, DemoInquiryType, DemoInquiryStatus } from '@/types/demo-inquiry.types';

const TYPE_TABS: Array<{ value: DemoInquiryType | 'all'; label: string }> = [
  { value: 'all', label: 'All Inquiries' },
  { value: 'discharge-planner', label: 'Discharge Planners' },
  { value: 'facility', label: 'Facility Owners' },
  { value: 'preferred-partner', label: 'Preferred Partners' },
];

const STATUS_BADGE: Record<DemoInquiryStatus, string> = {
  new: 'bg-blue-100 text-blue-700',
  reviewed: 'bg-green-100 text-green-700',
};

function DetailModal({ inquiry, onClose }: { inquiry: DemoInquiry; onClose: () => void }) {
  const update = useUpdateDemoInquiry(inquiry._id);
  const [notes, setNotes] = useState(inquiry.adminNotes ?? '');
  const [status, setStatus] = useState<DemoInquiryStatus>(inquiry.status);

  const handleSave = () => {
    update.mutate({ status, adminNotes: notes }, { onSuccess: onClose });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E2E8F0]">
          <div>
            <h2 className="text-lg font-black text-[#0F172A]">Demo Inquiry</h2>
            <p className="text-sm text-[#64748B] mt-0.5">
              Submitted {new Date(inquiry.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 bg-[#F1F5F9] hover:bg-[#E2E8F0] rounded-xl flex items-center justify-center text-[#64748B] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Type Badge */}
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              inquiry.type === 'facility'
                ? 'bg-blue-50 text-blue-700'
                : inquiry.type === 'preferred-partner'
                ? 'bg-amber-50 text-amber-700'
                : 'bg-teal-50 text-teal-700'
            }`}>
              {inquiry.type === 'facility'
                ? 'Facility Owner'
                : inquiry.type === 'preferred-partner'
                ? 'Preferred Partner'
                : 'Discharge Planner'}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_BADGE[inquiry.status]}`}>
              {inquiry.status}
            </span>
          </div>

          {/* Contact Info */}
          <div className="bg-[#F8FAFC] rounded-xl p-4 space-y-2">
            <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-3">Contact Details</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-[#94A3B8] text-xs">Name</p>
                <p className="font-semibold text-[#0F172A]">{inquiry.name}</p>
              </div>
              <div>
                <p className="text-[#94A3B8] text-xs">Email</p>
                <p className="font-semibold text-[#0F172A]">{inquiry.email}</p>
              </div>
              {inquiry.phone && (
                <div>
                  <p className="text-[#94A3B8] text-xs">Phone</p>
                  <p className="font-semibold text-[#0F172A]">{inquiry.phone}</p>
                </div>
              )}
              {inquiry.type === 'discharge-planner' && (
                <>
                  {inquiry.organization && (
                    <div>
                      <p className="text-[#94A3B8] text-xs">Organization</p>
                      <p className="font-semibold text-[#0F172A]">{inquiry.organization}</p>
                    </div>
                  )}
                  {inquiry.role && (
                    <div>
                      <p className="text-[#94A3B8] text-xs">Role</p>
                      <p className="font-semibold text-[#0F172A]">{inquiry.role}</p>
                    </div>
                  )}
                </>
              )}
              {inquiry.type === 'facility' && (
                <>
                  {inquiry.facilityName && (
                    <div>
                      <p className="text-[#94A3B8] text-xs">Facility Name</p>
                      <p className="font-semibold text-[#0F172A]">{inquiry.facilityName}</p>
                    </div>
                  )}
                  {inquiry.city && (
                    <div>
                      <p className="text-[#94A3B8] text-xs">City</p>
                      <p className="font-semibold text-[#0F172A]">{inquiry.city}</p>
                    </div>
                  )}
                  {inquiry.beds && (
                    <div>
                      <p className="text-[#94A3B8] text-xs">Beds</p>
                      <p className="font-semibold text-[#0F172A]">{inquiry.beds}</p>
                    </div>
                  )}
                  {inquiry.availability && (
                    <div>
                      <p className="text-[#94A3B8] text-xs">Current Availability</p>
                      <p className="font-semibold text-[#0F172A]">{inquiry.availability}</p>
                    </div>
                  )}
                </>
              )}
              {inquiry.type === 'preferred-partner' && (
                <>
                  {inquiry.company && (
                    <div>
                      <p className="text-[#94A3B8] text-xs">Company / Organization</p>
                      <p className="font-semibold text-[#0F172A]">{inquiry.company}</p>
                    </div>
                  )}
                  {inquiry.serviceCategory && (
                    <div>
                      <p className="text-[#94A3B8] text-xs">Service Category</p>
                      <p className="font-semibold text-[#0F172A]">{inquiry.serviceCategory}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-semibold text-[#334155] block mb-1.5">Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as DemoInquiryStatus)}
              className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#09488B]"
            >
              <option value="new">New</option>
              <option value="reviewed">Reviewed</option>
            </select>
          </div>

          {/* Admin Notes */}
          <div>
            <label className="text-sm font-semibold text-[#334155] block mb-1.5">Admin Notes</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              placeholder="Add internal notes about this inquiry..."
              className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#09488B] resize-none placeholder-[#94A3B8]"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-[#E2E8F0] flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={update.isPending}
            className="px-5 py-2 bg-[#09488B] text-white text-sm font-semibold rounded-xl hover:bg-[#063264] transition-colors disabled:opacity-60"
          >
            {update.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminDemoInquiriesPage() {
  const [tab, setTab] = useState<DemoInquiryType | 'all'>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<DemoInquiry | null>(null);
  const deleteInquiry = useDeleteDemoInquiry();

  const params = tab !== 'all' ? { type: tab } : undefined;
  const { data: inquiries = [], isLoading, isError, refetch } = useDemoInquiries(params);

  const filtered = inquiries.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (!confirm('Delete this demo inquiry?')) return;
    deleteInquiry.mutate(id);
  };

  return (
    <div className="p-8 flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-black text-[#0F172A]">Demo Inquiries</h1>
        <p className="text-[#64748B] mt-1">Form submissions from the RAL Connect demo portal.</p>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex bg-[#F1F5F9] rounded-xl p-1 gap-0">
          {TYPE_TABS.map(t => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === t.value ? 'bg-white text-[#09488B] shadow-sm' : 'text-[#64748B]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#09488B] w-72"
        />
      </div>

      {isLoading && <div className="text-center py-16 text-[#64748B]">Loading inquiries...</div>}
      {isError && (
        <div className="text-center py-16">
          <p className="text-red-500 mb-2">Failed to load demo inquiries.</p>
          <button onClick={() => refetch()} className="text-sm text-[#09488B] underline">Retry</button>
        </div>
      )}

      {!isLoading && !isError && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-sm">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-[#94A3B8]">No demo inquiries found.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                  <th className="text-left px-6 py-3.5 font-semibold text-[#64748B]">Name</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-[#64748B]">Email</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-[#64748B]">Type</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-[#64748B]">Details</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-[#64748B]">Status</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-[#64748B]">Date</th>
                  <th className="text-right px-6 py-3.5 font-semibold text-[#64748B]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inquiry, i) => (
                  <tr
                    key={inquiry._id}
                    className={`border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors ${
                      i === filtered.length - 1 ? 'border-0' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold text-[#0F172A]">{inquiry.name}</p>
                      {inquiry.facilityName && <p className="text-xs text-[#64748B] mt-0.5">{inquiry.facilityName}</p>}
                      {inquiry.organization && <p className="text-xs text-[#64748B] mt-0.5">{inquiry.organization}</p>}
                      {inquiry.company && <p className="text-xs text-[#64748B] mt-0.5">{inquiry.company}</p>}
                    </td>
                    <td className="px-6 py-4 text-[#475569]">{inquiry.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        inquiry.type === 'facility'
                          ? 'bg-blue-50 text-blue-700'
                          : inquiry.type === 'preferred-partner'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-teal-50 text-teal-700'
                      }`}>
                        {inquiry.type === 'facility'
                          ? 'Facility'
                          : inquiry.type === 'preferred-partner'
                          ? 'Preferred Partner'
                          : 'Discharge Planner'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#475569] text-xs">
                      {inquiry.type === 'facility' && inquiry.city && (
                        <span>{inquiry.city}{inquiry.beds ? ` · ${inquiry.beds} beds` : ''}</span>
                      )}
                      {inquiry.type === 'discharge-planner' && inquiry.role && (
                        <span>{inquiry.role}</span>
                      )}
                      {inquiry.type === 'preferred-partner' && inquiry.serviceCategory && (
                        <span>{inquiry.serviceCategory}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_BADGE[inquiry.status]}`}>
                        {inquiry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#64748B]">
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelected(inquiry)}
                          className="px-3 py-1.5 bg-[#09488B] text-white text-xs font-semibold rounded-lg hover:bg-[#063264] transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(inquiry._id)}
                          className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-100 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {selected && <DetailModal inquiry={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
