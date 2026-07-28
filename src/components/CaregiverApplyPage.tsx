'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from './Navbar';

const WORK_AREAS = ['Phoenix', 'Glendale', 'Peoria', 'Surprise', 'Scottsdale', 'Mesa', 'Chandler', 'Tempe', 'Gilbert', 'Other'] as const;
const SHIFTS = ['Morning', 'Afternoon', 'Evening', 'Overnight', 'Weekdays', 'Weekends', 'PRN', 'Live-In'] as const;
const CREDENTIALS = ['CPR', 'Fingerprint Card', 'Caregiver Certificate', 'Med Tech', 'CNA', 'Dementia Experience', 'Hospice Experience'] as const;

type FormData = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  city: string;
  experienceYears: string;
  availableNow: boolean;
  workAreas: string[];
  availability: string[];
  certifications: string[];
  bio: string;
  newsletterConsent: boolean;
};

const EMPTY: FormData = {
  firstName: '', lastName: '', phone: '', email: '',
  city: '', experienceYears: '',
  availableNow: false,
  workAreas: [], availability: [], certifications: [],
  bio: '', newsletterConsent: false,
};

type Errors = Partial<Record<keyof FormData, string>>;
type SubmitState = 'idle' | 'loading' | 'exists' | 'updating' | 'success_new' | 'success_update';

