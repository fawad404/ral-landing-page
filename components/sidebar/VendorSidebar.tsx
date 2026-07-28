'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { APP_ROUTES } from '@/api/endpoints';
import { DashboardSymbol, VendorsSymbol } from '@/assets';

const navItems = [
  { title: 'Overview',   path: APP_ROUTES.VENDOR,         icon: <DashboardSymbol /> },
  { title: 'My Profile', path: APP_ROUTES.VENDOR_PROFILE, icon: <VendorsSymbol /> },
];

const VendorSidebar = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === APP_ROUTES.VENDOR) return pathname === path;
    return pathname.startsWith(path);
  };

  return (
    <div className="w-[256px] h-full pt-[24px] px-4 pb-6 bg-white border-r border-solid border-[#E2E8F0] flex flex-col justify-between">
      <div className="w-full h-auto flex flex-col gap-1">
        <p className="text-[10px] font-bold text-[#94A3B8] px-4 mb-2 tracking-widest">VENDOR PORTAL</p>
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

      <div className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 flex flex-col gap-2">
        <p className="font-bold text-xs text-[#94A3B8]">HELP CENTER</p>
        <p className="font-normal text-sm text-[#475569]">Need help managing your vendor profile?</p>
        <Link href="/" className="w-full bg-white border border-[#E2E8F0] rounded-lg py-2 flex justify-center text-xs font-bold text-[#09488B]">
          Contact Support
        </Link>
      </div>
    </div>
  );
};

export default VendorSidebar;
