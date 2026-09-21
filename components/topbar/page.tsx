'use client';
import { BlueChevron, ChevronIcon, Logo, NotificationIcon } from '@/assets';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React, { useRef, useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useLogout } from '@/hooks/useAuth';
import { useNotifications, useMarkAllRead } from '@/hooks/useNotifications';
import { useUnreadCount } from '@/hooks/useNotifications';

function getPortalTitle(pathname: string): string {
  if (pathname.startsWith('/admin')) return 'Admin Portal';
  if (pathname.startsWith('/vendor')) return 'Vendor Portal';
  return 'Facility Portal';
}

export const NotificationDropdown = ({ onClose }: { onClose: () => void }) => {
  const { data: notifications = [] } = useNotifications();
  const markAll = useMarkAllRead();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const typeLabel: Record<string, string> = {
    new_inquiry: 'New Inquiry',
    facility_inactive: 'Inactivity Alert',
    user_signup: 'New Signup',
    general: 'Notice',
  };

  return (
    <div ref={ref} className="absolute right-0 top-12 w-80 bg-white border border-[#E2E8F0] rounded-xl shadow-lg z-50">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#E2E8F0]">
        <p className="font-bold text-sm text-[#0F172A]">Notifications</p>
        <button onClick={() => markAll.mutate()} className="text-xs text-[#09488B] font-medium hover:underline">
          Mark all read
        </button>
      </div>
      <div className="max-h-72 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="text-sm text-[#64748B] text-center py-6">No notifications</p>
        ) : (
          notifications.slice(0, 10).map((n) => (
            <div key={n._id} className={`px-4 py-3 border-b border-[#F1F5F9] ${!n.isRead ? 'bg-[#09488B0D]' : ''}`}>
              <div className="flex items-start gap-2">
                {!n.isRead && <div className="w-2 h-2 rounded-full bg-[#09488B] mt-1 shrink-0" />}
                <div className={!n.isRead ? '' : 'ml-4'}>
                  <p className="text-xs font-semibold text-[#0F172A]">{n.title}</p>
                  <p className="text-xs text-[#475569] mt-0.5 line-clamp-2">{n.message}</p>
                  <p className="text-[10px] text-[#94A3B8] mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const Topbar = () => {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuthStore();
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

  const portalTitle = getPortalTitle(pathname ?? '');
  const displayName = user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.email : 'User';
  const roleLabel = user?.role === 'admin' ? 'Administrator' : user?.role === 'vendor' ? 'Vendor Partner' : 'Facility Manager';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="w-full h-auto border-b border-solid border-[#E2E8F0] py-3 px-6 bg-white flex justify-between items-center">
      {/* Left: Logo + portal label */}
      <div className="w-full h-auto flex justify-start items-center gap-5">
        <Image width={68.3} height={38.34} alt="Logo" src={Logo} className="w-auto h-10 object-contain" />
        <div className="w-fit h-auto flex justify-start items-center gap-[5px]">
          <ChevronIcon />
          <p className="font-medium text-[16.77px] text-[#64748B] font-space">{portalTitle}</p>
        </div>
      </div>

      {/* Center: user full name */}
      <div className="w-full h-auto flex justify-center items-center">
        <p className="text-[20px] text-black font-normal font-space uppercase">{displayName}</p>
      </div>

      {/* Right: bell + user menu */}
      <div className="w-full h-auto flex justify-end items-center gap-6">
        {/* Notification bell */}
        <div className="relative">
          <button onClick={() => setShowNotifs((p) => !p)} className="relative">
            <NotificationIcon />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          {showNotifs && <NotificationDropdown onClose={() => setShowNotifs(false)} />}
        </div>

        <span className="px-1 w-0 h-8 border-l border-solid border-[#E2E8F0]" />

        {/* User menu */}
        <div ref={userMenuRef} className="relative">
          <button onClick={() => setShowUserMenu((p) => !p)}
            className="w-fit h-auto flex justify-end items-center gap-3 pl-2">
            <div className="w-auto h-auto flex flex-col items-end">
              <p className="font-bold text-xs text-[#0F172A]">{displayName}</p>
              <p className="font-normal text-[10px] text-[#64748B]">{roleLabel}</p>
            </div>
            <div className="w-[70px] h-10 rounded-full bg-[#F6F6F6] flex justify-between items-center">
              <div className="size-10 rounded-full bg-blue-500 text-white font-medium text-lg flex justify-center items-center">
                {initial}
              </div>
              <div className="flex-1 h-full flex justify-center items-center rounded-full">
                <BlueChevron />
              </div>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-12 w-44 bg-white border border-[#E2E8F0] rounded-xl shadow-lg z-50">
              <button onClick={logout}
                className="w-full text-left px-4 py-3 text-sm text-red-500 font-medium hover:bg-[#FFF1F1] rounded-xl transition-colors">
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
