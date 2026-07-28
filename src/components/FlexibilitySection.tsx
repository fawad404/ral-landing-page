const paths = [
  {
    audience: "For Families",
    title: "Self-Guided Exploration",
    desc: "Families can explore options on their own using the platform — browse homes, compare availability, and connect directly.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    audience: "Concierge Service",
    title: "Guided Placement Support",
    desc: "If families prefer guidance, we offer a concierge service to help them through the process — matching them with the right home.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
    ),
  },
];

export default function FlexibilitySection() {
  return (
    <section className="bg-surface relative py-24 md:py-32">
      <div className="dot-grid absolute inset-0 opacity-40 pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-14">

        <div className="text-center flex flex-col items-center gap-4 max-w-2xl mx-auto">
          <span className="inline-flex items-center text-xs font-bold text-[#09488B] uppercase tracking-widest bg-[#E8F1FB] border border-[#09488B20] px-4 py-1.5 rounded-full">
            Flexibility
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0F172A] leading-tight">
            Designed for Both{" "}
            <span className="gradient-text">Families and Homes</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {paths.map((p, i) => (
            <div key={i} className="card-hover bg-white border border-border rounded-2xl p-8 flex flex-col gap-5 shadow-sm">
              <div className="w-12 h-12 brand-gradient rounded-xl flex items-center justify-center text-white shadow-md">
                {p.icon}
              </div>
              <div>
                <span className="text-xs font-bold text-[#64748B] uppercase tracking-widest">{p.audience}</span>
                <h3 className="text-lg font-black text-[#0F172A] mt-1 mb-2">{p.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto w-full">
          <div className="relative brand-gradient rounded-2xl px-8 py-5 text-center overflow-hidden">
            <div className="absolute inset-0 dot-grid-dark opacity-30" />
            <div className="relative flex items-center justify-center gap-3">
              <svg className="w-5 h-5 text-white/70 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <p className="text-base font-bold text-white">
                Either way, your home is positioned to be seen.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
