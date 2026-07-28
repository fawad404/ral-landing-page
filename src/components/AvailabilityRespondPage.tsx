'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

type Action = 'interested' | 'more_info' | 'not_interested';

type RequestInfo = {
  contactName: string;
  phone: string;
  email: string;
  preferredArea: string;
  careTypes: string[];
  paymentType: string;
  moveTimeline: string;
};

export default function AvailabilityRespondPage() {
  const params = useSearchParams();
  const requestId = params.get('requestId') || '';
  const action = (params.get('action') || '') as Action;

  const [requestInfo, setRequestInfo] = useState<RequestInfo | null>(null);
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [infoError, setInfoError] = useState(false);

  useEffect(() => {
    if (!requestId) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/availability-broadcast/request/${requestId}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => setRequestInfo(data))
      .catch(() => setInfoError(true))
      .finally(() => setLoadingInfo(false));
  }, [requestId]);

  if (!requestId || !['interested', 'more_info', 'not_interested'].includes(action)) {
    return <InvalidLink />;
  }

  if (loadingInfo) {
    return (
      <Shell>
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-[#09488B] border-t-transparent rounded-full animate-spin" />
        </div>
      </Shell>
    );
  }

  if (infoError || !requestInfo) {
    return <InvalidLink />;
  }

  if (action === 'not_interested') {
    return <NotInterestedView requestId={requestId} />;
  }

  if (action === 'more_info') {
    return <MoreInfoView requestId={requestId} requestInfo={requestInfo} />;
  }

  return <InterestedForm requestId={requestId} requestInfo={requestInfo} />;
}

/* ────────────────────────────── Not Interested ────────────────────────────── */

