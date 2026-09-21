'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React from 'react';
import { APP_ROUTES } from '@/api/endpoints';
import { Logo } from '@/assets';
import { useIHSources } from '@/hooks/useIntelligenceHub';

const Icon = ({ d }: { d: string }) => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
  </svg>
);

const ICONS = {
  dashboard: 'M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9.5z',
  hub: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  newsletter: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  users: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  facility: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2M5 21H3m6-14h2m-2 4h2m2-4h2m-2 4h2m-4 10v-4h4v4',
  vendor: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
  leads: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z',
  deal: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  caregiver: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
  cms: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
  reports: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  config:
    'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z',
};

interface NavItem { title: string; path: string; icon: string }
interface NavSection { label?: string; items: NavItem[] }

// Same routes as before — only regrouped under section headings.
const sections: NavSection[] = [
  {
    items: [{ title: 'Dashboard', path: APP_ROUTES.ADMIN, icon: ICONS.dashboard }],
  },
  {
    label: 'Intelligence Operations',
    items: [
      { title: 'Intelligence Hub', path: APP_ROUTES.ADMIN_INTELLIGENCE_HUB, icon: ICONS.hub },
      { title: 'Newsletter', path: APP_ROUTES.ADMIN_NEWSLETTER, icon: ICONS.newsletter },
      { title: 'CMS Content', path: APP_ROUTES.ADMIN_CMS, icon: ICONS.cms },
      { title: 'Reports', path: APP_ROUTES.ADMIN_REPORTS, icon: ICONS.reports },
    ],
  },
  {
    label: 'Platform Management',
    items: [
      { title: 'Users', path: APP_ROUTES.ADMIN_USERS, icon: ICONS.users },
      { title: 'Facilities', path: APP_ROUTES.ADMIN_FACILITIES, icon: ICONS.facility },
      { title: 'Vendors', path: APP_ROUTES.ADMIN_VENDORS, icon: ICONS.vendor },
      { title: 'Leads', path: APP_ROUTES.ADMIN_LEADS, icon: ICONS.leads },
      { title: 'Demo Inquiries', path: APP_ROUTES.ADMIN_DEMO_INQUIRIES, icon: ICONS.leads },
      { title: 'Deal Room', path: APP_ROUTES.ADMIN_DEAL_ROOM, icon: ICONS.deal },
      // Placement-phase feature — re-enable when placement engine launches
      { title: 'Inquiries', path: APP_ROUTES.ADMIN_INQUIRIES, icon: ICONS.leads },
      { title: 'Caregiver Directory', path: APP_ROUTES.ADMIN_CAREGIVERS, icon: ICONS.caregiver },
    ],
  },
  {
    label: 'Configuration',
    items: [{ title: 'Configuration', path: APP_ROUTES.ADMIN_CONFIG, icon: ICONS.config }],
  },
];

const SystemStatus = () => {
  const { data: sources } = useIHSources();
  const total = sources?.length ?? 0;
  const active = sources?.filter((s) => s.isActive).length ?? 0;
  const failing = sources?.filter((s) => s.healthStatus === 'failing').length ?? 0;
  const healthy = failing === 0;

  return (
    <div className="shrink-0 mt-4 rounded-xl p-4 bg-white/5 border border-white/10">
      <p className="text-[10px] font-bold tracking-widest text-white/60">SYSTEM STATUS</p>
      <div className="flex items-center gap-2 mt-2">
        <span className={`w-2 h-2 rounded-full ${healthy ? 'bg-emerald-400' : 'bg-amber-400'}`} />
        <p className={`text-xs font-semibold ${healthy ? 'text-emerald-400' : 'text-amber-400'}`}>
          {healthy ? 'All Systems Operational' : `${failing} source${failing !== 1 ? 's' : ''} failing`}
        </p>
      </div>
      <div className="flex items-center justify-between mt-3 text-xs">
        <span className="text-white/70">Sources Active</span>
        <span className="font-semibold text-white">{active}<span className="text-white/50">/{total}</span></span>
      </div>
      <Link
        href={APP_ROUTES.ADMIN_INTELLIGENCE_HUB_SOURCES}
        className="mt-3 block w-full text-center text-xs font-semibold text-white bg-[#1D4E9E] hover:bg-[#2559b3] transition-colors rounded-lg py-2.5"
      >
        View System Health
      </Link>
    </div>
  );
};

const AdminSidebar = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === APP_ROUTES.ADMIN) return pathname === path;
    return pathname.startsWith(path);
  };

  return (
    <aside className="w-[256px] h-full shrink-0 px-4 pt-6 pb-5 bg-[#0A1F44] flex flex-col">
      <Link href={APP_ROUTES.ADMIN} className="px-2 mb-6 flex flex-col">
        <Image
          src={Logo}
          alt="RAL Connect"
          width={120}
          height={60}
          className="h-11 w-auto object-contain self-start brightness-0 invert"
          priority
        />
        <span className="text-[11px] text-white/60 mt-1">Intelligence Operations Center</span>
      </Link>

      <nav className="flex-1 min-h-0 overflow-y-auto scrollbar-hide flex flex-col gap-1 pb-2">
        {sections.map((section, i) => (
          <div key={section.label ?? i} className={section.label ? 'mt-4' : ''}>
            {section.label && (
              <p className="text-[10px] font-bold tracking-widest text-white/45 px-3 mb-2 uppercase">
                {section.label}
              </p>
            )}
            <div className="flex flex-col gap-1">
              {section.items.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`w-full h-11 flex items-center px-3 gap-3 rounded-xl text-sm font-medium transition-colors duration-150 ${
                      active
                        ? 'bg-[#1D4E9E] text-white shadow-sm'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon d={item.icon} />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <SystemStatus />
    </aside>
  );
};

export default AdminSidebar;
