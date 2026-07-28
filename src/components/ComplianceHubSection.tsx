const features = [
  {
    title: "Track Responsibilities",
    text: "Track key compliance responsibilities across your team in one place.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        />
      </svg>
    ),
  },
  {
    title: "Stay Updated",
    text: "Stay updated on important regulatory changes before they affect you.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
    ),
  },
  {
    title: "Inspection Ready",
    text: "Be better prepared for inspections with organized documentation.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
  },
  {
    title: "Reduce Scrambling",
    text: "Reduce last-minute scrambling with proactive alerts and checklists.",
    icon: (
      <svg
        className="w-6 h-6"
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
    ),
  },
];

export default function ComplianceHubSection() {
  return (
    <section
      className="relative py-24 md:py-32 overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, #020e1f 0%, #063264 40%, #09488B 100%)",
      }}
    >
      <div className="dot-grid-dark absolute inset-0 pointer-events-none" />

      {/* Glow orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1d7ad4] opacity-10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand opacity-15 rounded-full blur-[100px] pointer-events-none translate-y-1/2 -translate-x-1/4" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <div className="flex flex-col gap-7">
            <div className="flex flex-col gap-4">
              <span className="inline-flex w-fit items-center text-xs font-bold text-[#93C5FD] uppercase tracking-widest bg-white/10 border border-white/20 px-4 py-1.5 rounded-full">
                Compliance Hub
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
                Stay Organized.{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60A5FA] to-[#34D399]">
                  Stay Ahead.
                </span>
              </h2>
            </div>
            <p className="text-base text-white/65 leading-relaxed">
              We&apos;re also building a Compliance &amp; Manager Support Hub
              designed to simplify day-to-day operations and reduce stress
              around regulatory requirements.
            </p>

            <div className="glass-card rounded-2xl px-6 py-5 flex items-start gap-4">
              <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                <svg
                  className="w-5 h-5 text-[#93C5FD]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              <p className="text-sm font-semibold text-white/85 italic leading-relaxed">
                Built to support your manager — not replace them.
              </p>
            </div>
          </div>

          {/* Right: Feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <div
                key={i}
                className="glass-card rounded-2xl p-6 flex flex-col gap-4 hover:bg-white/12 transition-colors"
              >
                <div className="w-11 h-11 bg-gradient-to-br from-[#60A5FA20] to-[#34D39920] border border-white/15 rounded-xl flex items-center justify-center text-[#93C5FD]">
                  {f.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white mb-1.5">
                    {f.title}
                  </h3>
                  <p className="text-xs text-white/55 leading-relaxed">
                    {f.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
