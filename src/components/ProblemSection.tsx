const problems = [
  {
    text: "Inconsistent — referrals come and go with no reliable flow",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
      </svg>
    ),
  },
  {
    text: "Expensive — placement fees eat directly into your revenue",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    text: "Not always the right fit — mismatched residents cause real problems",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
    ),
  },
];

export default function ProblemSection() {
  return (
    <section className="bg-surface relative py-24 md:py-32">
      <div className="dot-grid absolute inset-0 opacity-40 pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-14">

          <div className="text-center flex flex-col items-center gap-5">
            <span className="inline-flex items-center gap-2 text-xs font-bold text-[#09488B] uppercase tracking-widest bg-[#E8F1FB] border border-[#09488B30] px-4 py-1.5 rounded-full">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              The Problem
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0F172A] leading-tight">
              Most Homes Are{" "}
              <span className="gradient-text">Relying on Chance</span>
            </h2>
            <p className="text-base text-[#64748B] leading-relaxed max-w-xl">
              Many residential assisted living homes depend on word of mouth or outside referrals to fill their beds. But those referrals can be:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full">
            {problems.map((p, i) => (
              <div key={i} className="card-hover bg-white border border-border rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
                <div className="w-11 h-11 bg-[#E8F1FB] border border-[#09488B20] rounded-xl flex items-center justify-center text-[#09488B] shrink-0">
                  {p.icon}
                </div>
                <p className="text-sm font-semibold text-[#334155] leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>

          <div className="relative brand-gradient rounded-2xl px-8 py-6 overflow-hidden w-full max-w-2xl text-center">
            <div className="absolute inset-0 dot-grid-dark opacity-30" />
            <p className="relative text-base font-bold text-white leading-relaxed">
              And when a bed sits empty —{" "}
              <span className="text-[#93C5FD]">it costs you.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
