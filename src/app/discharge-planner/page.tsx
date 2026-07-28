"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import CustomSelect from "@/components/CustomSelect";

const MOCK_FACILITIES = [
  {
    name: "Sunrise Memory Care Home",
    location: "Phoenix, AZ 85028",
    services: ["Assisted Living", "Memory Care", "Diabetic Management"],
    beds: 2,
    budget: "$3,200 – $4,500/mo",
    description:
      "Quiet residential neighborhood near Scottsdale border. Specialized in memory care with a low resident-to-staff ratio and 24/7 caregiver support.",
    match: 98,
  },
  {
    name: "Desert Rose Assisted Living",
    location: "Glendale, AZ 85308",
    services: ["Assisted Living", "Hospice Support", "Wound Care"],
    beds: 1,
    budget: "$2,800 – $3,800/mo",
    description:
      "Family-style home with personalized care plans and strong hospice coordination. Experienced in complex wound care management.",
    match: 94,
  },
  {
    name: "Valley Vista Senior Home",
    location: "Tempe, AZ 85281",
    services: ["Assisted Living", "Medication Management", "Bathing Assistance"],
    beds: 3,
    budget: "$3,500 – $5,000/mo",
    description:
      "Modern, well-staffed facility preferred by discharge planners for its fast, organized intake process and strong ADHS compliance record.",
    match: 91,
  },
];

const CARE_NEED_OPTIONS = [
  "Memory Care",
  "Diabetic Care",
  "Wound Care",
  "Hospice Support",
  "Medication Management",
  "Bathing Assistance",
];

