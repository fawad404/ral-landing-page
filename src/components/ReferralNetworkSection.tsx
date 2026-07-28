const sources = [
  {
    label: "Hospital Discharge Planners",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    ),
  },
  {
    label: "Case Managers",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
        />
      </svg>
    ),
  },
  {
    label: "Social Workers",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
  },
  {
    label: "Families Searching for Care",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
];

export default function ReferralNetworkSection() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Source cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 order-2 lg:order-1">
            {sources.map((s, i) => (
              <div
                key={i}
                className="card-hover bg-surface border border-border rounded-2xl p-5 flex items-center gap-4 shadow-sm"
              >
                <div className="w-11 h-11 bg-linear-to-br from-brand-bg to-[#DBEAFE] border border-[#09488B15] rounded-xl flex items-center justify-center text-brand shrink-0">
                  {s.icon}
                </div>
                <p className="text-sm font-semibold text-text-medium leading-snug">
                  {s.label}
                </p>
              </div>
            ))}

            {/* Flow indicator */}
            <div className="sm:col-span-2 bg-linear-to-r from-brand to-brand-mid rounded-2xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>
              <p className="text-sm font-semibold text-white/90 leading-snug">
                All routed directly to your matched home
              </p>
            </div>
          </div>

          {/* Right: Text */}
          <div className="flex flex-col gap-7 order-1 lg:order-2">
            <div className="flex flex-col gap-4">
              <span className="inline-flex w-fit items-center text-xs font-bold text-brand uppercase tracking-widest bg-brand-bg border border-[#09488B20] px-4 py-1.5 rounded-full">
                Referral Network
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-text-dark leading-tight">
                Connecting You to{" "}
                <span className="gradient-text">Real Referral Sources</span>
              </h2>
            </div>
            <p className="text-base text-text-subtle leading-relaxed">
              RAL Connect is being built to work alongside the people who
              influence placement decisions every day.
            </p>

            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3 p-4 bg-surface border border-border rounded-xl">
                <svg
                  className="w-5 h-5 text-brand mt-0.5 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-sm text-text-muted leading-relaxed">
                  Our goal is simple — make it easier for the right people to
                  find the right homes, without the usual delays and confusion.
                </p>
              </div>
              <p className="text-xs text-text-faint italic leading-relaxed px-1">
                As the platform grows, this creates more consistent
                opportunities for homes that are active and engaged.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
