import AdminSidebar from '@/components/sidebar/AdminSidebar';
import Topbar from '@/components/topbar/page';
import React from 'react';

const AdminLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full h-screen flex flex-col overflow-hidden">
    <div className="w-full h-auto"><Topbar /></div>
    <div className="w-full grow flex overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 h-full overflow-y-auto bg-[#F8FAFC]">{children}</div>
    </div>
  </div>
);

export default AdminLayout;
