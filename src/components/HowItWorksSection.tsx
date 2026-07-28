const steps = [
  {
    number: "01",
    title: "Create Your Profile",
    description: "Share basic information about your home, care level, and availability. Quick and easy setup.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Update in Seconds",
    description: "Quickly update your bed availability — takes less than a minute whenever your status changes.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Get Matched",
    description: "Families and professionals find and connect with you based on real needs, location, and availability.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-surface relative py-24 md:py-32">
      <div className="dot-grid absolute inset-0 opacity-40 pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-16">

        <div className="text-center flex flex-col items-center gap-4">
          <span className="inline-flex items-center text-xs font-bold text-[#09488B] uppercase tracking-widest bg-[#E8F1FB] border border-[#09488B20] px-4 py-1.5 rounded-full">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0F172A] leading-tight">
            Simple. Fast.{" "}
            <span className="gradient-text">Designed for Real Homes.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="relative flex flex-col">
              {i < steps.length - 1 && (
                <div className="hidden md:flex absolute top-9 left-[calc(100%-12px)] w-6 z-10 items-center justify-center">
                  <svg className="w-5 h-5 text-[#09488B40]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
              <div className="card-hover bg-white border border-border rounded-2xl p-7 flex flex-col gap-5 h-full shadow-sm relative overflow-hidden">
                <span className="absolute top-3 right-4 text-7xl font-black text-[#09488B06] leading-none select-none">{step.number}</span>
                <div className="w-12 h-12 bg-gradient-to-br from-[#09488B] to-[#1d7ad4] rounded-xl flex items-center justify-center text-white shadow-md relative z-10">
                  {step.icon}
                </div>
                <div className="relative z-10">
                  <h3 className="text-base font-bold text-[#0F172A] mb-2">{step.title}</h3>
                  <p className="text-sm text-[#64748B] leading-relaxed">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dashboard note */}
        <div className="bg-white border border-border rounded-2xl p-6 flex items-center gap-5 shadow-sm max-w-2xl mx-auto w-full">
          <div className="w-12 h-12 bg-gradient-to-br from-[#E8F1FB] to-[#DBEAFE] border border-[#09488B15] rounded-xl flex items-center justify-center text-[#09488B] shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-[#0F172A]">Manage everything from your dashboard</p>
            <p className="text-xs text-[#64748B] mt-0.5">Update availability, view inquiries, and manage your profile — all in one place.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
