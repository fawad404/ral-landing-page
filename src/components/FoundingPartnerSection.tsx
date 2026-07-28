interface Props { onOpenModal: () => void; }

const reasons = [
  { text: "Maintain quality across the network", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg> },
  { text: "Ensure proper visibility for each home", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg> },
  { text: "Build strong relationships with each home", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg> },
];

export default function FoundingPartnerSection({ onOpenModal }: Props) {
  return (
    <section id="founding-partner" className="hero-gradient relative py-24 md:py-32 overflow-hidden">
      <div className="dot-grid-dark absolute inset-0 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1d7ad4] opacity-10 rounded-full blur-[130px] pointer-events-none -translate-y-1/2 translate-x-1/3" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <div className="flex flex-col gap-7">
            <div className="flex flex-col gap-4">
              <span className="inline-flex w-fit items-center gap-2 text-xs font-bold text-[#93C5FD] uppercase tracking-widest bg-white/10 border border-white/20 px-4 py-1.5 rounded-full">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Maricopa County, Arizona
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
                Now Inviting Founding{" "}
                <span className="gradient-text-light">RAL Partners</span>
              </h2>
            </div>
            <p className="text-base text-white/65 leading-relaxed">
              We&apos;re currently working with a limited number of residential assisted living homes as we build out our local network.
            </p>
            <p className="text-base text-white/55 leading-relaxed">
              If you&apos;re interested in being part of this early group, we&apos;d love to connect.
            </p>
            <button onClick={onOpenModal}
              className="self-start inline-flex items-center gap-2 bg-white text-[#09488B] px-7 py-4 rounded-xl font-bold text-sm hover:bg-[#E8F1FB] transition-all shadow-xl hover:-translate-y-0.5 transform group">
              Become a Founding Partner
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <div className="glass-card rounded-2xl p-7 flex flex-col gap-5">
              <div>
                <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-1">Why we&apos;re keeping it selective</p>
                <p className="text-base font-bold text-white">This allows us to:</p>
              </div>
              <div className="flex flex-col gap-3">
                {reasons.map((r, i) => (
                  <div key={i} className="flex items-center gap-4 bg-white/08 border border-white/10 rounded-xl px-4 py-3.5">
                    <div className="w-9 h-9 bg-white/10 border border-white/15 rounded-lg flex items-center justify-center text-[#93C5FD] shrink-0">
                      {r.icon}
                    </div>
                    <p className="text-sm font-medium text-white/80">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl px-6 py-4 flex items-center gap-3">
              <svg className="w-5 h-5 text-[#93C5FD] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <p className="text-sm font-semibold text-white/80">Built with insight from local residential assisted living owners</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
