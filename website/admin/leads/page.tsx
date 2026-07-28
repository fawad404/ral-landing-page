'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useLeads, useDeleteLead } from '@/hooks/useLeads';
import { APP_ROUTES } from '@/api/endpoints';
import type { LeadType, LeadStatus } from '@/types/lead.types';

const TYPE_TABS: Array<{ value: LeadType | 'all'; label: string }> = [
  { value: 'all', label: 'All Leads' },
  { value: 'facility', label: 'Facility Inquiries' },
  { value: 'partner', label: 'Founding Partners' },
];

const STATUS_BADGE: Record<LeadStatus, string> = {
  new: 'bg-blue-100 text-blue-700',
  reviewed: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-600',
};

export default function AdminLeadsPage() {
  const [tab, setTab] = useState<LeadType | 'all'>('all');
  const [search, setSearch] = useState('');
  const deleteLead = useDeleteLead();

  const params = tab !== 'all' ? { type: tab } : undefined;
  const { data: leads = [], isLoading, isError, refetch } = useLeads(params);

  const filtered = leads.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (!confirm('Delete this lead?')) return;
    deleteLead.mutate(id);
  };

  return (
    <div className="p-8 flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-black text-[#0F172A]">Leads</h1>
        <p className="text-[#64748B] mt-1">Landing page submissions from RAL homes and founding partners.</p>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex bg-[#F1F5F9] rounded-xl p-1 gap-0">
          {TYPE_TABS.map(t => (
            <button key={t.value} onClick={() => setTab(t.value)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t.value ? 'bg-white text-[#09488B] shadow-sm' : 'text-[#64748B]'}`}>
              {t.label}
            </button>
          ))}
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..."
          className="border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#09488B] w-72" />
      </div>

      {isLoading && <div className="text-center py-16 text-[#64748B]">Loading leads...</div>}
      {isError && (
        <div className="text-center py-16">
          <p className="text-red-500 mb-2">Failed to load leads.</p>
          <button onClick={() => refetch()} className="text-sm text-[#09488B] underline">Retry</button>
        </div>
      )}

      {!isLoading && !isError && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-sm">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-[#94A3B8]">No leads found.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                  <th className="text-left px-6 py-3.5 font-semibold text-[#64748B]">Name</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-[#64748B]">Email</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-[#64748B]">Type</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-[#64748B]">Status</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-[#64748B]">Date</th>
                  <th className="text-right px-6 py-3.5 font-semibold text-[#64748B]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead, i) => (
                  <tr key={lead._id} className={`border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors ${i === filtered.length - 1 ? 'border-0' : ''}`}>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-[#0F172A]">{lead.name}</p>
                      {lead.homeName && <p className="text-xs text-[#64748B] mt-0.5">{lead.homeName}</p>}
                      {lead.companyName && <p className="text-xs text-[#64748B] mt-0.5">{lead.companyName}</p>}
                    </td>
                    <td className="px-6 py-4 text-[#475569]">{lead.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${lead.type === 'facility' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}`}>
                        {lead.type === 'facility' ? 'Facility' : 'Partner'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_BADGE[lead.status]}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#64748B]">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={APP_ROUTES.ADMIN_LEAD_DETAIL(lead._id)}
                          className="px-3 py-1.5 bg-[#09488B] text-white text-xs font-semibold rounded-lg hover:bg-[#063264] transition-colors">
                          View
                        </Link>
                        <button onClick={() => handleDelete(lead._id)}
                          className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-100 transition-colors">
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
    </div>
  );
}
