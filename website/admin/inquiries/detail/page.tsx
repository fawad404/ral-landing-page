'use client';
import React, { useState } from 'react';
import CustomSelect from '@/components/global/CustomSelect';
import Link from 'next/link';
import { useInquiry, useRunMatching, useManualAssign, useUpdateInquiry } from '@/hooks/useInquiries';
import { useFacilities } from '@/hooks/useFacilities';
import { APP_ROUTES } from '@/api/endpoints';
import type { InquiryStatus } from '@/types/inquiry.types';

const STATUS_BADGE: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  placed: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-gray-500',
};

export default function AdminInquiryDetailPage({ id }: { id: string }) {
  const { data: inquiry, isLoading, isError } = useInquiry(id);
  const { data: facilities = [] } = useFacilities({ status: 'approved' });
  const runMatching = useRunMatching(id);
  const manualAssign = useManualAssign(id);
  const updateInquiry = useUpdateInquiry(id);

  const [manualFacilityId, setManualFacilityId] = useState('');
  const [manualReason, setManualReason] = useState('');
  const [newStatus, setNewStatus] = useState<InquiryStatus | ''>('');

  if (isLoading) return (
    <div className="p-8 flex justify-center items-center h-64">
      <div className="w-8 h-8 border-4 border-[#09488B] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (isError) return (
    <div className="p-8 flex flex-col gap-3">
      <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4">
        <p className="text-sm font-semibold text-red-700">Failed to load inquiry. It may have been deleted or you may not have access.</p>
      </div>
      <Link href={APP_ROUTES.ADMIN_INQUIRIES} className="text-[#09488B] text-sm font-semibold">← Back to Inquiries</Link>
    </div>
  );

  if (!inquiry) return (
    <div className="p-8">
      <p className="text-[#64748B]">Inquiry not found.</p>
      <Link href={APP_ROUTES.ADMIN_INQUIRIES} className="text-[#09488B] text-sm font-semibold mt-2 inline-block">← Back to Inquiries</Link>
    </div>
  );

  const handleManualAssign = () => {
    if (!manualFacilityId) return;
    manualAssign.mutate({ facilityId: manualFacilityId, reason: manualReason || undefined }, {
      onSuccess: () => { setManualFacilityId(''); setManualReason(''); },
    });
  };

  const handleStatusUpdate = () => {
    if (!newStatus) return;
    updateInquiry.mutate({ status: newStatus }, { onSuccess: () => setNewStatus('') });
  };

  return (
    <div className="p-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link href={APP_ROUTES.ADMIN_INQUIRIES} className="text-sm text-[#09488B] font-semibold hover:underline">← All Inquiries</Link>
          <h1 className="text-3xl font-black text-[#0F172A] mt-1">{inquiry.familyData.name}</h1>
          <p className="text-[#64748B]">{inquiry.familyData.email} {inquiry.familyData.phone && `· ${inquiry.familyData.phone}`}</p>
        </div>
        <span className={`text-sm font-bold px-3 py-1 rounded-full capitalize ${STATUS_BADGE[inquiry.status]}`}>{inquiry.status}</span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Left col: Inquiry Details */}
        <div className="col-span-1 flex flex-col gap-4">
          {/* Family Info */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
            <p className="font-bold text-sm text-[#0F172A] mb-3">Family Information</p>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between"><span className="text-[#64748B]">Relationship</span><span className="font-medium text-[#0F172A]">{inquiry.familyData.relationship ?? '—'}</span></div>
              <div className="flex justify-between"><span className="text-[#64748B]">Submitted</span><span className="font-medium text-[#0F172A]">{new Date(inquiry.createdAt).toLocaleDateString()}</span></div>
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
            <p className="font-bold text-sm text-[#0F172A] mb-3">Requirements</p>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between"><span className="text-[#64748B]">ZIP Code</span><span className="font-medium">{inquiry.requirements?.zipCode ?? '—'}</span></div>
              <div className="flex justify-between"><span className="text-[#64748B]">Room Type</span><span className="font-medium">{inquiry.requirements?.roomType ?? '—'}</span></div>
              <div className="flex justify-between"><span className="text-[#64748B]">Urgency</span><span className="font-medium">{inquiry.requirements?.urgency ?? '—'}</span></div>
              {inquiry.requirements?.budget && (
                <div className="flex justify-between"><span className="text-[#64748B]">Budget</span>
                  <span className="font-medium">${inquiry.requirements.budget.min ?? 0}–${inquiry.requirements.budget.max ?? 0}</span></div>
              )}
              {(inquiry.requirements?.services ?? []).length > 0 && (
                <div className="flex flex-col gap-1 mt-1">
                  <span className="text-[#64748B]">Services Needed</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {inquiry.requirements!.services!.map(s => (
                      <span key={s} className="text-xs bg-[#09488B0D] text-[#09488B] px-2 py-0.5 rounded-full font-medium">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {inquiry.requirements?.notes && (
                <div className="flex flex-col gap-1 mt-1">
                  <span className="text-[#64748B]">Notes</span>
                  <p className="text-xs bg-[#F8FAFC] rounded-lg p-2 text-[#475569]">{inquiry.requirements.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Update Status */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
            <p className="font-bold text-sm text-[#0F172A] mb-3">Update Status</p>
            <div className="mb-3">
              <CustomSelect
                value={newStatus}
                onChange={(v) => setNewStatus(v as InquiryStatus)}
                placeholder="— Select new status —"
                options={['new', 'contacted', 'placed', 'closed'].map(s => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))}
              />
            </div>
            <button onClick={handleStatusUpdate} disabled={!newStatus || updateInquiry.isPending}
              className="w-full bg-[#09488B] text-white py-2 rounded-xl text-sm font-semibold hover:bg-[#073a70] disabled:opacity-50">
              {updateInquiry.isPending ? 'Saving…' : 'Save Status'}
            </button>
          </div>
        </div>

        {/* Right col: Matching */}
        <div className="col-span-2 flex flex-col gap-4">
          {/* Match Reasoning */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="font-bold text-sm text-[#0F172A]">Matching Engine</p>
              <button onClick={() => runMatching.mutate()} disabled={runMatching.isPending}
                className="bg-[#09488B] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#073a70] disabled:opacity-60">
                {runMatching.isPending ? '⟳ Running…' : '▶ Run Matching'}
              </button>
            </div>

            {inquiry.matchReason ? (
              <div className="bg-[#09488B0D] border border-[#09488B33] rounded-xl p-4">
                <p className="text-xs font-bold text-[#09488B] mb-2">MATCH REASONING</p>
                <div className="flex flex-col gap-2">
                  {inquiry.matchReason.split(' | ').map((line, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-[#09488B] text-xs font-bold mt-0.5">{i + 1}.</span>
                      <p className="text-xs text-[#475569]">{line}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-[#F8FAFC] border border-dashed border-[#E2E8F0] rounded-xl p-6 text-center">
                <p className="text-sm text-[#94A3B8]">No matching has been run yet.</p>
                <p className="text-xs text-[#94A3B8] mt-1">Click "Run Matching" to automatically find best-fit facilities.</p>
              </div>
            )}
          </div>

          {/* Assigned Facilities */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
            <p className="font-bold text-sm text-[#0F172A] mb-3">
              Assigned Facilities ({inquiry.assignedFacilityIds.length})
            </p>
            {inquiry.assignedFacilityIds.length > 0 ? (
              <div className="flex flex-col gap-2">
                {inquiry.assignedFacilityIds.map((fac, i) => {
                  const name = typeof fac === 'object' ? fac.name : String(fac);
                  const histEntry = inquiry.matchHistory.find(h =>
                    (typeof h.facilityId === 'object' ? (h.facilityId as any)._id : h.facilityId) === (typeof fac === 'object' ? fac._id : fac)
                  );
                  return (
                    <div key={i} className={`border rounded-xl p-3 ${histEntry?.isManualOverride ? 'border-yellow-200 bg-yellow-50' : 'border-[#E2E8F0]'}`}>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-[#0F172A]">{name}</p>
                        <div className="flex items-center gap-2">
                          {histEntry?.isManualOverride && <span className="text-[10px] font-bold text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full">MANUAL</span>}
                          {histEntry?.score !== undefined && (
                            <span className="text-xs font-bold text-[#09488B]">{(histEntry.score * 100).toFixed(0)}% match</span>
                          )}
                        </div>
                      </div>
                      {histEntry?.reason && <p className="text-xs text-[#64748B] mt-1">{histEntry.reason}</p>}
                    </div>
                  );
                })}
              </div>
            ) : <p className="text-sm text-[#94A3B8]">No facilities assigned yet.</p>}
          </div>

          {/* Manual Override */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
            <p className="font-bold text-sm text-[#0F172A] mb-1">Manual Override</p>
            <p className="text-xs text-[#64748B] mb-3">Force-assign a specific facility regardless of algorithm score.</p>
            <div className="flex flex-col gap-3">
              <CustomSelect
                value={manualFacilityId}
                onChange={setManualFacilityId}
                placeholder="— Select facility —"
                options={facilities.map(f => ({ value: f._id, label: `${f.name} (${f.address?.city ?? 'N/A'})` }))}
              />
              <input value={manualReason} onChange={e => setManualReason(e.target.value)}
                placeholder="Reason for manual assignment (optional)"
                className="border border-[#E2E8F0] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#09488B]" />
              <button onClick={handleManualAssign} disabled={!manualFacilityId || manualAssign.isPending}
                className="bg-yellow-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-yellow-600 disabled:opacity-50">
                {manualAssign.isPending ? 'Assigning…' : '⚡ Manually Assign'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
