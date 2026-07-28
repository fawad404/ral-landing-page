'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { APP_ROUTES } from '@/api/endpoints';
import { CMSContentSymbol, ConfigurationSymbol, DashboardSymbol, DealRoomSymbol, FacilitiesSymbol, InquiresSymbol, IntelligenceHubSymbol, ReportSymbol, UsersSymbol, VendorsSymbol } from '@/assets';

const CaregiverSymbol = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const NewsletterSymbol = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const navItems = [
  { title: 'Dashboard',          path: APP_ROUTES.ADMIN,                   icon: <DashboardSymbol /> },
  { title: 'Users',              path: APP_ROUTES.ADMIN_USERS,             icon: <UsersSymbol /> },
  { title: 'Facilities',         path: APP_ROUTES.ADMIN_FACILITIES,        icon: <FacilitiesSymbol /> },
  { title: 'Vendors',            path: APP_ROUTES.ADMIN_VENDORS,           icon: <VendorsSymbol /> },
  { title: 'Leads',             path: APP_ROUTES.ADMIN_LEADS,             icon: <InquiresSymbol /> },
  { title: 'Demo Inquiries',   path: APP_ROUTES.ADMIN_DEMO_INQUIRIES,    icon: <InquiresSymbol /> },
  { title: 'Deal Room',       path: APP_ROUTES.ADMIN_DEAL_ROOM,         icon: <DealRoomSymbol /> },
  // ── Placement-phase features — re-enable when placement engine launches ──
  { title: 'Inquiries',       path: APP_ROUTES.ADMIN_INQUIRIES,         icon: <InquiresSymbol /> },
  // ─────────────────────────────────────────────────────────────────────────
  { title: 'Caregiver Directory', path: APP_ROUTES.ADMIN_CAREGIVERS,        icon: <CaregiverSymbol /> },
  { title: 'Intelligence Hub',   path: APP_ROUTES.ADMIN_INTELLIGENCE_HUB, icon: <IntelligenceHubSymbol /> },
  { title: 'Newsletter',         path: APP_ROUTES.ADMIN_NEWSLETTER,        icon: <NewsletterSymbol /> },
  { title: 'CMS Content',        path: APP_ROUTES.ADMIN_CMS,               icon: <CMSContentSymbol /> },
  { title: 'Reports',            path: APP_ROUTES.ADMIN_REPORTS,           icon: <ReportSymbol /> },
  { title: 'Configuration',      path: APP_ROUTES.ADMIN_CONFIG,            icon: <ConfigurationSymbol /> },
];

const AdminSidebar = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === APP_ROUTES.ADMIN) return pathname === path;
    return pathname.startsWith(path);
  };

  return (
    <div className="w-[256px] h-full pt-[24px] px-4 pb-6 bg-white border-r border-solid border-[#E2E8F0] flex flex-col">
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide flex flex-col gap-1 pb-2">
        <p className="text-[10px] font-bold text-[#94A3B8] px-4 mb-2 tracking-widest">ADMIN PANEL</p>
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`w-full h-11 flex items-center py-2 px-4 gap-3 rounded-xl transition-all duration-150 ${
                active ? 'bg-[#0947871A] text-[#094689]' : 'text-[#475569] hover:bg-[#F1F5F9]'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span className={`text-sm font-medium ${active ? 'text-[#094689]' : 'text-[#475569]'}`}>
                {item.title}
              </span>
              {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#09488B]" />}
            </Link>
          );
        })}
      </div>

      <div className="shrink-0 mt-4 bg-[#09488B0D] border border-[#09488B33] rounded-xl p-4">
        <p className="font-bold text-xs text-[#09488B]">ADMIN CONTROL CENTER</p>
        <p className="font-normal text-xs text-[#475569] mt-1">Manage the RAL Connect platform.</p>
      </div>
    </div>
  );
};

export default AdminSidebar;
