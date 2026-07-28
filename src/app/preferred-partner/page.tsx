"use client";

import { useState } from "react";
import Image from "next/image";
import CustomSelect from "@/components/CustomSelect";

const MOCK_PARTNERS = [
  { name: "Valley Transport Services", phone: "(602) 555-0142", category: "Transport" },
  { name: "SunCare Medical Transport", phone: "(602) 555-0198", category: "Transport" },
];

export default function PreferredPartnerPage() {
  const [demoStep, setDemoStep] = useState<"idle" | "locating" | "matched">("idle");
  const [demoService, setDemoService] = useState("");
  const [demoUrgency, setDemoUrgency] = useState("");

  const [form, setForm] = useState({
    name: "",
    company: "",
    serviceCategory: "",
    phone: "",
    email: "",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleDemoSubmit = () => {
    setDemoStep("locating");
    setTimeout(() => setDemoStep("matched"), 1800);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/demo-inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "preferred-partner",
          name: form.name,
          email: form.email,
          phone: form.phone,
          company: form.company,
          serviceCategory: form.serviceCategory,
        }),
      });
    } catch {
      // silent
    }
    setFormLoading(false);
    setFormSubmitted(true);
  };

  const spinnerStyle: React.CSSProperties = {
    width: "18px",
    height: "18px",
    border: "2.5px solid rgba(255,255,255,0.3)",
    borderTopColor: "white",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
    flexShrink: 0,
  };

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white";

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
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
          <span className="hidden sm:block text-xs bg-amber-100 text-amber-800 px-3 py-1.5 rounded-full font-semibold">
            Preferred Partner Program
          </span>
        </div>
      </nav>

      {/* ─── SECTION 1: HERO ─────────────────────────────────── */}
      <div className="bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/40 text-amber-300 text-sm px-4 py-2 rounded-full mb-8 font-medium">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Preferred Partner Program — By Invitation Only
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            Get Chosen When Assisted Living Homes Actually Need You
          </h1>
          <p className="text-blue-200 text-base md:text-lg mb-3 font-semibold">
            Not a directory. Not advertising.
          </p>
          <p className="text-blue-300 text-base md:text-lg mb-10 leading-relaxed max-w-2xl mx-auto">
            This system places you directly in front of Residential Assisted Living owners at the exact moment they need your service.
          </p>
          <a
            href="#request-info"
            className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-gray-900 font-bold px-8 py-4 rounded-xl text-base transition-colors shadow-lg"
          >
            Request Preferred Partner Info
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>

      {/* ─── SECTION 2: RYAN VIDEO ───────────────────────────── */}
      <div className="bg-white py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-3">
              Hear It From a RAL Owner
            </p>
            <h2 className="text-2xl font-bold text-gray-900">Why We Built This</h2>
          </div>

          {/* Video embed */}
          <div className="relative bg-gray-900 rounded-2xl overflow-hidden aspect-video flex items-center justify-center shadow-lg mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-blue-950/90" />
            <div className="relative z-10 text-center px-8">
              <div className="w-20 h-20 bg-white/20 hover:bg-white/30 transition-colors rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer border-2 border-white/40">
                <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="text-white/70 text-sm">10 – 15 second video</p>
            </div>
          </div>

          {/* Quote */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8">
            <svg className="w-8 h-8 text-blue-200 mb-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-5 italic">
              &ldquo;This is how we choose who we work with inside our homes — reliable, trusted providers when we actually need them.&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                R
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Ryan</p>
                <p className="text-gray-400 text-xs">10-Bed Assisted Living Owner · Phoenix, AZ</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── SECTION 3: HOW IT WORKS ─────────────────────────── */}
      <div className="bg-gray-50 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">How the System Works</h2>
            <p className="text-gray-500 text-sm">Three steps — from need to connection in real time</p>
          </div>

          <div className="space-y-4">
            {/* STEP 1 */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-blue-900 px-6 py-3 flex items-center gap-3">
                <span className="w-7 h-7 bg-white text-blue-900 rounded-full font-bold text-sm flex items-center justify-center flex-shrink-0">
                  1
                </span>
                <span className="text-white font-semibold text-sm">RAL Owner Submits a Real Need</span>
              </div>
              <div className="p-6">
                <p className="text-gray-500 text-sm mb-5">
                  A Residential Assisted Living owner enters a real, immediate need inside their dashboard.
                </p>
                {/* Mock form UI */}
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 space-y-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex gap-1">
                      <div className="w-2.5 h-2.5 bg-red-400 rounded-full" />
                      <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full" />
                      <div className="w-2.5 h-2.5 bg-green-400 rounded-full" />
                    </div>
                    <span className="text-xs text-gray-400">RAL Owner Dashboard — Submit a Need</span>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Service Needed *
                    </label>
                    <CustomSelect
                      value={demoService}
                      onChange={setDemoService}
                      placeholder="Select service type..."
                      options={[
                        { value: "transport", label: "Transport" },
                        { value: "hospice", label: "Hospice" },
                        { value: "home-health", label: "Home Health" },
                        { value: "pharmacy", label: "Pharmacy" },
                        { value: "mobile-services", label: "Mobile Services" },
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Urgency Level *
                    </label>
                    <CustomSelect
                      value={demoUrgency}
                      onChange={setDemoUrgency}
                      placeholder="Select urgency..."
                      options={[
                        { value: "immediate", label: "Immediate — Needed Today" },
                        { value: "urgent", label: "Urgent — Within 24 Hours" },
                        { value: "scheduled", label: "Scheduled — Within the Week" },
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Notes (optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Resident needs transport to physician appointment tomorrow"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none bg-white"
                      readOnly
                    />
                  </div>
                  <button
                    onClick={handleDemoSubmit}
                    disabled={demoStep !== "idle"}
                    className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 px-4 rounded-xl text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {demoStep === "locating" ? (
                      <>
                        <div style={{ ...spinnerStyle, width: "16px", height: "16px" }} />
                        Finding Matching Partners...
                      </>
                    ) : demoStep === "matched" ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Partners Found
                      </>
                    ) : (
                      "Submit Need →"
                    )}
                  </button>
                  {demoStep === "idle" && (
                    <p className="text-xs text-gray-400 text-center">Click to simulate the system</p>
                  )}
                </div>
              </div>
            </div>

            {/* Arrow connector */}
            <div className="flex justify-center py-1">
              <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* STEP 2 */}
            <div
              className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-500 ${
                demoStep !== "idle" ? "border-blue-200" : "border-gray-200 opacity-50"
              }`}
            >
              <div
                className={`px-6 py-3 flex items-center gap-3 transition-colors duration-500 ${
                  demoStep !== "idle" ? "bg-blue-900" : "bg-gray-200"
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-full font-bold text-sm flex items-center justify-center flex-shrink-0 transition-colors ${
                    demoStep !== "idle" ? "bg-white text-blue-900" : "bg-gray-400 text-white"
                  }`}
                >
                  2
                </span>
                <span
                  className={`font-semibold text-sm ${demoStep !== "idle" ? "text-white" : "text-gray-500"}`}
                >
                  System Identifies Location
                </span>
                {demoStep === "locating" && (
                  <div style={{ ...spinnerStyle, marginLeft: "auto" }} />
                )}
                {demoStep === "matched" && (
                  <svg className="w-4 h-4 text-green-300 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div className="p-6">
                <p className="text-gray-500 text-sm mb-5">
                  The system pulls the RAL owner&apos;s location from their profile address or GPS and normalizes it for matching.
                </p>
                <div
                  className={`grid grid-cols-3 gap-2 sm:gap-4 transition-opacity duration-700 ${
                    demoStep !== "idle" ? "opacity-100" : "opacity-30"
                  }`}
                >
                  {[
                    {
                      icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z",
                      label: "City",
                      value: "Phoenix, AZ",
                    },
                    {
                      icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
                      label: "ZIP Code",
                      value: "85028",
                    },
                    {
                      icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7",
                      label: "Radius",
                      value: "10 miles",
                    },
                  ].map((item) => (
                    <div key={item.label} className="bg-gray-50 border border-gray-100 rounded-xl p-2 sm:p-4 text-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <svg className="w-4 h-4 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                        </svg>
                      </div>
                      <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                      <p
                        className={`text-sm font-bold transition-colors ${
                          demoStep !== "idle" ? "text-gray-900" : "text-gray-300"
                        }`}
                      >
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Arrow connector */}
            <div className="flex justify-center py-1">
              <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* STEP 3 */}
            <div
              className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-500 ${
                demoStep === "matched" ? "border-green-200" : "border-gray-200 opacity-50"
              }`}
            >
              <div
                className={`px-6 py-3 flex items-center gap-3 transition-colors duration-500 ${
                  demoStep === "matched" ? "bg-green-700" : "bg-gray-200"
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-full font-bold text-sm flex items-center justify-center flex-shrink-0 ${
                    demoStep === "matched" ? "bg-white text-green-700" : "bg-gray-400 text-white"
                  }`}
                >
                  3
                </span>
                <span
                  className={`font-semibold text-sm ${
                    demoStep === "matched" ? "text-white" : "text-gray-500"
                  }`}
                >
                  System Matches Partners
                </span>
                {demoStep === "matched" && (
                  <span className="ml-auto text-xs bg-white/20 text-white px-2.5 py-1 rounded-full font-semibold">
                    2 Partners Found
                  </span>
                )}
              </div>
              <div className="p-6">
                <p className="text-gray-500 text-sm mb-5">
                  Only <strong className="text-gray-900">2 trusted partners</strong> are shown — matched by service type and proximity. No list. No competition.
                </p>

                {demoStep === "matched" ? (
                  <div className="space-y-4" style={{ animation: "fadeInUp 0.5s ease-out forwards" }}>
                    {MOCK_PARTNERS.map((partner, i) => (
                      <div
                        key={partner.name}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between border border-gray-100 rounded-xl p-4 gap-3"
                        style={{ animation: `fadeInUp 0.4s ease-out ${i * 0.15}s both` }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 text-blue-900 font-bold text-sm">
                            {partner.name[0]}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="font-bold text-gray-900 text-sm">{partner.name}</span>
                              <span className="inline-flex items-center gap-1 text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-semibold">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Trusted Partner
                              </span>
                            </div>
                            <p className="text-gray-500 text-xs">
                              {partner.phone} · {partner.category}
                            </p>
                          </div>
                        </div>
                        <button className="text-xs bg-blue-900 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-800 transition-colors flex-shrink-0 w-full sm:w-auto text-center">
                          Quick Contact
                        </button>
                      </div>
                    ))}
                    <p className="text-xs text-gray-400 text-center pt-2">
                      Only these 2 providers are shown. No one else competes for this request.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 opacity-30">
                    {[1, 2].map((i) => (
                      <div key={i} className="flex items-center gap-4 border border-gray-100 rounded-xl p-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 bg-gray-100 rounded w-2/3" />
                          <div className="h-2.5 bg-gray-100 rounded w-1/3" />
                        </div>
                        <div className="w-24 h-8 bg-gray-100 rounded-lg flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {demoStep === "idle" && (
            <p className="text-center text-xs text-gray-400 mt-5">
              Use the form in Step 1 to simulate the system
            </p>
          )}
          {demoStep === "matched" && (
            <div className="text-center mt-5">
              <button
                onClick={() => {
                  setDemoStep("idle");
                  setDemoService("");
                  setDemoUrgency("");
                }}
                className="text-xs text-gray-400 hover:text-gray-600 underline"
              >
                Reset demo
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ─── SECTION 4: WHAT MAKES THIS DIFFERENT ────────────── */}
      <div className="bg-white py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-4">The Difference</p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-10">This Is Not Advertising</h2>
          <div className="space-y-4 max-w-xl mx-auto text-left">
            {[
              {
                not: "You are not placed in a list.",
                is: "You are positioned as a trusted referral inside the system.",
              },
              {
                not: "You are not competing with dozens of companies.",
                is: "You are one of only 2 providers shown per category per area.",
              },
              {
                not: "You are not an ad waiting to be clicked.",
                is: "You are placed in front of a decision-maker at the exact moment of need.",
              },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                <p className="text-red-400 text-sm line-through mb-2">{item.not}</p>
                <div className="flex items-start gap-2">
                  <svg
                    className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-gray-900 text-sm font-semibold">{item.is}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── SECTION 5: POWER POSITIONING ────────────────────── */}
      <div className="bg-blue-950 py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-tight">
            You&apos;re Not Chasing Business —
            <br className="hidden md:block" />
            You&apos;re Being Chosen
          </h2>
          <p className="text-blue-300 text-base md:text-lg leading-relaxed mb-5 max-w-2xl mx-auto">
            Instead of spending money trying to get attention, you are placed directly in front of decision-makers when they are actively looking for your service.
          </p>
          <p className="text-amber-300 text-base font-bold">
            This is real demand — not marketing guesses.
          </p>
        </div>
      </div>

      {/* ─── SECTION 6: WHY THIS GENERATES BUSINESS ──────────── */}
      <div className="bg-gray-50 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Why This Generates Business (And Why It&apos;s Different)
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                iconPath:
                  "M13 10V3L4 14h7v7l9-11h-7z",
                iconColor: "text-orange-600",
                iconBg: "bg-orange-50",
                border: "border-orange-100",
                title: "Immediate Need",
                points: [
                  "A resident needs transport today",
                  "A home needs hospice support now",
                  "A service is required immediately",
                ],
                footer: "This is high-intent demand — not 'maybe' leads.",
              },
              {
                iconPath:
                  "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636",
                iconColor: "text-blue-700",
                iconBg: "bg-blue-50",
                border: "border-blue-100",
                title: "No Tire Kickers",
                points: [
                  "No browsing through options",
                  "No shopping around endlessly",
                  "No comparing dozens of vendors",
                ],
                footer: "The owner needs a solution NOW.",
              },
              {
                iconPath:
                  "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
                iconColor: "text-purple-700",
                iconBg: "bg-purple-50",
                border: "border-purple-100",
                title: "Limited Competition",
                points: [
                  "Only 2 providers per category per area",
                  "Not 10. Not 20. Not 50.",
                  "You are one of two — full stop.",
                ],
                footer: "You are not lost in a crowd.",
              },
              {
                iconPath:
                  "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
                iconColor: "text-emerald-700",
                iconBg: "bg-emerald-50",
                border: "border-emerald-100",
                title: "Trust-Based Positioning",
                points: [
                  "You are not an ad",
                  "You are a trusted referral inside the system",
                  "The owner sees you as a vetted partner",
                ],
                footer: "You are positioned — not advertised.",
              },
            ].map((block) => (
              <div
                key={block.title}
                className={`bg-white rounded-2xl border ${block.border} p-6 shadow-sm`}
              >
                <div
                  className={`w-10 h-10 ${block.iconBg} rounded-xl flex items-center justify-center mb-4`}
                >
                  <svg
                    className={`w-5 h-5 ${block.iconColor}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={block.iconPath}
                    />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-3">{block.title}</h3>
                <ul className="space-y-1.5 mb-4">
                  {block.points.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-sm text-gray-600">
                      <svg
                        className="w-3.5 h-3.5 text-gray-300 flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                      {point}
                    </li>
                  ))}
                </ul>
                <p
                  className={`text-sm font-semibold ${block.iconColor} pt-3 border-t border-gray-100`}
                >
                  {block.footer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── SECTION 7: COST ADVANTAGE ───────────────────────── */}
      <div className="bg-white py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              A Fraction of the Cost — Multiples of the Impact
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Traditional */}
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
              <h3 className="font-bold text-red-800 text-base mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Traditional Marketing
              </h3>
              <ul className="space-y-2.5 mb-5">
                {["Google Ads", "Direct mail", "SEO", "Cold outreach"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-red-700">
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-red-700 text-sm font-semibold border-t border-red-200 pt-4">
                Costs thousands — with uncertain results.
              </p>
            </div>

            {/* RAL Connect */}
            <div className="bg-blue-900 rounded-2xl p-6">
              <h3 className="font-bold text-white text-base mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-amber-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                RAL Connect
              </h3>
              <ul className="space-y-2.5 mb-5">
                {[
                  "Hundreds of active RAL owners",
                  "Real-time placement",
                  "Real, immediate needs",
                  "Targeted — not broadcast",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-blue-200">
                    <svg
                      className="w-3.5 h-3.5 text-amber-400 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-amber-300 text-sm font-semibold border-t border-white/20 pt-4">
                Places you directly in front of decision-makers at the exact moment they need you.
              </p>
            </div>
          </div>
          <p className="text-center text-gray-500 text-sm mt-8 leading-relaxed">
            This is not mass exposure.
            <br />
            <span className="font-semibold text-gray-800">
              This is targeted access to decision-makers at the exact moment they need you.
            </span>
          </p>
        </div>
      </div>

      {/* ─── SECTION 8: SCALE + EXPOSURE ─────────────────────── */}
      <div className="bg-gray-50 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-5">Built to Reach Hundreds of Homes</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-10 max-w-xl mx-auto">
            As the platform grows, more RAL homes join, more needs are submitted, and more opportunities are created for every Preferred Partner.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                label: "Consistent Visibility",
                desc: "You are seen every time a matching need is submitted in your area.",
                iconPath:
                  "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
              },
              {
                label: "Recurring Opportunity Flow",
                desc: "Every new home that joins creates new, ongoing opportunities for you.",
                iconPath:
                  "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
              },
              {
                label: "Direct Access",
                desc: "Direct access to a growing network of active assisted living decision-makers.",
                iconPath:
                  "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
              >
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-5 h-5 text-blue-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={item.iconPath}
                    />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-2">{item.label}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── SECTION 9: SCARCITY ─────────────────────────────── */}
      <div className="bg-amber-50 border-y border-amber-100 py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">We Keep This Limited On Purpose</h2>
          <p className="text-gray-600 text-base leading-relaxed mb-8 max-w-xl mx-auto">
            Each service category is limited to a small number of providers per area. This ensures quality, reliability, and real opportunity for every partner in the system.
          </p>
          <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto mb-8">
            {[
              { label: "Quality", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
              { label: "Reliability", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
              { label: "Opportunity", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
            ].map((item) => (
              <div key={item.label} className="bg-white border border-amber-200 rounded-xl p-3 text-center">
                <svg className="w-5 h-5 text-amber-700 mx-auto mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                <p className="text-amber-800 text-xs font-semibold">{item.label}</p>
              </div>
            ))}
          </div>
          <div className="bg-white border border-amber-300 rounded-2xl px-6 py-4 inline-block shadow-sm">
            <p className="text-amber-900 text-sm font-bold">
              Once a category is filled in your area — spots are closed.
            </p>
          </div>
        </div>
      </div>

      {/* ─── SECTION 10: CTA FORM ────────────────────────────── */}
      <div id="request-info" className="bg-blue-900 py-16 px-6">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-3">Request Preferred Partner Info</h2>
            <p className="text-blue-200 text-sm leading-relaxed">
              We&apos;ll walk you through how it works and see if it&apos;s a fit.
            </p>
          </div>

          {formSubmitted ? (
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
              <h3 className="text-xl font-bold text-gray-900 mb-2">Request Received!</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                We&apos;ll be in touch within 24 hours to walk you through the program and see if it&apos;s a fit for your area.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleFormSubmit}
              className="bg-white rounded-2xl p-8 space-y-4 shadow-xl"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Your Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="John Smith"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Company / Organization *
                  </label>
                  <input
                    required
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    placeholder="Valley Transport Services"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Service Category *
                </label>
                <CustomSelect
                  value={form.serviceCategory}
                  onChange={(val) => setForm({ ...form, serviceCategory: val })}
                  placeholder="Select your service type..."
                  options={[
                    { value: "transport", label: "Transport" },
                    { value: "hospice", label: "Hospice" },
                    { value: "home-health", label: "Home Health" },
                    { value: "pharmacy", label: "Pharmacy" },
                    { value: "mobile-services", label: "Mobile Services" },
                  ]}
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
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="(602) 555-0100"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Email *
                  </label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="john@company.com"
                    className={inputClass}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={formLoading}
                className="w-full bg-amber-400 hover:bg-amber-300 text-gray-900 font-bold py-4 px-6 rounded-xl transition-colors text-base disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {formLoading ? (
                  <>
                    <div
                      style={{
                        ...spinnerStyle,
                        borderColor: "rgba(0,0,0,0.15)",
                        borderTopColor: "#374151",
                      }}
                    />
                    Submitting...
                  </>
                ) : (
                  "Request Preferred Partner Info →"
                )}
              </button>

              <p className="text-xs text-gray-400 text-center">
                We&apos;ll walk you through how it works and see if it&apos;s a fit.
              </p>
            </form>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-500 text-xs text-center py-6 px-6">
        <p>© 2025 RAL Connect · Preferred Partner Program · For partner inquiries only</p>
      </footer>
    </div>
  );
}
