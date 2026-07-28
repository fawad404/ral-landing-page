'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const AREAS = [
  'Phoenix', 'Glendale', 'Peoria', 'Surprise', 'Scottsdale',
  'Mesa', 'Chandler', 'Tempe', 'Gilbert', 'Avondale / Goodyear', 'Other',
];

const CARE_TYPES = [
  'Assisted Living', 'Memory Care', 'Behavioral', 'Hospice',
  'Bariatric', 'Male', 'Female', 'Couple',
];

const PAYMENT_TYPES = ['Private Pay', 'ALTCS', 'Unknown'];
const TIMELINES = ['Immediate', '24–48 Hours', 'This Week'];

type Field = {
  contactName: string;
  organization: string;
  phone: string;
  email: string;
  preferredArea: string;
  paymentType: string;
  moveTimeline: string;
  notes: string;
};

const EMPTY: Field = {
  contactName: '', organization: '', phone: '', email: '',
  preferredArea: '', paymentType: '', moveTimeline: '', notes: '',
};

export default function AvailabilityRequestForm() {
  const [form, setForm] = useState<Field>(EMPTY);
  const [careTypes, setCareTypes] = useState<string[]>([]);
  const [errors, setErrors] = useState<Partial<Field & { careTypes: string }>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (k: keyof Field, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: '' }));
  };

  const toggleCare = (v: string) => {
    setCareTypes(prev =>
      prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]
    );
    setErrors(e => ({ ...e, careTypes: '' }));
  };

  const validate = () => {
    const e: typeof errors = {};
    if (!form.contactName.trim()) e.contactName = 'Required';
    if (!form.organization.trim()) e.organization = 'Required';
    if (!form.phone.trim()) e.phone = 'Required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
    if (!form.preferredArea) e.preferredArea = 'Required';
    if (careTypes.length === 0) e.careTypes = 'Select at least one care type';
    if (!form.paymentType) e.paymentType = 'Required';
    if (!form.moveTimeline) e.moveTimeline = 'Required';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/availability-broadcast/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, careTypes, notes: form.notes.trim() }),
      });
      if (!res.ok) throw new Error('Submission failed');
      setSubmitted(true);
    } catch {
      setErrors({ email: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <PageHeader />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 bg-[#E8F1FB] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-[#09488B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#0F172A] mb-3">Request Sent</h2>
            <p className="text-text-muted leading-relaxed mb-8">
              Your availability request has been broadcast to RAL facilities in the area. You will receive responses directly at <strong className="text-[#0F172A]">{form.email}</strong>.
            </p>
            <button
              onClick={() => { setForm(EMPTY); setCareTypes([]); setSubmitted(false); }}
              className="text-[#09488B] text-sm font-semibold hover:underline"
            >
              Submit another request
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <PageHeader />

      <main className="flex-1 px-4 py-12 sm:py-16">
        <div className="max-w-xl mx-auto">
          <div className="mb-10">
            <span className="inline-block text-xs font-bold text-[#09488B] tracking-widest uppercase mb-3">
              RAL Availability Request Broadcast System
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#0F172A] leading-tight mb-3">
              Submit an Availability Request
            </h1>
            <p className="text-text-muted text-base leading-relaxed">
              Complete the form below. Your request will be broadcast to subscribed RAL owners and managers across the selected area. Interested facilities will contact you directly.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-7">

            {/* Contact info */}
            <Section title="Your Contact Information">
              <Field label="Contact Name" error={errors.contactName}>
                <input
                  type="text"
                  value={form.contactName}
                  onChange={e => set('contactName', e.target.value)}
                  placeholder="Jane Smith"
                  className={inputCls(errors.contactName)}
                />
              </Field>
              <Field label="Organization" error={errors.organization}>
                <input
                  type="text"
                  value={form.organization}
                  onChange={e => set('organization', e.target.value)}
                  placeholder="Banner Health — Social Work"
                  className={inputCls(errors.organization)}
                />
              </Field>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Phone" error={errors.phone}>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => set('phone', e.target.value)}
                    placeholder="(602) 000-0000"
                    className={inputCls(errors.phone)}
                  />
                </Field>
                <Field label="Email" error={errors.email}>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => set('email', e.target.value)}
                    placeholder="you@hospital.org"
                    className={inputCls(errors.email)}
                  />
                </Field>
              </div>
            </Section>

            {/* Placement details */}
            <Section title="Placement Details">
              <Field label="Preferred Area" error={errors.preferredArea}>
                <select
                  value={form.preferredArea}
                  onChange={e => set('preferredArea', e.target.value)}
                  className={inputCls(errors.preferredArea)}
                >
                  <option value="">Select area…</option>
                  {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </Field>

              <Field label="Care Type Needed" error={errors.careTypes}>
                <div className="flex flex-wrap gap-2 mt-1">
                  {CARE_TYPES.map(ct => (
                    <button
                      key={ct}
                      type="button"
                      onClick={() => toggleCare(ct)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                        careTypes.includes(ct)
                          ? 'bg-[#09488B] border-[#09488B] text-white shadow-sm'
                          : 'bg-white border-border text-text-muted hover:border-[#09488B60] hover:bg-[#F0F7FF]'
                      }`}
                    >
                      {ct}
                    </button>
                  ))}
                </div>
              </Field>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Payment Type" error={errors.paymentType}>
                  <select
                    value={form.paymentType}
                    onChange={e => set('paymentType', e.target.value)}
                    className={inputCls(errors.paymentType)}
                  >
                    <option value="">Select…</option>
                    {PAYMENT_TYPES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </Field>
                <Field label="Move Timeline" error={errors.moveTimeline}>
                  <select
                    value={form.moveTimeline}
                    onChange={e => set('moveTimeline', e.target.value)}
                    className={inputCls(errors.moveTimeline)}
                  >
                    <option value="">Select…</option>
                    {TIMELINES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </Field>
              </div>
            </Section>

            {/* Notes */}
            <Section title="Additional Notes">
              <div className="flex items-start gap-2.5 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl px-4 py-3 mb-3">
                <svg className="w-4 h-4 text-[#D97706] mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                <p className="text-xs text-[#92400E] leading-relaxed">
                  <strong>Do NOT include</strong> patient name, date of birth, SSN, medical record numbers, exact address, or any identifying medical information.
                </p>
              </div>
              <Field label="Short Notes (Optional)">
                <textarea
                  value={form.notes}
                  onChange={e => set('notes', e.target.value)}
                  placeholder="e.g. Needs ground floor, bilingual staff preferred…"
                  rows={3}
                  maxLength={500}
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#09488B] focus:border-transparent resize-none"
                />
                <p className="text-right text-xs text-[#94A3B8] mt-1">{form.notes.length}/500</p>
              </Field>
            </Section>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#09488B] hover:bg-[#063264] text-white font-bold text-base py-4 px-8 rounded-xl transition-all shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending…' : 'Send Availability Request'}
            </button>

            <p className="text-center text-xs text-[#94A3B8] -mt-3">
              Your contact info is shared only with facilities that respond as Interested.
            </p>
          </form>
        </div>
      </main>

      <footer className="border-t border-border py-6 px-4 text-center">
        <p className="text-xs text-[#94A3B8]">
          © {new Date().getFullYear()} RAL Connect — Arizona RAL Availability Request Broadcast System.{' '}
          <Link href="/" className="hover:text-[#09488B]">Return to main site</Link>
        </p>
      </footer>
    </div>
  );
}

function PageHeader() {
  return (
    <header className="border-b border-border bg-white px-4 py-4">
      <div className="max-w-xl mx-auto flex items-center gap-3">
        <Link href="/">
          <Image src="/logo.png" alt="RAL Connect" width={120} height={40} className="h-10 w-auto object-contain" />
        </Link>
      </div>
    </header>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-bold text-[#09488B] tracking-wide uppercase border-b border-border pb-2">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-[#334155]">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function inputCls(err?: string) {
  return `w-full border ${err ? 'border-red-400' : 'border-border'} rounded-xl px-4 py-3 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#09488B] focus:border-transparent bg-white`;
}
