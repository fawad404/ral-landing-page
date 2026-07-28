'use client';
import { useState } from 'react';
import CustomSelect from './CustomSelect';

interface Props {
  onClose: () => void;
}

const ROLE_OPTIONS = ['Placement Advisor', 'Hospice', 'Home Health', 'Other'];
const CITIES = ['Phoenix', 'Mesa', 'Glendale', 'Scottsdale', 'Chandler', 'Tempe', 'Gilbert', 'Peoria', 'Other'];

type FormData = {
  fullName: string;
  companyName: string;
  role: string;
  phone: string;
  email: string;
  serviceArea: string;
  description: string;
};

export default function FoundingPartnerModal({ onClose }: Props) {
  const [form, setForm] = useState<FormData>({
    fullName: '', companyName: '', role: '', phone: '', email: '', serviceArea: '', description: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const set = (key: keyof FormData) => (val: string) => setForm(f => ({ ...f, [key]: val }));

  const validate = () => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.fullName.trim()) e.fullName = 'Required';
    if (!form.companyName.trim()) e.companyName = 'Required';
    if (!form.role) e.role = 'Required';
    if (!form.phone.trim()) e.phone = 'Required';
    if (!form.email.trim()) e.email = 'Required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.serviceArea) e.serviceArea = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setSubmitError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'partner',
          name: form.fullName,
          email: form.email,
          phone: form.phone,
          companyName: form.companyName,
          role: form.role,
          serviceArea: form.serviceArea,
          description: form.description,
        }),
      });
      if (res.status === 409) {
        const data = await res.json();
        setSubmitError(data.message || 'A submission with this email already exists. We will be in touch soon.');
        return;
      }
      if (!res.ok) throw new Error('Server error');
      setSubmitted(true);
    } catch {
      setSubmitError('Something went wrong. Please try again or contact us directly.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = (key: keyof FormData) =>
    `w-full px-4 py-3 rounded-xl border text-sm text-[#0F172A] outline-none transition-colors placeholder-[#94A3B8] bg-white ${errors[key] ? 'border-red-400 bg-red-50' : 'border-border focus:border-[#09488B] focus:ring-2 focus:ring-[#09488B15]'}`;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full sm:max-w-xl bg-white sm:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col max-h-[95dvh] sm:max-h-[90vh] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border shrink-0">
          {!submitted ? (
            <div>
              <h2 className="text-xl font-black text-[#0F172A]">Become a Founding Partner</h2>
              <p className="text-sm text-[#64748B] mt-0.5">Tell us about yourself and how you&apos;d like to participate.</p>
            </div>
          ) : <div />}
          <button onClick={onClose} className="w-9 h-9 bg-[#F1F5F9] hover:bg-[#E2E8F0] rounded-xl flex items-center justify-center text-[#64748B] hover:text-[#0F172A] transition-colors shrink-0 ml-4">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1">
          {submitted ? (
            <div className="flex flex-col items-center justify-center text-center gap-6 px-8 py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-[#09488B] to-[#1d7ad4] rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-black text-[#0F172A] mb-3">Thank You!</h3>
                <p className="text-base text-text-muted leading-relaxed max-w-sm">
                  We&apos;ll review your submission and reach out shortly to discuss next steps. We look forward to connecting with you.
                </p>
              </div>
              <button onClick={onClose} className="bg-[#09488B] text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-[#063264] transition-colors">
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">

              {/* Full Name & Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-[#334155] flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#09488B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Full Name
                  </label>
                  <input value={form.fullName} onChange={e => set('fullName')(e.target.value)} placeholder="Your full name" className={inputCls('fullName')} />
                  {errors.fullName && <p className="text-xs text-red-500">{errors.fullName}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-[#334155] flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#09488B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Company Name
                  </label>
                  <input value={form.companyName} onChange={e => set('companyName')(e.target.value)} placeholder="Your organization" className={inputCls('companyName')} />
                  {errors.companyName && <p className="text-xs text-red-500">{errors.companyName}</p>}
                </div>
              </div>

              {/* Role */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#334155] flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#09488B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Role / Type
                </label>
                <CustomSelect
                  value={form.role}
                  onChange={set('role')}
                  options={ROLE_OPTIONS.map(r => ({ value: r, label: r }))}
                  placeholder="Select your role..."
                  hasError={!!errors.role}
                />
                {errors.role && <p className="text-xs text-red-500">{errors.role}</p>}
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-[#334155] flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#09488B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Phone
                  </label>
                  <input type="tel" value={form.phone} onChange={e => set('phone')(e.target.value)} placeholder="(000) 000-0000" className={inputCls('phone')} />
                  {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-[#334155] flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#09488B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email
                  </label>
                  <input type="email" value={form.email} onChange={e => set('email')(e.target.value)} placeholder="you@example.com" className={inputCls('email')} />
                  {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                </div>
              </div>

              {/* Service Area */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#334155] flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#09488B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Service Area (City / County)
                </label>
                <CustomSelect
                  value={form.serviceArea}
                  onChange={set('serviceArea')}
                  options={CITIES.map(c => ({ value: c, label: c }))}
                  placeholder="Select your area..."
                  hasError={!!errors.serviceArea}
                />
                {errors.serviceArea && <p className="text-xs text-red-500">{errors.serviceArea}</p>}
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#334155] flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#09488B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  How would you like to participate?
                  <span className="text-[#94A3B8] font-normal text-xs">(Optional)</span>
                </label>
                <textarea value={form.description} onChange={e => set('description')(e.target.value)} rows={3}
                  placeholder="Briefly describe your role, the services you offer, and how you'd like to work with RAL Connect..."
                  className="w-full px-4 py-3 rounded-xl border border-border text-sm text-[#0F172A] outline-none focus:border-[#09488B] focus:ring-2 focus:ring-[#09488B15] transition-colors placeholder-[#94A3B8] resize-none" />
              </div>

              {/* Submit */}
              <div className="flex flex-col gap-3 pt-1 pb-2">
                <button type="submit"
                  className="w-full bg-gradient-to-r from-[#09488B] to-[#1d7ad4] text-white py-4 rounded-2xl text-base font-black hover:from-[#063264] hover:to-[#09488B] transition-all shadow-lg hover:-translate-y-0.5 transform">
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
                <p className="text-xs text-[#94A3B8] text-center">We&apos;ll review your submission and reach out personally.</p>
                {submitError && <p className="text-xs text-red-500 text-center">{submitError}</p>}
              </div>

            </form>
          )}
        </div>
      </div>
    </div>
  );
}
