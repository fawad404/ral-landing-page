interface Props {
  onOpenModal: () => void;
}

export default function SolutionSection({ onOpenModal }: Props) {
  return (
    <section id="features" className="bg-white py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div className="flex flex-col gap-7">
            <div className="flex flex-col gap-4">
              <span className="inline-flex w-fit items-center text-xs font-bold text-[#09488B] uppercase tracking-widest bg-[#E8F1FB] border border-[#09488B20] px-4 py-1.5 rounded-full">
                The Solution
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0F172A] leading-tight">
                A Better Way to <span className="gradient-text">Stay Full</span>
              </h2>
              <p className="text-base text-[#64748B] leading-relaxed">
                RAL Connect helps your home get in front of families and
                professionals who are actively searching for care — right when
                they need it.
              </p>
              <p className="text-base text-text-muted">
                Instead of waiting for referrals…
              </p>
            </div>

            <div className="relative bg-[#E8F1FB] border border-[#09488B20] rounded-2xl p-6 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand opacity-5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center text-white shrink-0 mt-0.5 shadow-md">
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
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
                <p className="text-base font-bold text-[#09488B] leading-relaxed">
                  You become visible at the right time, for the right residents.
                </p>
              </div>
            </div>

            <button
              onClick={onOpenModal}
              className="self-start inline-flex items-center gap-2 bg-brand text-white px-7 py-3.5 rounded-xl text-sm font-bold hover:bg-[#063264] transition-all shadow-lg hover:shadow-xl group"
            >
              Request Information
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
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
            </button>
          </div>

          {/* Right: Before / After */}
          <div className="flex flex-col gap-4">
            {/* Before */}
            <div className="bg-surface border border-border rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-[#E2E8F0] rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-text-muted"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <span className="text-sm font-bold text-text-muted uppercase tracking-wide">
                  Before RAL Connect
                </span>
              </div>
              <ul className="flex flex-col gap-2.5">
                {[
                  "Waiting on word of mouth",
                  "Paying high placement fees",
                  "No control over who inquires",
                  "Empty beds = lost revenue",
                ].map((t) => (
                  <li
                    key={t}
                    className="flex items-center gap-2.5 text-sm text-[#64748B]"
                  >
                    <svg
                      className="w-4 h-4 text-text-faint shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* After */}
            <div className="bg-[#E8F1FB] border border-[#09488B30] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-sm font-bold text-[#09488B] uppercase tracking-wide">
                  With RAL Connect
                </span>
              </div>
              <ul className="flex flex-col gap-2.5">
                {[
                  "Consistent visibility to active searchers",
                  "No placement fees",
                  "Better-fit resident inquiries",
                  "More control over your occupancy",
                ].map((t) => (
                  <li
                    key={t}
                    className="flex items-center gap-2.5 text-sm text-[#1E3A5F]"
                  >
                    <svg
                      className="w-4 h-4 text-[#09488B] shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
