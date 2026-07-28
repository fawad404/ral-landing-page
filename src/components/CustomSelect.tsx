'use client';
import { useState, useEffect, useRef } from 'react';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  hasError?: boolean;
}

export default function CustomSelect({ value, onChange, options, placeholder, hasError }: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = options.find((o) => o.value === value);
  const displayLabel = selected?.label ?? placeholder ?? 'Select...';

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between gap-2 px-4 py-3 bg-white border rounded-xl text-sm transition-colors focus:outline-none ${
          hasError
            ? 'border-red-400 bg-red-50'
            : open
            ? 'border-[#09488B] ring-2 ring-[#09488B15]'
            : 'border-[#E2E8F0] hover:border-[#09488B40]'
        }`}
      >
        <span className={!selected ? 'text-[#94A3B8]' : 'text-[#0F172A]'}>{displayLabel}</span>
        <svg
          className={`w-4 h-4 flex-shrink-0 text-[#64748B] transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 top-full mt-1 left-0 w-full bg-white border border-[#E2E8F0] rounded-xl shadow-lg py-1 max-h-56 overflow-y-auto">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-[#F1F5F9] ${
                value === opt.value ? 'text-[#09488B] font-semibold bg-[#EFF6FF]' : 'text-[#374151]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
