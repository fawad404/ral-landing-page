'use client';
import React, { useState } from 'react';
import ConfirmDeleteModal from '@/components/global/ConfirmDeleteModal';
import { usePartners, useApprovePartner, useRejectPartner, useTogglePartnerVisibility, useAdminUpdatePartner, useDeletePartner } from '@/hooks/usePartners';
import type { Partner } from '@/types/partner.types';

type Tab = 'pending' | 'approved' | 'rejected';

function RejectModal({ partner, onClose }: { partner: Partner; onClose: () => void }) {
  const [reason, setReason] = useState('');
  const reject = useRejectPartner();

  const handleReject = () => {
    reject.mutate({ id: partner._id, reason }, { onSuccess: onClose });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl border border-[#E2E8F0] w-full max-w-md shadow-xl">
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <h2 className="font-bold text-lg text-[#0F172A]">Reject Partner Profile</h2>
          <button onClick={onClose} className="text-[#64748B] hover:text-[#0F172A] text-xl leading-none">×</button>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <p className="text-sm text-[#475569]">
            You are rejecting <strong className="text-[#0F172A]">{partner.name}</strong>. Optionally provide a reason so the vendor can fix their profile.
          </p>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#475569]">Reason (optional)</label>
            <textarea value={reason} onChange={e => setReason(e.target.value)} rows={3} placeholder="e.g. Incomplete contact information, invalid category..."
              className="border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#09488B] resize-none" />
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={onClose} className="px-5 py-2 border border-[#E2E8F0] text-[#475569] rounded-xl text-sm font-semibold hover:bg-[#F1F5F9]">Cancel</button>
            <button onClick={handleReject} disabled={reject.isPending}
              className="px-5 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 disabled:opacity-60">
              {reject.isPending ? 'Rejecting…' : 'Reject'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PartnerDrawer({ partner, onClose }: { partner: Partner; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col overflow-hidden">
        <div className="px-6 py-5 border-b border-[#E2E8F0] flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#0F172A]">{partner.name}</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 capitalize">{partner.category}</span>
          </div>
          <button onClick={onClose} className="text-[#94A3B8] hover:text-[#0F172A] text-2xl leading-none mt-0.5">×</button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {/* Status */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
              partner.status === 'approved' ? 'bg-green-100 text-green-700' :
              partner.status === 'rejected' ? 'bg-red-100 text-red-700' :
              'bg-yellow-100 text-yellow-700'
            }`}>
              {partner.status}
            </span>
            {partner.status === 'approved' && (
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${partner.isVisible ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                {partner.isVisible ? 'Visible' : 'Hidden'}
              </span>
            )}
            <span className="text-xs text-[#64748B]">Weight: <strong className="text-[#0F172A]">{partner.orderWeight}</strong></span>
          </div>

          {partner.rejectionReason && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <p className="text-xs font-bold text-red-700 mb-0.5">Rejection Reason</p>
              <p className="text-sm text-red-600">{partner.rejectionReason}</p>
            </div>
          )}

          {partner.description && (
            <div>
              <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest mb-2">Description</p>
              <p className="text-sm text-[#475569] leading-relaxed">{partner.description}</p>
            </div>
          )}

          {partner.contactInfo && Object.values(partner.contactInfo).some(Boolean) && (
            <div>
              <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest mb-3">Contact</p>
              {partner.contactInfo.email && (
                <div className="flex justify-between py-1.5 border-b border-[#F1F5F9]">
                  <span className="text-sm text-[#64748B]">Email</span>
                  <span className="text-sm font-medium text-[#0F172A]">{partner.contactInfo.email}</span>
                </div>
              )}
              {partner.contactInfo.phone && (
                <div className="flex justify-between py-1.5 border-b border-[#F1F5F9]">
                  <span className="text-sm text-[#64748B]">Phone</span>
                  <span className="text-sm font-medium text-[#0F172A]">{partner.contactInfo.phone}</span>
                </div>
              )}
              {partner.contactInfo.website && (
                <div className="flex justify-between py-1.5 border-b border-[#F1F5F9]">
                  <span className="text-sm text-[#64748B]">Website</span>
                  <a href={partner.contactInfo.website} target="_blank" rel="noopener noreferrer"
                    className="text-sm font-medium text-[#09488B] hover:underline truncate max-w-[55%]">
                    {partner.contactInfo.website}
                  </a>
                </div>
              )}
              {partner.contactInfo.address && (
                <div className="flex justify-between py-1.5">
                  <span className="text-sm text-[#64748B]">Address</span>
                  <span className="text-sm font-medium text-[#0F172A] text-right max-w-[55%]">{partner.contactInfo.address}</span>
                </div>
              )}
            </div>
          )}

          {partner.logoUrl && (
            <div>
              <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest mb-3">Logo</p>
              <div className="w-24 h-24 border border-[#E2E8F0] rounded-xl overflow-hidden bg-[#F8FAFC]">
                <img src={partner.logoUrl} alt={partner.name} className="w-full h-full object-contain p-2" />
              </div>
            </div>
          )}

          <div>
            <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest mb-3">Timestamps</p>
            <div className="flex justify-between py-1.5 border-b border-[#F1F5F9]">
              <span className="text-sm text-[#64748B]">Submitted</span>
              <span className="text-sm font-medium text-[#0F172A]">{new Date(partner.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-sm text-[#64748B]">Updated</span>
              <span className="text-sm font-medium text-[#0F172A]">{new Date(partner.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminVendorsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('pending');
  const [search, setSearch] = useState('');
  const [viewPartner, setViewPartner] = useState<Partner | null>(null);
  const [rejectTarget, setRejectTarget] = useState<Partner | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: partners = [], isLoading, isError, refetch } = usePartners();
  const approve = useApprovePartner();
  const toggleVis = useTogglePartnerVisibility();
  const deletePartner = useDeletePartner();

  const byStatus = partners.filter(p => p.status === activeTab);
  const filtered = byStatus.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const counts = {
    pending: partners.filter(p => p.status === 'pending').length,
    approved: partners.filter(p => p.status === 'approved').length,
    rejected: partners.filter(p => p.status === 'rejected').length,
  };

  const tabCls = (t: Tab) =>
    `px-4 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 ${
      activeTab === t ? 'bg-[#09488B] text-white' : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
    }`;

  const badgeCls = (t: Tab) =>
    `text-xs px-2 py-0.5 rounded-full font-bold ${
      activeTab === t ? 'bg-white/30 text-white' : 'bg-[#E2E8F0] text-[#475569]'
    }`;

  return (
    <div className="p-8 flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-black text-[#0F172A]">Preferred Partners</h1>
        <p className="text-[#64748B] mt-1">Review and manage vendor partner profiles.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-1.5 w-fit">
        {(['pending', 'approved', 'rejected'] as Tab[]).map(t => (
          <button key={t} className={tabCls(t)} onClick={() => setActiveTab(t)}>
            <span className="capitalize">{t}</span>
            <span className={badgeCls(t)}>{counts[t]}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or category…"
          className="border border-[#E2E8F0] rounded-xl px-4 py-2 text-sm outline-none focus:border-[#09488B] w-72" />
        <p className="text-sm text-[#64748B]">{filtered.length} partner{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="w-8 h-8 border-4 border-[#09488B] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center h-32 gap-3">
            <p className="text-sm font-semibold text-red-500">Failed to load partners.</p>
            <button onClick={() => refetch()} className="text-xs font-semibold text-[#09488B] hover:underline">Retry</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <p className="text-[#94A3B8] text-sm font-medium">No {activeTab} partners</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <tr>
                {['Partner', 'Category', 'Contact', ...(activeTab === 'approved' ? ['Visibility'] : []), ...(activeTab === 'rejected' ? ['Reason'] : []), 'Submitted', 'Actions'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-bold text-[#64748B] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p._id} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC]">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      {p.logoUrl
                        ? <img src={p.logoUrl} alt={p.name} className="w-9 h-9 rounded-lg object-cover border border-[#E2E8F0] flex-shrink-0" />
                        : <div className="w-9 h-9 bg-[#F1F5F9] rounded-lg flex items-center justify-center text-base flex-shrink-0">🤝</div>
                      }
                      <div>
                        <p className="text-sm font-semibold text-[#0F172A]">{p.name}</p>
                        {p.description && <p className="text-xs text-[#64748B] truncate max-w-[160px]">{p.description}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 capitalize">{p.category}</span>
                  </td>
                  <td className="py-3 px-4 text-xs text-[#64748B]">
                    {p.contactInfo?.email ?? p.contactInfo?.phone ?? '—'}
                  </td>

                  {activeTab === 'approved' && (
                    <td className="py-3 px-4">
                      <button onClick={() => toggleVis.mutate(p._id)}
                        className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors ${p.isVisible ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                        {p.isVisible ? '● Visible' : '○ Hidden'}
                      </button>
                    </td>
                  )}

                  {activeTab === 'rejected' && (
                    <td className="py-3 px-4 text-xs text-red-500 max-w-[160px] truncate">
                      {p.rejectionReason || '—'}
                    </td>
                  )}

                  <td className="py-3 px-4 text-xs text-[#94A3B8]">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex gap-1.5 flex-wrap">
                      <button onClick={() => setViewPartner(p)}
                        className="text-xs border border-[#09488B] text-[#09488B] px-2 py-1 rounded-lg hover:bg-[#09488B10]">View</button>

                      {activeTab === 'pending' && (
                        <>
                          <button onClick={() => approve.mutate(p._id)} disabled={approve.isPending}
                            className="text-xs border border-green-500 text-green-600 px-2 py-1 rounded-lg hover:bg-green-50 disabled:opacity-60">
                            Approve
                          </button>
                          <button onClick={() => setRejectTarget(p)}
                            className="text-xs border border-red-300 text-red-500 px-2 py-1 rounded-lg hover:bg-red-50">
                            Reject
                          </button>
                        </>
                      )}

                      {activeTab === 'rejected' && (
                        <button onClick={() => approve.mutate(p._id)} disabled={approve.isPending}
                          className="text-xs border border-green-500 text-green-600 px-2 py-1 rounded-lg hover:bg-green-50 disabled:opacity-60">
                          Approve
                        </button>
                      )}

                      <button onClick={() => setDeleteId(p._id)}
                        className="text-xs border border-red-200 text-red-500 px-2 py-1 rounded-lg hover:bg-red-50">Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {viewPartner && <PartnerDrawer partner={viewPartner} onClose={() => setViewPartner(null)} />}
      {rejectTarget && <RejectModal partner={rejectTarget} onClose={() => setRejectTarget(null)} />}
      {deleteId && (
        <ConfirmDeleteModal
          title="Remove Partner"
          message="Are you sure you want to remove this partner profile? This action cannot be undone."
          confirmLabel="Remove"
          onConfirm={() => { deletePartner.mutate(deleteId); setDeleteId(null); }}
          onCancel={() => setDeleteId(null)}
          isLoading={deletePartner.isPending}
        />
      )}
    </div>
  );
}
