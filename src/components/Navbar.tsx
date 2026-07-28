'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  onOpenModal?: () => void;
}

const NAV_LINKS = [
  { label: 'Newsletter',           href: '/#newsletter-signup' },
  { label: 'How It Works',         href: '/#how-it-works' },
  { label: 'Benefits',             href: '/#features' },
  { label: 'Founding Partner',     href: '/#founding-partner' },
  { label: 'Caregiver Directory',  href: '/caregiver-directory' },
  { label: 'Availability Request', href: '/request' },
];

export default function Navbar({ onOpenModal }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src="/logo.png"
            alt="RAL Connect"
            width={915}
            height={457}
            priority
            className="h-11 w-auto object-contain"
          />
        </Link>

        {/* Desktop nav — visible at lg and above */}
        <nav className="hidden lg:flex items-center gap-5 flex-1 justify-center">
          {NAV_LINKS.map(item => (
            <Link
              key={item.label}
              href={item.href}
              className="text-[13px] font-medium text-text-muted hover:text-brand transition-colors whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2 shrink-0">
          {/* CTA — hidden on xs, visible from sm up */}
          <Link
            href="/#newsletter-signup"
            className="hidden sm:inline-flex items-center bg-brand text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-brand-dark transition-all shadow-sm whitespace-nowrap"
          >
            Subscribe Free
          </Link>

          {/* Hamburger — visible below lg */}
          <button
            type="button"
            onClick={() => setOpen(v => !v)}
            aria-label="Toggle navigation"
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl border border-border text-text-muted hover:bg-surface transition-colors"
          >
            {open ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {open && (
        <div className="lg:hidden border-t border-border bg-white shadow-lg">
          <nav className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-0.5">
            {NAV_LINKS.map(item => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="px-4 py-3 text-sm font-medium text-text-muted hover:text-brand hover:bg-surface rounded-xl transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2 pb-1 px-4">
              <Link
                href="/#newsletter-signup"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center w-full bg-brand text-white py-3 rounded-xl text-sm font-bold hover:bg-brand-dark transition-colors"
              >
                Subscribe Free
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
