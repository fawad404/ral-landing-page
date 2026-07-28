"use client";
import { useState } from "react";
import CustomSelect from "./CustomSelect";

interface Props {
  onClose: () => void;
}

const CITIES = [
  "Phoenix",
  "Mesa",
  "Glendale",
  "Scottsdale",
  "Chandler",
  "Tempe",
  "Gilbert",
  "Peoria",
  "Other",
];

const BED_OPTIONS = ["1–5", "6–10", "11–15", "15+"];

const AVAILABILITY_OPTIONS = [
  "Fully occupied",
  "1 bed available",
  "2–3 beds available",
  "4+ beds available",
];

const SITUATION_OPTIONS = [
  "Looking to fill open beds",
  "Want more consistent inquiries",
  "Just exploring options",
  "Planning to grow or expand",
  "Not sure yet",
];

const REFERRAL_OPTIONS = [
  "Yes, regularly",
  "Occasionally",
  "Not really",
  "Prefer not to rely on them",
];

type FormData = {
  homeName: string;
  yourName: string;
  phone: string;
  email: string;
  city: string;
  beds: string;
  availability: string;
  situation: string;
  referrals: string;
  notes: string;
};

const Radio = ({
  name,
  value,
  selected,
  onChange,
  label,
}: {
  name: string;
  value: string;
  selected: string;
  onChange: (v: string) => void;
  label: string;
}) => (
  <label
    className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${selected === value ? "border-[#09488B] bg-[#E8F1FB]" : "border-border bg-white hover:border-[#09488B40] hover:bg-surface"}`}
  >
    <div
      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${selected === value ? "border-[#09488B]" : "border-[#CBD5E1]"}`}
    >
      {selected === value && <div className="w-2 h-2 rounded-full bg-brand" />}
    </div>
    <span
      className={`text-sm font-medium ${selected === value ? "text-[#09488B]" : "text-text-muted"}`}
    >
      {label}
    </span>
    <input
      type="radio"
      name={name}
      value={value}
      className="hidden"
      onChange={() => onChange(value)}
    />
  </label>
);

