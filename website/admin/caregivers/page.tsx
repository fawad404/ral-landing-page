'use client';
import React, { useState } from 'react';
import { useCaregivers, useUpdateCaregiver, useToggleCaregiverVisibility, useDeleteCaregiver, useApproveCaregiver, useRejectCaregiver } from '@/hooks/useCaregivers';
import type { Caregiver, CreateCaregiverDto } from '@/types/caregiver.types';
import { CERTIFICATIONS, AVAILABILITY_OPTIONS, WORK_AREAS } from '@/types/caregiver.types';
import ConfirmDeleteModal from '@/components/global/ConfirmDeleteModal';

type Tab = 'pending' | 'active' | 'inactive';

// ── Toggle Switch ─────────────────────────────────────────────────────────────

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
        checked ? 'bg-[#09488B]' : 'bg-[#CBD5E1]'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

// ── Edit Drawer ───────────────────────────────────────────────────────────────

function CaregiverEditDrawer({
  caregiver, onClose, onSave, saving,
}: {
  caregiver: Caregiver;
  onClose: () => void;
  onSave: (data: CreateCaregiverDto) => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<CreateCaregiverDto>({ ...caregiver });

  const toggle = (field: 'certifications' | 'availability' | 'workAreas', value: string) => {
    setForm(prev => {
      const arr = prev[field] ?? [];
      return { ...prev, [field]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value] };
    });
  };

  const field = (key: keyof CreateCaregiverDto, value: any) =>
    setForm(prev => ({ ...prev, [key]: value }));

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-lg h-full bg-white shadow-2xl flex flex-col overflow-hidden">
        <div className="px-6 py-5 border-b border-[#E2E8F0] flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#0F172A]">Edit Caregiver</h2>
          <button onClick={onClose} className="text-[#94A3B8] hover:text-[#0F172A] text-2xl leading-none">×</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#475569]">First Name *</label>
              <input value={form.firstName} onChange={e => field('firstName', e.target.value)}
                className="border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#09488B]" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#475569]">Last Name *</label>
              <input value={form.lastName} onChange={e => field('lastName', e.target.value)}
                className="border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#09488B]" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#475569]">Phone</label>
              <input value={form.phone} onChange={e => field('phone', e.target.value)} placeholder="(000) 000-0000"
                className="border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#09488B]" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#475569]">Email</label>
              <input value={form.email} onChange={e => field('email', e.target.value)} type="email"
                className="border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#09488B]" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#475569]">City</label>
              <select value={form.city} onChange={e => field('city', e.target.value)}
                className="border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#09488B] bg-white">
                <option value="">Select city...</option>
                {WORK_AREAS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#475569]">Years of Experience</label>
              <input type="number" min={0} value={form.experienceYears}
                onChange={e => field('experienceYears', Number(e.target.value))}
                className="border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#09488B]" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#475569]">Status</label>
            <select value={form.status} onChange={e => field('status', e.target.value)}
              className="border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#09488B] bg-white">
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Available Now */}
          <div className="flex items-center justify-between py-1 px-1">
            <div>
              <span className="text-xs font-semibold text-[#475569]">Available Now</span>
              <p className="text-xs text-[#94A3B8] mt-0.5">Shows green badge on their card</p>
            </div>
            <button
              type="button"
              onClick={() => field('availableNow', !form.availableNow)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                form.availableNow ? 'bg-green-500' : 'bg-[#CBD5E1]'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                form.availableNow ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-[#475569]">Preferred Work Areas</label>
            <div className="flex flex-wrap gap-2">
              {WORK_AREAS.map(a => (
                <button key={a} type="button" onClick={() => toggle('workAreas', a)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    form.workAreas?.includes(a) ? 'bg-[#09488B] text-white border-[#09488B]' : 'bg-white text-[#475569] border-[#E2E8F0] hover:border-[#09488B]'
                  }`}>{a}</button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-[#475569]">Available Shifts</label>
            <div className="flex flex-wrap gap-2">
              {AVAILABILITY_OPTIONS.map(a => (
                <button key={a} type="button" onClick={() => toggle('availability', a)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    form.availability?.includes(a) ? 'bg-[#09488B] text-white border-[#09488B]' : 'bg-white text-[#475569] border-[#E2E8F0] hover:border-[#09488B]'
                  }`}>{a}</button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-[#475569]">Credentials</label>
            <div className="flex flex-wrap gap-2">
              {CERTIFICATIONS.map(c => (
                <button key={c} type="button" onClick={() => toggle('certifications', c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    form.certifications?.includes(c) ? 'bg-[#09488B] text-white border-[#09488B]' : 'bg-white text-[#475569] border-[#E2E8F0] hover:border-[#09488B]'
                  }`}>{c}</button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#475569]">Bio</label>
            <textarea value={form.bio} onChange={e => field('bio', e.target.value)}
              rows={3} placeholder="Brief professional summary..."
              className="border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#09488B] resize-none" />
          </div>

          <div className="flex items-center justify-between py-1">
            <div>
              <span className="text-sm font-semibold text-[#0F172A]">Visible in directory</span>
              <p className="text-xs text-[#94A3B8] mt-0.5">Show this caregiver to facility owners</p>
            </div>
            <ToggleSwitch checked={!!form.isVisible} onChange={() => field('isVisible', !form.isVisible)} />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-[#E2E8F0] flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2 border border-[#E2E8F0] text-[#475569] rounded-xl text-sm font-semibold hover:bg-[#F1F5F9]">Cancel</button>
          <button onClick={() => onSave(form)} disabled={saving || !form.firstName || !form.lastName}
            className="px-6 py-2 bg-[#09488B] text-white rounded-xl text-sm font-bold hover:bg-[#083d77] disabled:opacity-50">
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Admin Page ───────────────────────────────────────────────────────────

export default function AdminCaregiversPage() {
  const [tab, setTab] = useState<Tab>('pending');
  const [search, setSearch] = useState('');
  const [editTarget, setEditTarget] = useState<Caregiver | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Caregiver | null>(null);

  const params: Record<string, string> = { status: tab };
  if (search) params.search = search;

  const { data: caregivers = [], isLoading } = useCaregivers(params);
  const updateMutation = useUpdateCaregiver();
  const toggleMutation = useToggleCaregiverVisibility();
  const deleteMutation = useDeleteCaregiver();
  const approveMutation = useApproveCaregiver();
  const rejectMutation = useRejectCaregiver();

  const { data: pendingList = [] } = useCaregivers({ status: 'pending' });
  const pendingCount = pendingList.length;

  const handleSave = (form: CreateCaregiverDto) => {
    if (editTarget) {
      updateMutation.mutate({ id: editTarget._id, data: form }, { onSuccess: () => setEditTarget(null) });
    }
  };

  const TABS: { key: Tab; label: string }[] = [
    { key: 'pending',  label: 'Pending Review' },
    { key: 'active',   label: 'Active' },
    { key: 'inactive', label: 'Rejected / Inactive' },
  ];

  return (
    <div className="w-full h-full flex flex-col gap-6 p-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">Caregiver Directory</h1>
        <p className="text-sm text-[#64748B] mt-0.5">Review applications and manage the caregiver directory.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-[#E2E8F0]">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-5 py-3 text-sm font-semibold transition-colors relative ${
              tab === t.key ? 'text-[#09488B]' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}>
            {t.label}
            {t.key === 'pending' && pendingCount > 0 && (
              <span className="ml-2 px-1.5 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">{pendingCount}</span>
            )}
            {tab === t.key && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#09488B] rounded-t" />}
          </button>
        ))}
      </div>

      {/* Search */}
      <input
        type="text" value={search} onChange={e => setSearch(e.target.value)}
        placeholder="Search by name, city..."
        className="w-72 px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm outline-none focus:border-[#09488B] bg-white"
      />

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-8 h-8 border-4 border-[#09488B] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                <th className="px-5 py-3.5 text-left text-xs font-bold text-[#94A3B8] uppercase tracking-wide">Name</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-[#94A3B8] uppercase tracking-wide">Location</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-[#94A3B8] uppercase tracking-wide">Certifications</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-[#94A3B8] uppercase tracking-wide">Availability</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-[#94A3B8] uppercase tracking-wide">Exp.</th>
                {tab === 'active' && (
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-[#94A3B8] uppercase tracking-wide">Visible</th>
                )}
                <th className="px-5 py-3.5 text-left text-xs font-bold text-[#94A3B8] uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {caregivers.map(c => (
                <tr key={c._id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="font-semibold text-[#0F172A]">{c.firstName} {c.lastName}</p>
                        {c.phone && <p className="text-xs text-[#64748B]">{c.phone}</p>}
                        {c.email && <p className="text-xs text-[#64748B]">{c.email}</p>}
                      </div>
                      {c.availableNow && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full flex-shrink-0">Now</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[#475569] text-xs">
                    {c.city || '—'}
                    {c.workAreas?.length > 0 && (
                      <div className="text-[#94A3B8] mt-0.5">{c.workAreas.slice(0, 2).join(', ')}{c.workAreas.length > 2 ? ` +${c.workAreas.length - 2}` : ''}</div>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1">
                      {c.certifications.slice(0, 2).map(cert => (
                        <span key={cert} className="px-2 py-0.5 bg-[#EFF6FF] text-[#09488B] text-xs font-semibold rounded-full">{cert}</span>
                      ))}
                      {c.certifications.length > 2 && (
                        <span className="px-2 py-0.5 bg-[#F1F5F9] text-[#64748B] text-xs rounded-full">+{c.certifications.length - 2}</span>
                      )}
                      {c.certifications.length === 0 && <span className="text-xs text-[#94A3B8]">—</span>}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1">
                      {c.availability.slice(0, 2).map(a => (
                        <span key={a} className="px-2 py-0.5 bg-[#F0FDF4] text-green-700 text-xs font-semibold rounded-full">{a}</span>
                      ))}
                      {c.availability.length > 2 && (
                        <span className="px-2 py-0.5 bg-[#F1F5F9] text-[#64748B] text-xs rounded-full">+{c.availability.length - 2}</span>
                      )}
                      {c.availability.length === 0 && <span className="text-xs text-[#94A3B8]">—</span>}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[#475569] text-xs">
                    {c.experienceYears > 0 ? `${c.experienceYears}y` : '—'}
                  </td>
                  {tab === 'active' && (
                    <td className="px-5 py-4">
                      <ToggleSwitch
                        checked={c.isVisible}
                        onChange={() => toggleMutation.mutate(c._id)}
                      />
                    </td>
                  )}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      {tab === 'pending' && (
                        <>
                          <button
                            onClick={() => approveMutation.mutate(c._id)}
                            disabled={approveMutation.isPending}
                            className="px-3 py-1.5 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors">
                            Approve
                          </button>
                          <button
                            onClick={() => rejectMutation.mutate(c._id)}
                            disabled={rejectMutation.isPending}
                            className="px-3 py-1.5 bg-red-100 text-red-700 text-xs font-bold rounded-lg hover:bg-red-200 disabled:opacity-50 transition-colors">
                            Reject
                          </button>
                        </>
                      )}
                      {/* <button onClick={() => setEditTarget(c)}
                        className="text-xs font-semibold text-[#09488B] hover:underline">Edit</button> */}
                      <button onClick={() => setDeleteTarget(c)}
                        className="text-xs font-semibold text-red-600 hover:underline">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {caregivers.length === 0 && (
                <tr>
                  <td colSpan={tab === 'active' ? 7 : 6} className="px-5 py-16 text-center">
                    <p className="text-sm font-semibold text-[#94A3B8]">
                      {tab === 'pending' ? 'No pending applications.' : tab === 'active' ? 'No active caregivers.' : 'No rejected caregivers.'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Drawer */}
      {editTarget && (
        <CaregiverEditDrawer
          caregiver={editTarget}
          onClose={() => setEditTarget(null)}
          onSave={handleSave}
          saving={updateMutation.isPending}
        />
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <ConfirmDeleteModal
          title="Remove Caregiver"
          message={`Are you sure you want to remove ${deleteTarget.firstName} ${deleteTarget.lastName} from the directory? This cannot be undone.`}
          onConfirm={() => deleteMutation.mutate(deleteTarget._id, { onSuccess: () => setDeleteTarget(null) })}
          onCancel={() => setDeleteTarget(null)}
          isLoading={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
