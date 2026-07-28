"use client";

interface Props {
  onOpenModal: () => void;
}

export default function FinalCtaSection({ onOpenModal }: Props) {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-surface border border-border rounded-3xl p-10 md:p-14 flex flex-col items-center gap-8 text-center shadow-xl relative overflow-hidden">
          <div className="dot-grid absolute inset-0 opacity-50 pointer-events-none" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand opacity-5 rounded-full -translate-y-1/2 translate-x-1/2" />

          <div className="relative flex flex-col items-center gap-5">
            <span className="inline-flex items-center gap-2 text-xs font-bold text-[#09488B] uppercase tracking-widest bg-[#E8F1FB] border border-[#09488B20] px-4 py-1.5 rounded-full">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              No pressure
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0F172A] leading-tight">
              Let&apos;s See If{" "}
              <span className="gradient-text">This Is a Fit</span>
            </h2>
            <p className="text-base text-[#64748B] leading-relaxed max-w-lg">
              There&apos;s no pressure — just a quick conversation to see if
              this makes sense for your home.
            </p>
          </div>

          <div className="relative flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <button
              onClick={onOpenModal}
              className="w-full sm:w-auto bg-gradient-to-r from-[#09488B] to-[#1d7ad4] text-white px-10 py-4 rounded-2xl text-base font-bold hover:from-[#063264] hover:to-[#09488B] transition-all shadow-xl hover:shadow-[#09488B40] hover:-translate-y-0.5 transform"
            >
              Request Information
            </button>
            {/* <button
              onClick={onOpenModal}
              className="w-full sm:w-auto bg-white border-2 border-[#09488B] text-[#09488B] px-10 py-4 rounded-2xl text-base font-bold hover:bg-[#E8F1FB] transition-all"
            >
              Schedule a Call
            </button> */}
          </div>

          <p className="relative text-xs text-text-faint">
            We&apos;ll review your info and reach out personally. No spam, no
            pressure.
          </p>
        </div>
      </div>
    </section>
  );
}