export default function RequestInfoModal({ onClose }: Props) {
  const [form, setForm] = useState<FormData>({
    homeName: "",
    yourName: "",
    phone: "",
    email: "",
    city: "",
    beds: "",
    availability: "",
    situation: "",
    referrals: "",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  );

  const set = (key: keyof FormData) => (val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.homeName.trim()) e.homeName = "Required";
    if (!form.yourName.trim()) e.yourName = "Required";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.city) e.city = "Required";
    if (!form.beds) e.beds = "Required";
    if (!form.availability) e.availability = "Required";
    if (!form.situation) e.situation = "Required";
    if (!form.referrals) e.referrals = "Required";
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
          type: 'facility',
          name: form.yourName,
          email: form.email,
          phone: form.phone,
          homeName: form.homeName,
          city: form.city,
          beds: form.beds,
          availability: form.availability,
          situation: form.situation,
          referrals: form.referrals,
          description: form.notes,
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
    `w-full px-4 py-3 rounded-xl border text-sm text-[#0F172A] outline-none transition-colors placeholder-[#94A3B8] ${errors[key] ? "border-red-400 bg-red-50" : "border-border focus:border-[#09488B] focus:ring-2 focus:ring-[#09488B15]"}`;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full sm:max-w-2xl bg-white sm:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col max-h-[95dvh] sm:max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border shrink-0">
          {!submitted ? (
            <div>
              <h2 className="text-xl font-black text-[#0F172A]">
                Tell Us About Your Home
              </h2>
              <p className="text-sm text-[#64748B] mt-0.5">
                This takes less than a minute. We&apos;ll use this to understand
                your home and see how we can best support you.
              </p>
            </div>
          ) : (
            <div />
          )}
          <button
            onClick={onClose}
            className="w-9 h-9 bg-[#F1F5F9] hover:bg-[#E2E8F0] rounded-xl flex items-center justify-center text-[#64748B] hover:text-[#0F172A] transition-colors shrink-0 ml-4"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1">
          {submitted ? (
            <div className="flex flex-col items-center justify-center text-center gap-6 px-8 py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-[#09488B] to-[#1d7ad4] rounded-full flex items-center justify-center shadow-lg">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-black text-[#0F172A] mb-3">
                  Thank You!
                </h3>
                <p className="text-base text-text-muted leading-relaxed max-w-sm">
                  We&apos;ll review this and reach out shortly. In the meantime,
                  feel free to keep an eye out for a call or message from us.
                </p>
              </div>
              <button
                onClick={onClose}
                className="bg-brand text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-[#063264] transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-7">
              {/* 1 & 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-[#334155] flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-[#09488B]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    Name of Your Home
                  </label>
                  <input
                    value={form.homeName}
                    onChange={(e) => set("homeName")(e.target.value)}
                    placeholder="e.g. Sunrise Care Home"
                    className={inputCls("homeName")}
                  />
                  {errors.homeName && (
                    <p className="text-xs text-red-500">{errors.homeName}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-[#334155] flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-[#09488B]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Your Name
                  </label>
                  <input
                    value={form.yourName}
                    onChange={(e) => set("yourName")(e.target.value)}
                    placeholder="Full name"
                    className={inputCls("yourName")}
                  />
                  {errors.yourName && (
                    <p className="text-xs text-red-500">{errors.yourName}</p>
                  )}
                </div>
              </div>

              {/* 3 & 4 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-[#334155] flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-[#09488B]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    Best Phone Number
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => set("phone")(e.target.value)}
                    placeholder="(000) 000-0000"
                    className={inputCls("phone")}
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-500">{errors.phone}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-[#334155] flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-[#09488B]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email")(e.target.value)}
                    placeholder="you@example.com"
                    className={inputCls("email")}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* 5: City */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#334155] flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-[#09488B]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  City / Area
                </label>
                <CustomSelect
                  value={form.city}
                  onChange={set("city")}
                  options={CITIES.map((c) => ({ value: c, label: c }))}
                  placeholder="Select your city..."
                  hasError={!!errors.city}
                />
                {errors.city && (
                  <p className="text-xs text-red-500">{errors.city}</p>
                )}
              </div>

              {/* 6: Beds */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[#334155] flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-[#09488B]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    />
                  </svg>
                  How Many Beds Does Your Home Have?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {BED_OPTIONS.map((v) => (
                    <Radio
                      key={v}
                      name="beds"
                      value={v}
                      selected={form.beds}
                      onChange={set("beds")}
                      label={v}
                    />
                  ))}
                </div>
                {errors.beds && (
                  <p className="text-xs text-red-500">{errors.beds}</p>
                )}
              </div>

              {/* 7: Availability */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[#334155] flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-[#09488B]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  Current Availability
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {AVAILABILITY_OPTIONS.map((v) => (
                    <Radio
                      key={v}
                      name="availability"
                      value={v}
                      selected={form.availability}
                      onChange={set("availability")}
                      label={v}
                    />
                  ))}
                </div>
                {errors.availability && (
                  <p className="text-xs text-red-500">{errors.availability}</p>
                )}
              </div>

              {/* 8: Situation */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[#334155] flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-[#09488B]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Which Best Describes Your Situation Right Now?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SITUATION_OPTIONS.map((v) => (
                    <Radio
                      key={v}
                      name="situation"
                      value={v}
                      selected={form.situation}
                      onChange={set("situation")}
                      label={v}
                    />
                  ))}
                </div>
                {errors.situation && (
                  <p className="text-xs text-red-500">{errors.situation}</p>
                )}
              </div>

              {/* 9: Referrals */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[#334155] flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-[#09488B]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Are You Currently Working With Referral or Placement Sources?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {REFERRAL_OPTIONS.map((v) => (
                    <Radio
                      key={v}
                      name="referrals"
                      value={v}
                      selected={form.referrals}
                      onChange={set("referrals")}
                      label={v}
                    />
                  ))}
                </div>
                {errors.referrals && (
                  <p className="text-xs text-red-500">{errors.referrals}</p>
                )}
              </div>

              {/* 10: Notes */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#334155] flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-[#09488B]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    />
                  </svg>
                  Anything You&apos;d Like Us to Know?
                  <span className="text-text-faint font-normal text-xs">
                    (Optional)
                  </span>
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => set("notes")(e.target.value)}
                  rows={3}
                  placeholder="Tell us anything about your home, care specialties, or what you're looking for..."
                  className="w-full px-4 py-3 rounded-xl border border-border text-sm text-[#0F172A] outline-none focus:border-[#09488B] focus:ring-2 focus:ring-[#09488B15] transition-colors placeholder-[#94A3B8] resize-none"
                />
              </div>

              {/* Submit */}
              <div className="flex flex-col gap-3 pt-2 pb-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#09488B] to-[#1d7ad4] text-white py-4 rounded-2xl text-base font-black hover:from-[#063264] hover:to-[#09488B] transition-all shadow-lg hover:-translate-y-0.5 transform"
                >
                  {loading ? 'Submitting...' : 'Submit & Learn More'}
                </button>
                <p className="text-xs text-text-faint text-center">
                  No spam. We&apos;ll reach out personally.
                  {submitError && <p className="text-red-500 text-center mt-1">{submitError}</p>}
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
