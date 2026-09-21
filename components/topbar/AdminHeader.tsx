'use client';
import { usePathname } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useLogout } from '@/hooks/useAuth';
import { useUnreadCount } from '@/hooks/useNotifications';
import { NotificationDropdown } from '@/components/topbar/page';

const PAGE_TITLES: Array<[string, string]> = [
  ['/admin/intelligence-hub/sources', 'Intelligence Sources'],
  ['/admin/intelligence-hub/scan-logs', 'Scan Logs'],
  ['/admin/intelligence-hub', 'Intelligence Hub'],
  ['/admin/newsletter', 'Newsletter'],
  ['/admin/users', 'Users'],
  ['/admin/facilities', 'Facilities'],
  ['/admin/vendors', 'Vendors'],
  ['/admin/leads', 'Leads'],
  ['/admin/demo-inquiries', 'Demo Inquiries'],
  ['/admin/deal-room', 'Deal Room'],
  ['/admin/inquiries', 'Inquiries'],
  ['/admin/caregivers', 'Caregiver Directory'],
  ['/admin/cms', 'CMS Content'],
  ['/admin/reports', 'Reports'],
  ['/admin/config', 'Configuration'],
];

function getTitle(pathname: string): string {
  const match = PAGE_TITLES.find(([prefix]) => pathname.startsWith(prefix));
  return match ? match[1] : 'Intelligence Operations Center';
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

const AdminHeader = () => {
  const pathname = usePathname() ?? '';
  const { user } = useAuthStore();
  const logout = useLogout();
  const { data: unreadCount = 0 } = useUnreadCount();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const displayName = user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.email : 'User';
  const initial = displayName.charAt(0).toUpperCase();
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  return (
    <header className="shrink-0 h-[72px] px-8 bg-white border-b border-[#E2E8F0] flex items-center justify-between gap-4">
      <div className="flex items-baseline gap-4 min-w-0">
        <h1 className="text-[22px] font-bold text-[#0F172A] truncate">{getTitle(pathname)}</h1>
        <p className="hidden md:block text-sm text-[#475569] whitespace-nowrap">
          {getGreeting()}, Administrator
        </p>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <div className="hidden lg:flex items-center gap-2 h-10 px-4 rounded-lg border border-[#E2E8F0] text-sm text-[#334155]">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3M4 11h16M5 5h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z" />
          </svg>
          {today}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowNotifs((p) => !p)}
            aria-label="Notifications"
            className="relative size-10 rounded-lg hover:bg-[#F1F5F9] flex items-center justify-center text-[#334155] transition-colors"
          >
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 min-w-4 h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          {showNotifs && <NotificationDropdown onClose={() => setShowNotifs(false)} />}
        </div>

        <span className="w-px h-8 bg-[#E2E8F0]" />

        <div ref={userMenuRef} className="relative">
          <button onClick={() => setShowUserMenu((p) => !p)} className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-[#0A3A78] text-white font-semibold text-base flex items-center justify-center">
              {initial}
            </div>
            <div className="hidden sm:flex flex-col items-start leading-tight">
              <p className="text-sm font-semibold text-[#0F172A]">{displayName}</p>
              <p className="text-xs text-[#64748B]">Super Admin</p>
            </div>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#64748B" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-12 w-44 bg-white border border-[#E2E8F0] rounded-xl shadow-lg z-50">
              <button
                onClick={logout}
                className="w-full text-left px-4 py-3 text-sm text-red-500 font-medium hover:bg-[#FFF1F1] rounded-xl transition-colors"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
