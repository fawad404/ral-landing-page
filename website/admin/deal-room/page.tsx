'use client';
import React, { useState } from 'react';
import { useAllDealRoomRequests, useApproveDealRoomRequest, useRejectDealRoomRequest } from '@/hooks/useDealRoom';
import type { DealRoomRequest, DealRoomStatus } from '@/types/deal-room.types';

const STATUS_BADGE: Record<DealRoomStatus, string> = {
  pending:  'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-500',
};

function RejectModal({ request, onClose }: { request: DealRoomRequest; onClose: () => void }) {
  const [reason, setReason] = useState('');
  const reject = useRejectDealRoomRequest();

  const handleReject = () => {
    reject.mutate({ id: request._id, reason: reason.trim() || undefined }, { onSuccess: onClose });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl border border-[#E2E8F0] w-full max-w-md shadow-xl">
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <h2 className="font-bold text-lg text-[#0F172A]">Reject Deal Room Request</h2>
          <button onClick={onClose} className="text-[#64748B] hover:text-[#0F172A] text-2xl leading-none">×</button>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <p className="text-sm text-[#475569]">
            You are rejecting the Deal Room access request from <span className="font-semibold text-[#0F172A]">{request.facilityName}</span>.
          </p>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[#475569]">Reason (optional)</label>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              rows={3}
              placeholder="Explain why access is being denied…"
              className="border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#09488B] resize-none"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={onClose} className="px-5 py-2 border border-[#E2E8F0] text-[#475569] rounded-xl text-sm font-semibold hover:bg-[#F1F5F9]">
              Cancel
            </button>
            <button onClick={handleReject} disabled={reject.isPending}
              className="px-5 py-2 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 disabled:opacity-60">
              {reject.isPending ? 'Rejecting…' : 'Reject Access'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RequestRow({ req, onApprove, onReject }: {
  req: DealRoomRequest;
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <tr className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC]">
      <td className="py-3 px-4">
        <p className="text-sm font-semibold text-[#0F172A]">{req.facilityName}</p>
        <p className="text-xs text-[#64748B]">Facility ID: {req.facilityId}</p>
      </td>
      <td className="py-3 px-4 text-xs text-[#64748B]">
        {new Date(req.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </td>
      <td className="py-3 px-4">
        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${STATUS_BADGE[req.status]}`}>
          {req.status}
        </span>
      </td>
      <td className="py-3 px-4">
        {req.rejectionReason
          ? <p className="text-xs text-[#64748B] italic max-w-[200px] truncate" title={req.rejectionReason}>{req.rejectionReason}</p>
          : <span className="text-xs text-[#CBD5E1]">—</span>
        }
      </td>
      <td className="py-3 px-4 text-xs text-[#64748B]">
        {req.reviewedAt ? new Date(req.reviewedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
      </td>
      <td className="py-3 px-4">
        {req.status === 'pending' ? (
          <div className="flex gap-2">
            <button onClick={onApprove}
              className="text-xs bg-[#09488B] text-white px-3 py-1.5 rounded-lg hover:bg-[#073a70] font-semibold">
              Approve
            </button>
            <button onClick={onReject}
              className="text-xs border border-red-300 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 font-semibold">
              Reject
            </button>
          </div>
        ) : (
          <span className="text-xs text-[#CBD5E1] italic">Reviewed</span>
        )}
      </td>
    </tr>
  );
}

export default function AdminDealRoomPage() {
  const [tab, setTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [rejectTarget, setRejectTarget] = useState<DealRoomRequest | null>(null);

  const { data: requests = [], isLoading, isError, refetch } = useAllDealRoomRequests();
  const approve = useApproveDealRoomRequest();

  const filtered = requests.filter(r => tab === 'all' || r.status === tab);

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  return (
    <div className="p-8 flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-black text-[#0F172A]">Deal Room Access</h1>
        <p className="text-[#64748B] mt-1">Review and manage facility requests to access the Deal Room marketplace.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Requests', value: requests.length, css: 'text-[#0F172A]' },
          { label: 'Pending Review', value: pendingCount, css: pendingCount > 0 ? 'text-yellow-600' : 'text-[#0F172A]' },
          { label: 'Approved', value: requests.filter(r => r.status === 'approved').length, css: 'text-green-600' },
        ].map(c => (
          <div key={c.label} className="bg-white border border-[#E2E8F0] rounded-xl p-5">
            <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">{c.label}</p>
            <p className={`text-3xl font-black mt-1 ${c.css}`}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex bg-[#F1F5F9] rounded-xl p-1 gap-0 w-fit">
        {([
          ['all', 'All'],
          ['pending', `Pending${pendingCount > 0 ? ` (${pendingCount})` : ''}`],
          ['approved', 'Approved'],
          ['rejected', 'Rejected'],
        ] as const).map(([v, l]) => (
          <button key={v} onClick={() => setTab(v)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === v ? 'bg-white text-[#09488B] shadow-sm' : 'text-[#64748B]'}`}>
            {l}
          </button>
        ))}
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-8 h-8 border-4 border-[#09488B] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center h-40 gap-3">
            <p className="text-sm font-semibold text-red-500">Failed to load deal room requests.</p>
            <button onClick={() => refetch()} className="text-xs font-semibold text-[#09488B] hover:underline">Retry</button>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <tr>
                {['Facility', 'Requested', 'Status', 'Rejection Reason', 'Reviewed', 'Actions'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-bold text-[#64748B] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <RequestRow
                  key={r._id}
                  req={r}
                  onApprove={() => approve.mutate(r._id)}
                  onReject={() => setRejectTarget(r)}
                />
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-[#94A3B8] text-sm">
                    No {tab === 'all' ? '' : tab} requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {rejectTarget && (
        <RejectModal request={rejectTarget} onClose={() => setRejectTarget(null)} />
      )}
    </div>
  );
}
