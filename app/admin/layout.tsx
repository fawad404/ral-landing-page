import AdminSidebar from '@/components/sidebar/AdminSidebar';
import AdminHeader from '@/components/topbar/AdminHeader';
import React from 'react';

const AdminLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full h-screen flex overflow-hidden">
    <AdminSidebar />
    <div className="flex-1 min-w-0 h-full flex flex-col">
      <AdminHeader />
      <div className="flex-1 overflow-y-auto bg-[#F4F7FB]">{children}</div>
    </div>
  </div>
);

export default AdminLayout;
