'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useInquiries, useDeleteInquiry } from '@/hooks/useInquiries';
import { APP_ROUTES } from '@/api/endpoints';
import type { InquiryStatus } from '@/types/inquiry.types';

const STATUS_TABS: Array<{ value: InquiryStatus | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'placed', label: 'Placed' },
  { value: 'closed', label: 'Closed' },
];

const STATUS_BADGE: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  placed: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-gray-500',
};

export default function AdminInquiriesPage() {
  const [tab, setTab] = useState<InquiryStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const deleteInquiry = useDeleteInquiry();

  const params = tab !== 'all' ? { status: tab } : undefined;
  const { data: inquiries = [], isLoading, isError, refetch } = useInquiries(params);

  const filtered = inquiries.filter(inq =>
    inq.familyData.name.toLowerCase().includes(search.toLowerCase()) ||
    inq.familyData.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-black text-[#0F172A]">Inquiries</h1>
        <p className="text-[#64748B] mt-1">Manage care inquiries, run matching and track placements.</p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex bg-[#F1F5F9] rounded-xl p-1 gap-0 flex-wrap">
          {STATUS_TABS.map(t => (
            <button key={t.value} onClick={() => setTab(t.value)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t.value ? 'bg-white text-[#09488B] shadow-sm' : 'text-[#64748B]'}`}>
              {t.label}
            </button>
          ))}
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email…"
          className="border border-[#E2E8F0] rounded-xl px-4 py-2 text-sm outline-none focus:border-[#09488B] w-64" />
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-32"><div className="w-8 h-8 border-4 border-[#09488B] border-t-transparent rounded-full animate-spin" /></div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center h-32 gap-3">
            <p className="text-sm font-semibold text-red-500">Failed to load inquiries.</p>
            <button onClick={() => refetch()} className="text-xs font-semibold text-[#09488B] hover:underline">Retry</button>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <tr>{['Family', 'Services Needed', 'Location', 'Status', 'Matched', 'Date', 'Actions'].map(h => (
                <th key={h} className="text-left py-3 px-4 text-xs font-bold text-[#64748B] uppercase tracking-wide">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {filtered.map(inq => (
                <tr key={inq._id} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC]">
                  <td className="py-3 px-4">
                    <p className="text-sm font-semibold text-[#0F172A]">{inq.familyData.name}</p>
                    <p className="text-xs text-[#64748B]">{inq.familyData.email}</p>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {(inq.requirements?.services ?? []).slice(0, 2).map(s => (
                        <span key={s} className="text-[10px] bg-[#09488B0D] text-[#09488B] px-1.5 py-0.5 rounded-full font-medium">{s}</span>
                      ))}
                      {(inq.requirements?.services?.length ?? 0) > 2 && (
                        <span className="text-[10px] text-[#64748B]">+{(inq.requirements?.services?.length ?? 0) - 2}</span>
                      )}
                      {(!inq.requirements?.services || inq.requirements.services.length === 0) && <span className="text-xs text-[#94A3B8]">—</span>}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-[#475569]">{inq.requirements?.zipCode ?? '—'}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_BADGE[inq.status]}`}>{inq.status}</span>
                  </td>
                  <td className="py-3 px-4 text-sm text-[#475569]">{inq.assignedFacilityIds.length} facilities</td>
                  <td className="py-3 px-4 text-xs text-[#64748B]">{new Date(inq.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Link href={APP_ROUTES.ADMIN_INQUIRY_DETAIL(inq._id)}
                        className="text-xs bg-[#09488B] text-white px-2 py-1 rounded-lg hover:bg-[#073a70]">View</Link>
                      <button onClick={() => { if (confirm('Delete this inquiry?')) deleteInquiry.mutate(inq._id); }}
                        className="text-xs border border-red-200 text-red-500 px-2 py-1 rounded-lg hover:bg-red-50">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={7} className="text-center py-10 text-[#94A3B8] text-sm">No inquiries found</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
