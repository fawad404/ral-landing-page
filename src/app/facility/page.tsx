"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import CustomSelect from "@/components/CustomSelect";

export default function FacilityPage() {
  const [form, setForm] = useState({
    name: "",
    facilityName: "",
    beds: "",
    phone: "",
    email: "",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/demo-inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "facility",
          name: form.name,
          email: form.email,
          phone: form.phone,
          facilityName: form.facilityName,
          beds: form.beds,
        }),
      });
    } catch {
      // silent — form still shows success to user
    }
    setFormLoading(false);
    setFormSubmitted(true);
  };

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white";

  const spinnerStyle: React.CSSProperties = {
    width: "18px",
    height: "18px",
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
        <span className="font-semibold">DEMO MODE</span> — Simulated dashboard
        experience. All data shown is fictional.
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
          <span className="hidden sm:block text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full font-semibold">
            Facility Owner Demo
          </span>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 text-white py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-blue-300 text-sm mb-5 font-medium">
            This is what your pipeline looks like when your home is active in the system.
          </p>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            See How You Can Get Pre-Matched Residents Sent Directly To Your Home
          </h1>
          <p className="text-blue-200 text-lg leading-relaxed">
            No more chasing referrals, paying high placement fees, or guessing if a resident is a good fit.
          </p>
        </div>
      </div>

      {/* Dashboard Simulation */}
      <div className="bg-gray-50 py-14 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-xs text-gray-400 mb-3 font-medium">
              Built with a Local 10-Bed Assisted Living Owner
            </p>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Your RAL Connect Dashboard
            </h2>
            <p className="text-gray-500 text-sm">
              A preview of what your control centre looks like once you join
            </p>
          </div>

          {/* Mock Dashboard Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Dashboard Header Bar */}
            <div className="bg-gray-900 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="flex gap-1 sm:gap-1.5 flex-shrink-0">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full" />
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-yellow-500 rounded-full" />
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full" />
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 ml-1 sm:ml-2 min-w-0">
                  <Image
                    src="/logo.png"
                    alt="RAL Connect"
                    width={915}
                    height={457}
                    className="h-4 sm:h-5 w-auto object-contain brightness-0 invert flex-shrink-0"
                  />
                  <span className="text-white font-semibold text-xs sm:text-sm truncate">
                    — Facility Dashboard
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span
                  className="w-2 h-2 bg-green-400 rounded-full"
                  style={{ animation: "pulse-dot 2s ease-in-out infinite" }}
                />
                <span className="text-green-400 text-xs font-semibold">
                  Active
                </span>
              </div>
            </div>

            <div className="p-6">
              {/* Incoming Matches */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Live Resident Opportunities
                  </h3>
                  <span className="text-xs font-bold bg-red-100 whitespace-nowrap text-red-600 px-2.5 py-1 rounded-full">
                    2 New
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      patient: "Maria C.",
                      care: "Assisted Living",
                      budget: "$3,500/mo",
                      location: "Phoenix, AZ",
                      time: "2 hours ago",
                    },
                    {
                      patient: "Robert T.",
                      care: "Memory Care",
                      budget: "$4,200/mo",
                      location: "Scottsdale, AZ",
                      time: "5 hours ago",
                    },
                  ].map((match) => (
                    <div
                      key={match.patient}
                      className="flex flex-col sm:flex-row sm:items-start sm:justify-between border border-gray-100 rounded-xl p-4 hover:bg-green-50/40 transition-colors gap-3"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-semibold text-gray-900 text-sm">
                              {match.patient}
                            </span>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                              New Match
                            </span>
                          </div>
                          <p className="text-gray-600 text-xs">
                            {match.care} · Budget:{" "}
                            <span className="font-bold text-gray-800">{match.budget}</span>
                            <span className="ml-2 text-green-600 font-semibold">· Ready for placement</span>
                          </p>
                          <p className="text-gray-400 text-xs flex items-center gap-1 mt-0.5">
                            <svg
                              className="w-3 h-3 flex-shrink-0"
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
                            </svg>
                            {match.location} · {match.time}
                          </p>
                          <p className="text-amber-600 text-xs font-semibold mt-1">
                            Needs placement within 24–48 hours
                          </p>
                        </div>
                      </div>
                      <button className="text-xs bg-blue-900 text-white px-3 py-2 rounded-lg font-semibold hover:bg-blue-800 transition-colors flex-shrink-0 whitespace-nowrap self-start sm:self-auto w-full sm:w-auto text-center">
                        View Match Details
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Availability */}
                <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
                    Your Availability
                  </h4>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-4xl font-bold text-blue-900">2</span>
                    <span className="text-gray-500 text-sm font-medium">
                      Beds Available
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">
                    Last Updated: Today
                  </p>
                  <p className="text-xs text-green-600 font-semibold mb-4">
                    You are currently eligible to receive matches
                  </p>
                  <button className="text-xs border border-gray-200 bg-white text-gray-600 px-3 py-1.5 rounded-lg hover:border-gray-300 transition-colors font-medium">
                    Update Availability
                  </button>
                </div>

                {/* Profile Visibility */}
                <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
                    Profile Visibility
                  </h4>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="w-2.5 h-2.5 bg-green-500 rounded-full flex-shrink-0"
                      style={{ animation: "pulse-dot 2s ease-in-out infinite" }}
                    />
                    <span className="text-sm font-semibold text-gray-900">
                      Active in Matching System
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    Visible to discharge planners actively placing residents right now
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      Profile Strength:
                    </span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`w-4 h-1.5 rounded-full ${
                            i <= 3 ? "bg-blue-500" : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-blue-600 font-semibold">
                      High
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-4">
            Simulated dashboard preview — all data shown is fictional for demo
            purposes only.
          </p>
          <p className="text-center text-sm text-gray-700 font-medium mt-5 bg-amber-50 border border-amber-200 rounded-xl py-3 px-4">
            Only a limited number of homes are accepted per area to maintain match quality.
          </p>
        </div>
      </div>

      {/* More Than Just Resident Matches */}
      <div className="bg-white py-14 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
            More Than Just Resident Matches
          </h2>
          <p className="text-gray-500 text-center mb-8 text-sm leading-relaxed max-w-2xl mx-auto">
            Not only do you receive pre-matched residents, you also get access to tools and resources designed to help you run your home more efficiently and stay compliant.
          </p>
          <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6 md:p-8">
            <ul className="space-y-4">
              {[
                {
                  icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
                  color: "text-blue-700",
                  bg: "bg-blue-50",
                  text: "Access to a Compliance Hub to help avoid issues and fines",
                },
                {
                  icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
                  color: "text-teal-700",
                  bg: "bg-teal-50",
                  text: "Direct connection to Preferred Partners when services are needed",
                },
                {
                  icon: "M13 10V3L4 14h7v7l9-11h-7z",
                  color: "text-green-700",
                  bg: "bg-green-50",
                  text: "Streamlined referral and operations support",
                },
                {
                  icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
                  color: "text-amber-700",
                  bg: "bg-amber-50",
                  text: "Built with input from active assisted living owners",
                },
              ].map((item) => (
                <li key={item.text} className="flex items-start gap-4">
                  <div className={`w-9 h-9 ${item.bg} ${item.color} rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed pt-2">{item.text}</p>
                </li>
              ))}
            </ul>
            <p className="text-gray-500 text-sm text-center mt-8 pt-6 border-t border-gray-200 leading-relaxed">
              This isn&apos;t just about filling beds — it&apos;s about running a stronger, more reliable operation.
            </p>
          </div>
        </div>
      </div>

      {/* Founding Partner Section */}
      <div className="bg-blue-900 py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-sm px-4 py-2 rounded-full mb-6">
            <svg
              className="w-4 h-4 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Founding Home Opportunity — Limited Spots
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-5 leading-tight">
            Limited Founding Homes
            <br />
            in Maricopa County
          </h2>
          <p className="text-blue-200 text-base mb-4 leading-relaxed max-w-2xl mx-auto">
            We are accepting a limited number of founding homes in the
            Phoenix/Maricopa County area. Founding homes get lifetime free
            access, priority placement in referral results, and direct input
            into the platform as it evolves.
          </p>
          <p className="text-blue-300 text-sm mb-8">
            As the platform grows, this creates more consistent referral
            opportunities for homes that are active and engaged.
          </p>
          <div className="inline-flex items-center gap-2 bg-yellow-400 text-yellow-900 font-bold px-6 py-3 rounded-xl text-sm">
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
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            This will not be free long-term
          </div>
        </div>
      </div>

      {/* Join Form */}
      <div className="bg-gray-50 py-14 px-6">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Join as a Founding Home
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Free lifetime access for early partners. Fill in the form and
              we&apos;ll reach out within 24 hours.
            </p>
          </div>

          {formSubmitted ? (
            <div
              className="bg-white rounded-2xl border border-gray-200 p-10 text-center shadow-sm"
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
                Application Received!
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Thank you for applying as a Founding Home. We&apos;ll reach out
                within 24 hours to confirm your spot and walk you through the
                setup process.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm space-y-4"
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
                    Facility Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={form.facilityName}
                    onChange={(e) =>
                      setForm({ ...form, facilityName: e.target.value })
                    }
                    placeholder="Sunrise Care Home"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Number of Beds
                </label>
                <CustomSelect
                  value={form.beds}
                  onChange={(val) => setForm({ ...form, beds: val })}
                  placeholder="Select..."
                  options={[
                    { value: "1-3", label: "1 – 3 beds" },
                    { value: "4-6", label: "4 – 6 beds" },
                    { value: "7-10", label: "7 – 10 beds" },
                    { value: "10+", label: "10+ beds" },
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
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
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
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="john@sunrisecare.com"
                    className={inputClass}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={formLoading}
                className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-4 px-6 rounded-xl transition-colors text-base disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {formLoading ? (
                  <>
                    <div style={spinnerStyle} />
                    Submitting...
                  </>
                ) : (
                  "Request Early Access →"
                )}
              </button>

              <p className="text-xs text-gray-400 text-center">
                Free lifetime access · No payment required · No automatic
                account creation
              </p>
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