function NotInterestedView({ requestId }: { requestId: string }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/availability-broadcast/respond/${requestId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ responseType: 'not_interested' }),
    }).finally(() => setDone(true));
  }, [requestId]);

  if (!done) {
    return (
      <Shell>
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-[#09488B] border-t-transparent rounded-full animate-spin" />
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="max-w-md mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 bg-surface border border-border rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-7 h-7 text-[#94A3B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-[#0F172A] mb-3">Response Recorded</h2>
        <p className="text-text-muted leading-relaxed">
          Thank you — your response has been recorded. You will only receive future requests when a new availability need is broadcast.
        </p>
      </div>
    </Shell>
  );
}

/* ────────────────────────────── Need More Info ────────────────────────────── */

function MoreInfoView({ requestId, requestInfo }: { requestId: string; requestInfo: RequestInfo }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/availability-broadcast/respond/${requestId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ responseType: 'more_info' }),
    }).finally(() => setDone(true));
  }, [requestId]);

  return (
    <Shell>
      <div className="max-w-md mx-auto py-16 px-4">
        {!done && (
          <div className="flex justify-center mb-6">
            <div className="w-6 h-6 border-2 border-[#09488B] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#E8F1FB] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-7 h-7 text-[#09488B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#0F172A] mb-2">More Information</h2>
          <p className="text-text-muted">Contact the discharge planner directly for more details on this request.</p>
        </div>

        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          <div className="bg-[#09488B] px-5 py-3">
            <p className="text-xs font-bold text-white tracking-widest uppercase">Request Summary</p>
          </div>
          <div className="divide-y divide-[#E2E8F0]">
            <Row label="Preferred Area" value={requestInfo.preferredArea} />
            <Row label="Care Type" value={requestInfo.careTypes.join(', ')} />
            <Row label="Payment" value={requestInfo.paymentType} />
            <Row label="Timeline" value={requestInfo.moveTimeline} />
          </div>
          <div className="bg-[#E8F1FB] px-5 py-3 mt-0">
            <p className="text-xs font-bold text-[#09488B] tracking-widest uppercase mb-2">Planner Contact</p>
            <p className="text-sm font-semibold text-[#0F172A]">{requestInfo.contactName}</p>
            <a href={`tel:${requestInfo.phone}`} className="text-sm text-[#09488B] font-medium hover:underline block">{requestInfo.phone}</a>
            <a href={`mailto:${requestInfo.email}`} className="text-sm text-[#09488B] font-medium hover:underline">{requestInfo.email}</a>
          </div>
        </div>
      </div>
    </Shell>
  );
}

/* ────────────────────────────── Interested Form ────────────────────────────── */

type InterestedFields = {
  facilityName: string;
  contactName: string;
  phone: string;
  email: string;
  availableBedCount: string;
  notes: string;
};

const EMPTY_INTERESTED: InterestedFields = {
  facilityName: '', contactName: '', phone: '', email: '',
  availableBedCount: '', notes: '',
};

function InterestedForm({ requestId, requestInfo }: { requestId: string; requestInfo: RequestInfo }) {
  const [form, setForm] = useState<InterestedFields>(EMPTY_INTERESTED);
  const [errors, setErrors] = useState<Partial<InterestedFields>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (k: keyof InterestedFields, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: '' }));
  };

  const validate = () => {
    const e: Partial<InterestedFields> = {};
    if (!form.facilityName.trim()) e.facilityName = 'Required';
    if (!form.contactName.trim()) e.contactName = 'Required';
    if (!form.phone.trim()) e.phone = 'Required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
    return e;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/availability-broadcast/respond/${requestId}/interested`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...form,
            availableBedCount: form.availableBedCount ? parseInt(form.availableBedCount, 10) : undefined,
          }),
        }
      );
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setErrors({ email: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Shell>
        <div className="max-w-md mx-auto py-16 px-4 text-center">
          <div className="w-16 h-16 bg-[#E8F1FB] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-[#09488B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#0F172A] mb-3">Response Sent</h2>
          <p className="text-text-muted leading-relaxed">
            Your response has been forwarded to the discharge planner. They will follow up with you directly at{' '}
            <strong className="text-[#0F172A]">{form.email}</strong>.
          </p>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="max-w-xl mx-auto py-12 px-4">
        <div className="mb-8">
          <span className="inline-block text-xs font-bold text-[#09488B] tracking-widest uppercase mb-3">
            You clicked: Interested
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-2">Submit Your Response</h1>
          <p className="text-text-muted text-sm leading-relaxed">
            Your response will be forwarded directly to the discharge planner. Only submit if you currently have availability.
          </p>
        </div>

        {/* Request summary pill */}
        <div className="bg-surface border border-border rounded-xl px-4 py-3 mb-8 flex flex-wrap gap-x-6 gap-y-1 text-xs text-text-muted">
          <span><strong className="text-[#0F172A]">Area:</strong> {requestInfo.preferredArea}</span>
          <span><strong className="text-[#0F172A]">Care:</strong> {requestInfo.careTypes.join(', ')}</span>
          <span><strong className="text-[#0F172A]">Payment:</strong> {requestInfo.paymentType}</span>
          <span><strong className="text-[#0F172A]">Timeline:</strong> {requestInfo.moveTimeline}</span>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          <IField label="Facility Name" error={errors.facilityName}>
            <input type="text" value={form.facilityName} onChange={e => set('facilityName', e.target.value)}
              placeholder="Sunrise Assisted Living" className={iCls(errors.facilityName)} />
          </IField>

          <IField label="Your Name" error={errors.contactName}>
            <input type="text" value={form.contactName} onChange={e => set('contactName', e.target.value)}
              placeholder="John Rodriguez" className={iCls(errors.contactName)} />
          </IField>

          <div className="grid sm:grid-cols-2 gap-4">
            <IField label="Phone" error={errors.phone}>
              <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
                placeholder="(602) 000-0000" className={iCls(errors.phone)} />
            </IField>
            <IField label="Email" error={errors.email}>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                placeholder="you@facility.com" className={iCls(errors.email)} />
            </IField>
          </div>

          <IField label="Available Bed Count (Optional)">
            <input type="number" min={0} value={form.availableBedCount} onChange={e => set('availableBedCount', e.target.value)}
              placeholder="e.g. 2" className={iCls()} />
          </IField>

          <IField label="Short Notes (Optional)">
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)}
              placeholder="Any relevant details about your facility or availability…"
              rows={3} maxLength={400}
              className="w-full border border-border rounded-xl px-4 py-3 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#09488B] focus:border-transparent resize-none" />
          </IField>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#09488B] hover:bg-[#063264] text-white font-bold text-base py-4 rounded-xl transition-all shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending…' : 'Submit Response'}
          </button>
        </form>
      </div>
    </Shell>
  );
}

/* ────────────────────────────── Shared ────────────────────────────── */

function InvalidLink() {
  return (
    <Shell>
      <div className="max-w-md mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 bg-[#FEF2F2] border border-[#FCA5A5] rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-[#0F172A] mb-3">Invalid Link</h2>
        <p className="text-text-muted leading-relaxed mb-6">
          This link is invalid or has already been processed. Please use the link from your original email.
        </p>
        <Link href="/" className="text-[#09488B] text-sm font-semibold hover:underline">Return to RAL Connect</Link>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-border bg-white px-4 py-4">
        <div className="max-w-xl mx-auto">
          <Link href="/">
            <Image src="/logo.png" alt="RAL Connect" width={120} height={40} className="h-10 w-auto object-contain" />
          </Link>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border py-6 px-4 text-center">
        <p className="text-xs text-[#94A3B8]">
          © {new Date().getFullYear()} RAL Connect — Arizona RAL Availability Request Broadcast System
        </p>
      </footer>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-5 py-3 flex justify-between gap-4">
      <span className="text-sm text-[#64748B]">{label}</span>
      <span className="text-sm font-semibold text-[#0F172A] text-right">{value}</span>
    </div>
  );
}

function IField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-[#334155]">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function iCls(err?: string) {
  return `w-full border ${err ? 'border-red-400' : 'border-border'} rounded-xl px-4 py-3 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#09488B] focus:border-transparent bg-white`;
}