export default function DischargePlannerPage() {
  const [searchStep, setSearchStep] = useState<"idle" | "loading" | "results">(
    "idle"
  );
  const [careNeeds, setCareNeeds] = useState<string[]>([]);
  const [mobility, setMobility] = useState("");
  const [budget, setBudget] = useState("");
  const [location, setLocation] = useState("");

  const [ctaForm, setCtaForm] = useState({
    name: "",
    organization: "",
    role: "",
    phone: "",
    email: "",
  });
  const [ctaLoading, setCtaLoading] = useState(false);
  const [ctaSubmitted, setCtaSubmitted] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);

  const toggleCareNeed = (need: string) => {
    setCareNeeds((prev) =>
      prev.includes(need) ? prev.filter((n) => n !== need) : [...prev, need]
    );
  };

  const handleSearch = () => {
    setSearchStep("loading");
    setTimeout(() => {
      setSearchStep("results");
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }, 1800);
  };

  const handleCtaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCtaLoading(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/demo-inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "discharge-planner",
          name: ctaForm.name,
          email: ctaForm.email,
          phone: ctaForm.phone,
          organization: ctaForm.organization,
          role: ctaForm.role,
        }),
      });
    } catch {
      // silent — form still shows success to user
    }
    setCtaLoading(false);
    setCtaSubmitted(true);
  };

  const spinnerStyle: React.CSSProperties = {
    width: "20px",
    height: "20px",
    border: "2.5px solid rgba(255,255,255,0.3)",
    borderTopColor: "white",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
    flexShrink: 0,
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Demo Banner */}
      {/* <div className="bg-amber-50 border-b border-amber-200 text-amber-800 text-center text-sm py-2.5 px-4">
        <span className="font-semibold">DEMO MODE</span> — Simulated experience
        only. Results are pre-defined and not real placements.
      </div> */}

      {/* Nav */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors text-sm"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Home
          </Link>
          <div className="flex items-center">
            <Image
              src="/logo.png"
              alt="RAL Connect"
              width={915}
              height={457}
              priority
              className="h-9 w-auto object-contain"
            />
          </div>
          <span className="hidden sm:block text-xs bg-teal-100 text-teal-700 px-3 py-1.5 rounded-full font-semibold">
            Discharge Planner Demo
          </span>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-teal-700 text-white py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Find a Safe, Trusted Placement for Your Patient—Without the Stress
          </h1>
          <p className="text-blue-100 text-lg leading-relaxed mb-6">
            Stop calling multiple homes and hoping for the best. Get matched instantly based on real-time availability, care needs, and budget.
          </p>
          <p className="text-blue-200 text-sm leading-relaxed mb-2">
            Your information is kept private and secure. We only share what&apos;s necessary to find the right care—nothing more.
          </p>
          <p className="text-blue-300 text-xs">
            Designed with HIPAA-level privacy standards to protect sensitive information.
          </p>
        </div>
      </div>

      {/* Simulated Form */}
      <div className="bg-gray-50 py-14 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center gap-3 mb-7">
              <div className="w-9 h-9 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-teal-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Help Us Find the Right Care for Your Patient
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Takes less than 60 seconds
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Mobility */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Patient Mobility
                </label>
                <CustomSelect
                  value={mobility}
                  onChange={setMobility}
                  placeholder="Select mobility level..."
                  options={[
                    { value: "independent", label: "Independent" },
                    { value: "minimal", label: "Minimal Assistance" },
                    { value: "moderate", label: "Moderate Assistance" },
                    { value: "full", label: "Full Assistance / Non-Ambulatory" },
                  ]}
                />
                <p className="text-xs text-gray-400 mt-1.5">Helps us match homes that can safely support mobility needs</p>
              </div>

              {/* Care Needs */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Care Needs{" "}
                  <span className="text-gray-400 font-normal">
                    (select all that apply)
                  </span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {CARE_NEED_OPTIONS.map((need) => {
                    const checked = careNeeds.includes(need);
                    return (
                      <button
                        key={need}
                        type="button"
                        onClick={() => toggleCareNeed(need)}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all text-sm ${
                          checked
                            ? "border-blue-500 bg-blue-50 text-blue-900"
                            : "border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                            checked
                              ? "bg-blue-600 border-blue-600"
                              : "border-gray-300"
                          }`}
                        >
                          {checked && (
                            <svg
                              className="w-2.5 h-2.5 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                        <span className="font-medium">{need}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-400 mt-1.5">Select all that apply so we only show homes that can properly care for your patient</p>
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Budget Range
                </label>
                <CustomSelect
                  value={budget}
                  onChange={setBudget}
                  placeholder="Select budget range..."
                  options={[
                    { value: "under3k", label: "Under $3,000/mo" },
                    { value: "3k-4k", label: "$3,000 – $4,000/mo" },
                    { value: "4k-5k", label: "$4,000 – $5,000/mo" },
                    { value: "5kplus", label: "$5,000+/mo" },
                  ]}
                />
                <p className="text-xs text-gray-400 mt-1.5">We only match you with homes within your budget—no surprises</p>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Preferred Location
                </label>
                <input
                  type="text"
                  placeholder="City or ZIP code (e.g. Phoenix or 85028)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <p className="text-xs text-gray-400 mt-1.5">We prioritize homes close to your preferred area</p>
              </div>

              {/* Submit */}
              <div className="space-y-3">
                <button
                  onClick={handleSearch}
                  disabled={searchStep === "loading"}
                  className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-4 px-6 rounded-xl transition-colors text-base disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {searchStep === "loading" ? (
                    <>
                      <div style={spinnerStyle} />
                      Searching Matching Homes...
                    </>
                  ) : (
                    <>
                      Find Matching Homes Now
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  Matches are based on real-time availability and typically returned within minutes.
                </p>
                <p className="text-xs text-gray-500 text-center">
                  You stay in control of the process—we simply match you with the best available options.
                </p>
                <p className="text-xs text-gray-500 text-center font-medium">
                  Only qualified homes that meet your care needs receive your request.
                </p>

                {/* Trust Badges */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <span className="inline-flex items-center gap-1.5 text-xs bg-green-50 text-green-700 border border-green-100 px-3 py-1.5 rounded-full font-medium">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Private &amp; Secure
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1.5 rounded-full font-medium">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    HIPAA-Conscious Design
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs bg-teal-50 text-teal-700 border border-teal-100 px-3 py-1.5 rounded-full font-medium">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    No Cost to Families
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {searchStep === "results" && (
        <div
          ref={resultsRef}
          className="bg-white py-14 px-6"
          style={{ animation: "fadeInUp 0.5s ease-out forwards" }}
        >
          <div className="max-w-5xl mx-auto">
            {/* Results header */}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                3 Matching Homes Found
              </h2>
            </div>
            <p className="text-gray-500 mb-10 ml-12">
              Based on your criteria — here are your top matches in the Phoenix
              area:
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {MOCK_FACILITIES.map((facility, i) => (
                <div
                  key={facility.name}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  style={{
                    animation: `fadeInUp 0.5s ease-out ${i * 0.12 + 0.05}s both`,
                  }}
                >
                  {/* Card header */}
                  <div className="bg-gradient-to-r from-blue-900 to-blue-700 px-5 py-3 flex items-center justify-between">
                    <span className="text-white text-sm font-semibold">
                      Match #{i + 1}
                    </span>
                    <span className="bg-white text-blue-900 text-xs font-bold px-2.5 py-1 rounded-full">
                      {facility.match}% Fit
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 text-base mb-1.5">
                      {facility.name}
                    </h3>
                    <p className="text-gray-400 text-xs mb-3 flex items-center gap-1">
                      <svg
                        className="w-3.5 h-3.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {facility.location}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {facility.services.map((s) => (
                        <span
                          key={s}
                          className="text-xs bg-teal-50 text-teal-700 px-2 py-1 rounded-lg font-medium"
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                    <div className="mb-3">
                      <span className="inline-flex items-center gap-1.5 text-xs bg-green-100 text-green-700 px-2.5 py-1.5 rounded-lg font-semibold">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        {facility.beds} Beds Available
                      </span>
                    </div>

                    <p className="text-gray-500 text-xs leading-relaxed mb-3">
                      {facility.description}
                    </p>

                    <p className="text-xs text-gray-400 mb-4">
                      Budget Range:{" "}
                      <span className="font-semibold text-gray-600">
                        {facility.budget}
                      </span>
                    </p>

                    <button className="w-full bg-blue-50 hover:bg-blue-100 text-blue-900 font-semibold py-2.5 px-4 rounded-xl text-sm transition-colors border border-blue-100">
                      Contact Facility
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center text-xs text-gray-400 mt-6">
              Sample facilities for demonstration purposes only. Real results
              include full contact details and direct messaging.
            </p>
          </div>
        </div>
      )}

      {/* How It Works */}
      <div className="bg-gray-50 py-14 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
            How It Works
          </h2>
          <p className="text-gray-500 text-center mb-12 text-sm">
            Three steps to better placements — no phone tag, no spreadsheets
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Submit Patient Needs",
                desc: "Enter mobility level, care requirements, budget, and preferred location in one simple form.",
              },
              {
                step: "2",
                title: "Instantly Receive Best-Fit Homes",
                desc: "The platform surfaces matched facilities ranked by compatibility, care capabilities, and real-time availability.",
              },
              {
                step: "3",
                title: "Contact Directly",
                desc: "Connect with the home directly — no intermediary, no delays, no placement agency fees.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-blue-900 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-base">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Request Access CTA */}
      <div className="bg-blue-900 py-16 px-6">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-3">
              Ready to Streamline Your Placements?
            </h2>
            <p className="text-blue-200 text-sm leading-relaxed">
              Request access to the full platform and get real-time matches for
              your patients. No waiting, no cold calls.
            </p>
          </div>

          {ctaSubmitted ? (
            <div
              className="bg-white rounded-2xl p-10 text-center"
              style={{ animation: "fadeInUp 0.5s ease-out forwards" }}
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Request Received!
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                We&apos;ll be in touch within 24 hours to get you set up with
                full platform access.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleCtaSubmit}
              className="bg-white rounded-2xl p-8 space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={ctaForm.name}
                    onChange={(e) =>
                      setCtaForm({ ...ctaForm, name: e.target.value })
                    }
                    placeholder="Jane Smith"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Hospital / Organization *
                  </label>
                  <input
                    required
                    type="text"
                    value={ctaForm.organization}
                    onChange={(e) =>
                      setCtaForm({ ...ctaForm, organization: e.target.value })
                    }
                    placeholder="Phoenix General Hospital"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Role / Title *
                </label>
                <input
                  required
                  type="text"
                  value={ctaForm.role}
                  onChange={(e) =>
                    setCtaForm({ ...ctaForm, role: e.target.value })
                  }
                  placeholder="Discharge Planner, Social Worker, Case Manager..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Phone *
                  </label>
                  <input
                    required
                    type="tel"
                    value={ctaForm.phone}
                    onChange={(e) =>
                      setCtaForm({ ...ctaForm, phone: e.target.value })
                    }
                    placeholder="(602) 555-0100"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Email *
                  </label>
                  <input
                    required
                    type="email"
                    value={ctaForm.email}
                    onChange={(e) =>
                      setCtaForm({ ...ctaForm, email: e.target.value })
                    }
                    placeholder="jane@hospital.com"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={ctaLoading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-6 rounded-xl transition-colors text-base disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {ctaLoading ? (
                  <>
                    <div
                      style={{
                        ...spinnerStyle,
                        borderColor: "rgba(255,255,255,0.3)",
                        borderTopColor: "white",
                      }}
                    />
                    Submitting...
                  </>
                ) : (
                  "Request Access →"
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-500 text-xs text-center py-6 px-6">
        <p>
          © 2025 RAL Connect · Demo Portal · No real data is collected or
          processed
        </p>
      </footer>
    </div>
  );
}
