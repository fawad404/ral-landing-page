const points = [
  {
    title: "No Unnecessary Features",
    text: "Every feature earned its place by solving a real operator problem.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
    ),
  },
  {
    title: "No Added Complexity",
    text: "Simple, intuitive, and easy to use — even without tech experience.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h8m-8 6h16" />
      </svg>
    ),
  },
  {
    title: "Only What Helps",
    text: "Focused entirely on what makes your operation easier and more profitable.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function BuiltWithSection() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: Text */}
          <div className="flex flex-col gap-7">
            <div className="flex flex-col gap-4">
              <span className="inline-flex w-fit items-center text-xs font-bold text-[#09488B] uppercase tracking-widest bg-[#E8F1FB] border border-[#09488B20] px-4 py-1.5 rounded-full">
                Built for Operators
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0F172A] leading-tight">
                Built With Real-World Input —{" "}
                <span className="gradient-text">Not Guesswork</span>
              </h2>
            </div>
            <p className="text-base text-[#64748B] leading-relaxed">
              RAL Connect was developed alongside local Residential Assisted Living owners to ensure everything inside the system is practical, relevant, and focused only on what actually helps.
            </p>

            {/* Quote card */}
            <div className="relative bg-surface border border-border rounded-2xl p-6">
              <div className="absolute top-4 left-5 text-5xl font-black text-[#09488B10] leading-none select-none">&ldquo;</div>
              <p className="relative text-sm font-semibold text-[#334155] leading-relaxed italic pt-2">
                Made for operators, by people who understand your world. Every decision inside RAL Connect was shaped by real experiences from the field.
              </p>
            </div>
          </div>

          {/* Right: Points */}
          <div className="flex flex-col gap-4">
            {points.map((p, i) => (
              <div
                key={i}
                className="card-hover flex items-start gap-5 bg-surface border border-border rounded-2xl p-6 shadow-sm"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-[#09488B] to-[#1d7ad4] rounded-xl flex items-center justify-center text-white shadow-md shrink-0">
                  {p.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0F172A] mb-1.5">{p.title}</h3>
                  <p className="text-sm text-[#64748B] leading-relaxed">{p.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
