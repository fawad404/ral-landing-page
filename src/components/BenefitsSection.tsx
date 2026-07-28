const bullets = [
  {
    text: "More consistent inquiries",
    icon: (
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
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  },
  {
    text: "Better-fit residents",
    icon: (
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
          d="M4.5 12.75l6 6 9-13.5"
        />
      </svg>
    ),
  },
  {
    text: "Less time chasing referrals",
    icon: (
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
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    text: "More control over your occupancy",
    icon: (
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
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
];

export default function BenefitsSection() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-7">
            <div className="flex flex-col gap-4">
              <span className="inline-flex w-fit items-center text-xs font-bold text-brand uppercase tracking-widest bg-brand-bg border border-[#09488B20] px-4 py-1.5 rounded-full">
                Benefits
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-text-dark leading-tight">
                What This Means <span className="gradient-text">for You</span>
              </h2>
            </div>
            <div className="flex flex-col gap-3">
              {bullets.map((b, i) => (
                <div
                  key={i}
                  className="card-hover flex items-center gap-4 bg-surface border border-border rounded-2xl px-5 py-4 shadow-sm"
                >
                  <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center text-white shrink-0 shadow-md">
                    {b.icon}
                  </div>
                  <p className="text-sm font-semibold text-text-medium">
                    {b.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-5">
            {/* Key statement */}
            <div className="relative brand-gradient rounded-3xl p-8 overflow-hidden">
              <div className="absolute inset-0 dot-grid-dark opacity-30" />
              <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-5 rounded-full -translate-y-1/3 translate-x-1/3" />
              <div className="relative flex flex-col gap-5">
                <div className="w-12 h-12 bg-white/15 border border-white/25 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-3">
                    The Bottom Line
                  </p>
                  <p className="text-xl font-black text-white leading-snug">
                    So you&apos;re no longer dependent on high-cost or
                    unpredictable referrals.
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-white/15">
                  <svg
                    className="w-4 h-4 text-[#93C5FD] shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm text-white/70">
                    Built with insight from local RAL owners
                  </p>
                </div>
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  label: "No Pay-to-Play",
                  sub: "Fair visibility for all homes",
                  icon: (
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
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  ),
                },
                {
                  label: "No Favoritism",
                  sub: "Matched by need, not by pay",
                  icon: (
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
                        d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                      />
                    </svg>
                  ),
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-surface border border-border rounded-2xl p-5 flex flex-col gap-2.5 card-hover"
                >
                  <div className="w-9 h-9 bg-brand-bg border border-[#09488B15] rounded-xl flex items-center justify-center text-brand">
                    {item.icon}
                  </div>
                  <p className="text-sm font-bold text-text-dark">
                    {item.label}
                  </p>
                  <p className="text-xs text-text-subtle">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
