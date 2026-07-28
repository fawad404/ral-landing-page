const perks = [
  {
    title: "Free Lifetime Access",
    desc: "Early partners get full platform access at no cost — forever. No strings attached.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    gradient: "from-[#10B981] to-[#059669]",
  },
  {
    title: "Priority Placement",
    desc: "Your home is shown first when matching qualified prospects in your area.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    gradient: "from-[#F59E0B] to-[#D97706]",
  },
  {
    title: "Shape the Platform",
    desc: "Provide direct input as the system evolves. Your feedback drives what gets built next.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    gradient: "from-[#8B5CF6] to-[#7C3AED]",
  },
];

export default function EarlyAccessSection() {
  return (
    <section id="early-access" className="bg-white py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-16">

        {/* Header */}
        <div className="text-center flex flex-col items-center gap-5">
          <span className="inline-flex items-center gap-2 text-xs font-bold text-[#D97706] uppercase tracking-widest bg-[#FFFBEB] border border-[#FCD34D50] px-4 py-1.5 rounded-full">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Limited Offer
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0F172A] leading-tight">
            Now Launching — Free for{" "}
            <span className="gradient-text">Early Partners (Lifetime)</span>
          </h2>
          <p className="text-base text-[#64748B] max-w-xl leading-relaxed">
            We&apos;re currently rolling this out in the Phoenix area and inviting a limited number of homes to join early.
          </p>
        </div>

        {/* Perks */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {perks.map((p, i) => (
            <div
              key={i}
              className="card-hover bg-surface border border-border rounded-2xl p-7 flex flex-col gap-5 shadow-sm"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${p.gradient} rounded-xl flex items-center justify-center text-white shadow-md`}>
                {p.icon}
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0F172A] mb-2">{p.title}</h3>
                <p className="text-sm text-[#64748B] leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Urgency warning + CTA */}
        <div className="max-w-2xl mx-auto w-full bg-gradient-to-br from-[#FFFBEB] to-[#FEF3C7] border border-[#FCD34D60] rounded-3xl p-8 flex flex-col items-center gap-6 text-center shadow-lg">
          <div className="flex items-center gap-3 bg-[#FEF3C7] border border-[#FCD34D80] rounded-xl px-5 py-3">
            <svg className="w-5 h-5 text-[#D97706] shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-bold text-[#92400E]">This will not be free long-term.</p>
          </div>
          <p className="text-sm text-[#78350F] leading-relaxed">
            Lock in your lifetime free access now — before we open to the general public and pricing goes live.
          </p>
          <a
            href="#join-form"
            className="w-full sm:w-auto bg-gradient-to-r from-[#09488B] to-[#1d7ad4] text-white px-10 py-4 rounded-2xl text-base font-bold hover:from-[#063264] hover:to-[#09488B] transition-all shadow-xl hover:shadow-[#09488B50] hover:-translate-y-0.5 transform"
          >
            Join Free as an Early Partner →
          </a>
          <p className="text-xs text-[#A16207]">No credit card. No commitment. Free forever for early partners.</p>
        </div>
      </div>
    </section>
  );
}
