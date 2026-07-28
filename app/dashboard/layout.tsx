import Sidebar from "@/components/sidebar/page";
import Topbar from "@/components/topbar/page";
import React from "react";

const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {

  return (
      <div className="w-full h-screen flex flex-col overflow-hidden">
        <div className="w-full h-auto">
          <Topbar />
        </div>
        <div className="w-full grow flex overflow-hidden">
        <Sidebar />
        <div className="flex-1 h-full overflow-y-auto">
        {children}
        </div>
        </div>
        </div>
  );
};

export default DashboardLayout;
