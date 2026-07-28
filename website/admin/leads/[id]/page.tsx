'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useLead, useUpdateLead, useCreateLeadAccount } from '@/hooks/useLeads';
import { APP_ROUTES } from '@/api/endpoints';
import type { LeadStatus } from '@/types/lead.types';

const STATUS_OPTIONS: LeadStatus[] = ['new', 'reviewed', 'approved', 'rejected'];

const STATUS_BADGE: Record<LeadStatus, string> = {
  new: 'bg-blue-100 text-blue-700',
  reviewed: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-600',
};

function Field({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wide">{label}</p>
      <p className="text-sm text-[#334155] font-medium">{value}</p>
    </div>
  );
}

function generatePassword() {
  const chars = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const specials = '!@#$%';
  let pass = '';
  for (let i = 0; i < 10; i++) pass += chars[Math.floor(Math.random() * chars.length)];
  pass += specials[Math.floor(Math.random() * specials.length)];
  pass += Math.floor(Math.random() * 90 + 10);
  return pass;
}

function CreateAccountModal({
  email,
  onClose,
  onSubmit,
  isPending,
}: {
  email: string;
  onClose: () => void;
  onSubmit: (password: string) => void;
  isPending: boolean;
}) {
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = () => {
    setPassword(generatePassword());
    setShow(true);
    setError('');
  };

  const handleSubmit = () => {
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    onSubmit(password);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-5">

        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-black text-[#0F172A]">Create Account</h3>
            <p className="text-sm text-[#64748B] mt-0.5">Set a password for <span className="font-semibold text-[#09488B]">{email}</span></p>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-[#F1F5F9] hover:bg-[#E2E8F0] rounded-lg flex items-center justify-center text-[#64748B] transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">Password</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type={show ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                placeholder="Enter password..."
                className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm text-[#0F172A] outline-none focus:border-[#09488B] focus:ring-2 focus:ring-[#09488B15] pr-10"
              />
              <button type="button" onClick={() => setShow(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569]">
                {show ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            <button onClick={handleGenerate} type="button"
              className="px-3 py-2 bg-[#E8F1FB] text-[#09488B] text-xs font-bold rounded-xl hover:bg-[#09488B] hover:text-white transition-colors whitespace-nowrap">
              Auto Generate
            </button>
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 text-xs text-[#64748B]">
          The password will be sent to the user via email along with their login link. The account will be <span className="font-semibold text-green-600">auto-approved</span> — no further approval needed.
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 border border-[#E2E8F0] text-[#475569] py-3 rounded-xl text-sm font-semibold hover:bg-[#F8FAFC] transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={isPending}
            className="flex-1 bg-[#09488B] text-white py-3 rounded-xl text-sm font-bold hover:bg-[#063264] transition-colors disabled:opacity-60">
            {isPending ? 'Creating...' : 'Create & Send Email'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LeadDetailPage({ id }: { id: string }) {
  const { data: lead, isLoading, isError } = useLead(id);
  const updateLead = useUpdateLead(id);
  const createAccount = useCreateLeadAccount(id);

  const [status, setStatus] = useState<LeadStatus>('new');
  const [notes, setNotes] = useState('');
  const [accountCreated, setAccountCreated] = useState(false);
  const [showModal, setShowModal] = useState(false);

  React.useEffect(() => {
    if (lead) {
      setStatus(lead.status);
      setNotes(lead.adminNotes ?? '');
      if (lead.linkedUserId) setAccountCreated(true);
    }
  }, [lead]);

  const handleSave = () => updateLead.mutate({ status, adminNotes: notes });

  const handleCreateAccount = (password: string) => {
    const loginUrl = `${window.location.origin}/login`;
    createAccount.mutate({ password, loginUrl }, {
      onSuccess: () => { setAccountCreated(true); setShowModal(false); },
    });
  };

  if (isLoading) return <div className="p-8 text-center text-[#64748B]">Loading...</div>;
  if (isError || !lead) return (
    <div className="p-8 text-center">
      <p className="text-red-500 mb-4">Failed to load lead.</p>
      <Link href={APP_ROUTES.ADMIN_LEADS} className="text-[#09488B] underline text-sm">Back to Leads</Link>
    </div>
  );

  const isFacility = lead.type === 'facility';

  return (
    <div className="p-8 flex flex-col gap-6 max-w-5xl">

      {showModal && (
        <CreateAccountModal
          email={lead.email}
          onClose={() => setShowModal(false)}
          onSubmit={handleCreateAccount}
          isPending={createAccount.isPending}
        />
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Link href={APP_ROUTES.ADMIN_LEADS} className="text-sm text-[#64748B] hover:text-[#09488B] flex items-center gap-1 mb-3">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Leads
          </Link>
          <h1 className="text-3xl font-black text-[#0F172A]">{lead.name}</h1>
          <div className="flex items-center gap-3 mt-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${STATUS_BADGE[lead.status]}`}>{lead.status}</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${isFacility ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}`}>
              {isFacility ? 'Facility Inquiry' : 'Founding Partner'}
            </span>
          </div>
        </div>

        {accountCreated ? (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
            <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-semibold text-green-700">Account Created</span>
          </div>
        ) : (
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-[#09488B] text-white px-5 py-3 rounded-xl text-sm font-bold hover:bg-[#063264] transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Create Account & Send Login
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 flex flex-col gap-5">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="text-base font-black text-[#0F172A]">Contact Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Full Name" value={lead.name} />
              <Field label="Email" value={lead.email} />
              <Field label="Phone" value={lead.phone} />
              {isFacility ? <Field label="City" value={lead.city} /> : <Field label="Service Area" value={lead.serviceArea} />}
            </div>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="text-base font-black text-[#0F172A]">{isFacility ? 'Facility Details' : 'Partner Details'}</h2>
            <div className="grid grid-cols-2 gap-4">
              {isFacility ? (
                <>
                  <Field label="Home Name" value={lead.homeName} />
                  <Field label="Bed Count" value={lead.beds} />
                  <Field label="Current Availability" value={lead.availability} />
                  <Field label="Situation" value={lead.situation} />
                  <Field label="Working with Referrals?" value={lead.referrals} />
                </>
              ) : (
                <>
                  <Field label="Company Name" value={lead.companyName} />
                  <Field label="Role / Type" value={lead.role} />
                </>
              )}
            </div>
            {lead.description && (
              <div className="flex flex-col gap-1 mt-1">
                <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wide">
                  {isFacility ? 'Additional Notes' : 'How they want to participate'}
                </p>
                <p className="text-sm text-[#334155] leading-relaxed bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3">{lead.description}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="text-base font-black text-[#0F172A]">Admin Actions</h2>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value as LeadStatus)}
                className="border border-[#E2E8F0] rounded-xl px-3 py-2.5 text-sm text-[#0F172A] outline-none focus:border-[#09488B] bg-white capitalize">
                {STATUS_OPTIONS.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">Admin Notes</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4} placeholder="Internal notes about this lead..."
                className="border border-[#E2E8F0] rounded-xl px-3 py-2.5 text-sm text-[#0F172A] outline-none focus:border-[#09488B] resize-none" />
            </div>
            <button onClick={handleSave} disabled={updateLead.isPending}
              className="w-full bg-[#09488B] text-white py-2.5 rounded-xl text-sm font-bold hover:bg-[#063264] transition-colors disabled:opacity-60">
              {updateLead.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-5 flex flex-col gap-3">
            <h2 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wide">Submission Info</h2>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#64748B]">Submitted</span>
                <span className="font-semibold text-[#334155]">{new Date(lead.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#64748B]">Account</span>
                <span className={`font-semibold text-sm ${accountCreated ? 'text-green-600' : 'text-[#94A3B8]'}`}>
                  {accountCreated ? 'Created' : 'Not created'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
