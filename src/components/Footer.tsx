import Image from "next/image";
import Link from "next/link";

const links = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Benefits", href: "#benefits" },
  { label: "Become a Founding Partner", href: "#founding-partner" },
  { label: "Caregiver Directory", href: "/caregiver-directory" },
  { label: "Join as a Caregiver", href: "/caregiver-apply" },
];

export default function Footer() {
  return (
    <footer className="bg-[#060D1F] relative overflow-hidden">
      {/* Top gradient border */}
      <div className="h-px w-full bg-linear-to-r from-transparent via-brand-mid to-transparent" />

      {/* Glow blobs */}
      <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-brand opacity-10 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 translate-y-1/2" />
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-brand-mid opacity-8 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 flex flex-col gap-12">
        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Brand column */}
          <div className="flex flex-col gap-5 lg:col-span-1">
            <div className="bg-white rounded-xl w-fit p-4">
              <Image
                src="/logo.png"
                alt="RAL Connect"
                width={915}
                height={457}
                className="h-12 w-auto object-contain"
              />
            </div>
            <p className="text-sm text-text-faint leading-relaxed max-w-xs">
              A neutral platform connecting residential assisted living homes
              with families and professionals across Maricopa County, Arizona.
            </p>
            <div className="flex items-center gap-2 text-xs text-brand-glow font-medium">
              <svg
                className="w-4 h-4 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Maricopa County, Arizona
            </div>
          </div>

          {/* Quick links */}
          <div className="flex flex-col gap-5">
            <p className="text-xs font-bold text-white uppercase tracking-widest">
              Quick Links
            </p>
            <ul className="flex flex-col gap-3">
              {links.map((l) => (
                <li key={l.label}>
                  {l.href.startsWith('/') ? (
                    <Link
                      href={l.href}
                      className="group flex items-center gap-2 text-sm text-text-faint hover:text-white transition-colors"
                    >
                      <span className="w-1 h-1 rounded-full bg-brand-mid group-hover:bg-brand-glow transition-colors shrink-0" />
                      {l.label}
                    </Link>
                  ) : (
                    <a
                      href={l.href}
                      className="group flex items-center gap-2 text-sm text-text-faint hover:text-white transition-colors"
                    >
                      <span className="w-1 h-1 rounded-full bg-brand-mid group-hover:bg-brand-glow transition-colors shrink-0" />
                      {l.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact / Info */}
          <div className="flex flex-col gap-5">
            <p className="text-xs font-bold text-white uppercase tracking-widest">
              About the Platform
            </p>
            <div className="flex flex-col gap-3">
              {[
                {
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  ),
                  text: "No placement fees",
                },
                {
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                    />
                  ),
                  text: "No favoritism or pay-to-play",
                },
                {
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  ),
                  text: "Fair visibility for every home",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-brand-glow shrink-0 mt-0.5">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      {item.icon}
                    </svg>
                  </div>
                  <p className="text-sm text-text-faint leading-relaxed">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-linear-to-r from-transparent via-[#1E293B] to-transparent" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted text-center sm:text-left">
            © {new Date().getFullYear()} RAL Connect. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <a
              href="#"
              className="text-xs text-text-muted hover:text-brand-glow transition-colors"
            >
              Privacy Policy
            </a>
            <span className="w-px h-3 bg-[#1E293B]" />
            <a
              href="#"
              className="text-xs text-text-muted hover:text-brand-glow transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