function TagPicker({
  label, options, selected, onChange, error,
}: {
  label: string;
  options: readonly string[];
  selected: string[];
  onChange: (v: string[]) => void;
  error?: string;
}) {
  const toggle = (v: string) =>
    onChange(selected.includes(v) ? selected.filter(s => s !== v) : [...selected, v]);
  return (
    <div className="flex flex-col gap-2.5">
      <label className="text-sm font-semibold text-text-medium">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button key={opt} type="button" onClick={() => toggle(opt)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
              selected.includes(opt)
                ? 'bg-brand border-brand text-white shadow-sm'
                : 'bg-white border-border text-text-muted hover:border-[#09488B40] hover:bg-brand-bg-soft'
            }`}>
            {opt}
          </button>
        ))}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default function CaregiverApplyPage() {
  const [form, setForm] = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [submitError, setSubmitError] = useState('');

  const isLoading = submitState === 'loading' || submitState === 'updating';

  const set = (key: keyof FormData) => (val: string) =>
    setForm(f => ({ ...f, [key]: val }));

  const setTags = (key: 'workAreas' | 'availability' | 'certifications') => (val: string[]) =>
    setForm(f => ({ ...f, [key]: val }));

  const validate = (): boolean => {
    const e: Errors = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim()) e.lastName = 'Required';
    if (!form.phone.trim()) e.phone = 'Required';
    if (!form.email.trim()) e.email = 'Required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.city) e.city = 'Required';
    if (form.workAreas.length === 0) e.workAreas = 'Select at least one work area';
    if (form.availability.length === 0) e.availability = 'Select at least one shift';
    if (form.certifications.length === 0) e.certifications = 'Select at least one credential';
    if (!form.newsletterConsent) e.newsletterConsent = 'You must agree to subscribe to remain active in the directory';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submitToApi = async (confirmUpdate: boolean) => {
    setSubmitError('');
    setSubmitState(confirmUpdate ? 'updating' : 'loading');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/caregivers/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          phone: form.phone.trim(),
          email: form.email.trim().toLowerCase(),
          city: form.city,
          state: 'AZ',
          experienceYears: form.experienceYears ? Number(form.experienceYears) : 0,
          availableNow: form.availableNow,
          workAreas: form.workAreas,
          availability: form.availability,
          certifications: form.certifications,
          bio: form.bio.trim() || undefined,
          confirmUpdate,
        }),
      });

      if (res.status === 409) {
        setSubmitState('exists');
        return;
      }

      if (!res.ok) throw new Error('Server error');
      setSubmitState(confirmUpdate ? 'success_update' : 'success_new');
    } catch {
      setSubmitError('Something went wrong. Please try again.');
      setSubmitState('idle');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await submitToApi(false);
  };

  const inputCls = (key: keyof FormData) =>
    `w-full px-4 py-3 rounded-xl border text-sm text-[#0F172A] outline-none transition-colors placeholder-[#94A3B8] ${
      errors[key]
        ? 'border-red-400 bg-red-50 focus:border-red-400'
        : 'border-border focus:border-brand focus:ring-2 focus:ring-[#09488B15]'
    }`;

  // ── Success screen ───────────────────────────────────────────────────────
  if (submitState === 'success_new' || submitState === 'success_update') {
    const isUpdate = submitState === 'success_update';
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-24 flex flex-col items-center text-center gap-8">
          <div className="w-24 h-24 bg-linear-to-br from-brand to-brand-mid rounded-full flex items-center justify-center shadow-xl">
            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-black text-text-dark">
              {isUpdate ? 'Profile Updated!' : 'Application Submitted!'}
            </h2>
            <p className="text-text-subtle text-base leading-relaxed max-w-md">
              {isUpdate
                ? 'Your updated profile is under review. It will be visible in the directory again once our team approves it.'
                : 'Thank you for applying to the RAL Connect Caregiver Directory. Our team will review your profile and notify you once it is approved.'}
            </p>
          </div>
          <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-sm flex flex-col gap-3 text-left">
            <p className="font-bold text-sm text-text-dark">What happens next?</p>
            {(isUpdate
              ? ['Your updated details are under admin review', 'Once approved, your profile goes live again', 'Facility owners can find and contact you directly']
              : ['Our team reviews your application', 'Once approved, your profile goes live in the directory', 'RAL facility owners can find and contact you directly']
            ).map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-brand-bg text-brand text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                <p className="text-sm text-text-muted">{step}</p>
              </div>
            ))}
          </div>
          <Link href="/"
            className="bg-linear-to-r from-brand to-brand-mid text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:from-brand-dark hover:to-brand transition-all shadow-lg">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Banner */}
      <div className="hero-gradient relative overflow-hidden py-16 md:py-20">
        <div className="dot-grid-dark absolute inset-0 pointer-events-none" />
        <div className="absolute top-0 left-1/4 w-125 h-100 bg-brand-mid opacity-10 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center gap-5">
          <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/85 text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-brand-glow animate-pulse" />
            Caregiver Directory
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight">
            Join the RAL Connect<br />
            <span className="gradient-text-light">Caregiver Directory</span>
          </h1>
          <p className="text-white/65 text-lg leading-relaxed max-w-xl">
            Connect with residential assisted living facilities across Arizona who are actively looking for qualified caregivers.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/50 mt-1">
            {['Free to apply', 'Arizona-focused', 'Direct contact from facilities'].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-brand-glow" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-white to-transparent pointer-events-none" />
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
        <form onSubmit={handleSubmit} className="flex flex-col gap-10">

          {/* SECTION 1: Personal Info */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-brand-bg flex items-center justify-center text-brand font-black text-sm shrink-0">1</div>
              <p className="text-base font-bold text-text-dark">Personal Information</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-text-medium">First Name *</label>
                <input value={form.firstName} onChange={e => set('firstName')(e.target.value)}
                  placeholder="Maria" className={inputCls('firstName')} />
                {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-text-medium">Last Name *</label>
                <input value={form.lastName} onChange={e => set('lastName')(e.target.value)}
                  placeholder="Gonzalez" className={inputCls('lastName')} />
                {errors.lastName && <p className="text-xs text-red-500">{errors.lastName}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-text-medium">Phone *</label>
                <input type="tel" value={form.phone} onChange={e => set('phone')(e.target.value)}
                  placeholder="(000) 000-0000" className={inputCls('phone')} />
                {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-text-medium">Email *</label>
                <input type="email" value={form.email} onChange={e => set('email')(e.target.value)}
                  placeholder="you@example.com" className={inputCls('email')} />
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-text-medium">City *</label>
                <select value={form.city} onChange={e => set('city')(e.target.value)}
                  className={inputCls('city') + ' bg-white'}>
                  <option value="" disabled>Select your city...</option>
                  {WORK_AREAS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.city && <p className="text-xs text-red-500">{errors.city}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-text-medium">Years of Experience <span className="text-text-faint font-normal">(Optional)</span></label>
                <input type="number" min={0} max={50} value={form.experienceYears}
                  onChange={e => set('experienceYears')(e.target.value)}
                  placeholder="e.g. 3" className={inputCls('experienceYears')} />
              </div>
            </div>

            {/* Available Now toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-surface">
              <div>
                <p className="text-sm font-semibold text-text-dark">Available Now?</p>
                <p className="text-xs text-text-subtle mt-0.5">Shows a green "Available Now" badge on your profile</p>
              </div>
              <button type="button"
                onClick={() => setForm(f => ({ ...f, availableNow: !f.availableNow }))}
                className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none ${
                  form.availableNow ? 'bg-green-500' : 'bg-[#CBD5E1]'
                }`}>
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                  form.availableNow ? 'translate-x-8' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* SECTION 2: Preferred Work Areas */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-brand-bg flex items-center justify-center text-brand font-black text-sm shrink-0">2</div>
              <p className="text-base font-bold text-text-dark">Preferred Work Areas *</p>
            </div>
            <TagPicker
              label="Select all areas where you are willing to work"
              options={WORK_AREAS}
              selected={form.workAreas}
              onChange={setTags('workAreas')}
              error={errors.workAreas}
            />
          </div>

          <div className="h-px bg-border" />

          {/* SECTION 3: Available Shifts */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-brand-bg flex items-center justify-center text-brand font-black text-sm shrink-0">3</div>
              <p className="text-base font-bold text-text-dark">Available Shifts *</p>
            </div>
            <TagPicker
              label="Select all shifts you are available for"
              options={SHIFTS}
              selected={form.availability}
              onChange={setTags('availability')}
              error={errors.availability}
            />
          </div>

          <div className="h-px bg-border" />

          {/* SECTION 4: Credentials */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-brand-bg flex items-center justify-center text-brand font-black text-sm shrink-0">4</div>
              <p className="text-base font-bold text-text-dark">Credentials *</p>
            </div>
            <TagPicker
              label="Select all credentials you hold"
              options={CREDENTIALS}
              selected={form.certifications}
              onChange={setTags('certifications')}
              error={errors.certifications}
            />
          </div>

          <div className="h-px bg-border" />

          {/* SECTION 5: Bio */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-brand-bg flex items-center justify-center text-brand font-black text-sm shrink-0">5</div>
              <p className="text-base font-bold text-text-dark">About You</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-text-medium">
                Short Notes / Bio <span className="text-text-faint font-normal">(Optional)</span>
              </label>
              <textarea value={form.bio} onChange={e => set('bio')(e.target.value)}
                rows={4} placeholder="Tell facilities a bit about your background and experience..."
                className="w-full px-4 py-3 rounded-xl border border-border text-sm text-text-dark outline-none focus:border-brand focus:ring-2 focus:ring-[#09488B15] transition-colors placeholder-text-faint resize-none" />
            </div>
          </div>

          {/* Newsletter Consent */}
          <div className={`p-4 rounded-xl border ${errors.newsletterConsent ? 'border-red-300 bg-red-50' : 'border-border bg-surface'}`}>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={form.newsletterConsent}
                onChange={e => setForm(f => ({ ...f, newsletterConsent: e.target.checked }))}
                className="mt-0.5 w-4 h-4 accent-brand shrink-0" />
              <span className="text-sm text-text-muted leading-relaxed">
                I agree to subscribe to free RAL Connect caregiver updates and the newsletter. I understand that I must remain subscribed to stay active in the directory.
              </span>
            </label>
            {errors.newsletterConsent && <p className="text-xs text-red-500 mt-2 ml-7">{errors.newsletterConsent}</p>}
          </div>

          {/* Already Exists Confirmation Banner */}
          {submitState === 'exists' && (
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-5 flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
                <div>
                  <p className="text-sm font-bold text-amber-800">You are already in our records.</p>
                  <p className="text-sm text-amber-700 mt-1">
                    An application with this email already exists. Would you like to update your profile with the new details you just entered?
                  </p>
                  <p className="text-xs text-amber-600 mt-1.5">
                    Your profile will be hidden from the directory until re-approved by our team.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 ml-8">
                <button type="button" onClick={() => submitToApi(true)} disabled={isLoading}
                  className="px-5 py-2.5 bg-amber-500 text-white text-sm font-bold rounded-xl hover:bg-amber-600 transition-colors disabled:opacity-60">
                  {isLoading ? 'Updating…' : 'Yes, Update My Profile'}
                </button>
                <button type="button" onClick={() => { setSubmitState('idle'); setSubmitError(''); }}
                  className="px-5 py-2.5 border border-amber-300 text-amber-700 text-sm font-semibold rounded-xl hover:bg-amber-100 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Submit Error */}
          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <p className="text-sm text-red-600">{submitError}</p>
            </div>
          )}

          {/* Submit Button */}
          {submitState !== 'exists' && (
            <button type="submit" disabled={isLoading}
              className="w-full bg-linear-to-r from-brand to-brand-mid text-white py-4 rounded-2xl text-base font-black hover:from-brand-dark hover:to-brand transition-all shadow-lg hover:-translate-y-0.5 transform disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0">
              {isLoading ? 'Submitting Application...' : 'Submit My Application →'}
            </button>
          )}

          <p className="text-xs text-text-faint text-center -mt-4">
            Your application will be reviewed by our team. Once approved, your profile will appear in the directory.
          </p>
        </form>
      </div>
    </div>
  );
}
