"use client";

// ─────────────────────────────────────────────────────────────────────────────
// HOW TO ACTIVATE BEEHIIV:
// 1. Client creates a Beehiiv account at beehiiv.com
// 2. In Beehiiv dashboard go to: Settings → Forms → Embed
// 3. Copy the embed code and replace the placeholder <div> below with it
// 4. Remove the placeholder card — keep only the Beehiiv embed
// ─────────────────────────────────────────────────────────────────────────────

const NEWSLETTER_TOPICS = [
  { icon: "📋", label: "Compliance & Regulatory Updates" },
  { icon: "👥", label: "Staffing & Caregiver News" },
  { icon: "🏥", label: "Industry News & Operations" },
  { icon: "⚠️", label: "Emergency & Safety Alerts" },
  { icon: "⚖️", label: "Law / Policy / ALTCS Updates" },
];

export default function NewsletterSignupSection() {
  return (
    <section
      id="newsletter-signup"
      className="bg-surface py-24 md:py-32 border-t border-border"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-14">

        {/* Header */}
        <div className="flex flex-col items-center text-center gap-5 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 text-xs font-bold text-[#09488B] uppercase tracking-widest bg-[#E8F1FB] border border-[#09488B20] px-4 py-1.5 rounded-full">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            Free Weekly Newsletter
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0F172A] leading-tight">
            The Intelligence Briefing Built{" "}
            <span className="gradient-text">for Arizona ALF Operators</span>
          </h2>
          <p className="text-base text-[#64748B] leading-relaxed">
            Every week we scan Arizona regulations, staffing news, emergency
            alerts, and industry shifts — and deliver it in plain English so you
            can act fast, stay compliant, and run a better facility.
          </p>
        </div>

        {/* Topics covered */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {NEWSLETTER_TOPICS.map((t) => (
            <div
              key={t.label}
              className="bg-white border border-border rounded-xl p-4 flex flex-col items-center text-center gap-2 shadow-sm"
            >
              <span className="text-2xl">{t.icon}</span>
              <p className="text-xs font-semibold text-text-muted leading-tight">{t.label}</p>
            </div>
          ))}
        </div>

        {/* Signup embed */}
        <div className="max-w-xl mx-auto w-full flex flex-col gap-5">

          {/* ── BEEHIIV EMBED — replace this placeholder once client provides the embed code ── */}
          <div className="bg-white border-2 border-dashed border-[#09488B40] rounded-2xl p-8 flex flex-col items-center gap-4 text-center">
            <div className="w-14 h-14 bg-[#E8F1FB] rounded-2xl flex items-center justify-center">
              <svg className="w-7 h-7 text-[#09488B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-base font-bold text-[#0F172A]">Newsletter Signup Coming Soon</p>
              <p className="text-sm text-[#64748B] mt-1 leading-relaxed">
                The Beehiiv signup form will appear here once the account is set up.
                <br />
                <span className="text-xs text-[#94A3B8]">
                  (Client: go to Beehiiv → Settings → Forms → Embed, then paste the embed code here)
                </span>
              </p>
            </div>
          </div>
          {/* ── END BEEHIIV EMBED PLACEHOLDER ── */}

          <p className="text-xs text-center text-[#94A3B8]">
            Free forever. No spam. Unsubscribe any time.
          </p>
        </div>

      </div>
    </section>
  );
}
