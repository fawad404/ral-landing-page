"use client";
import {
  AvailabilityIcon,
  DashboardIcon,
  DealRoomIcon,
  FacilityProfileIcon,
  SocialBoostIcon,
  SupportNetworkIcon,
} from "@/assets";
import Link from "next/link";
import React, { useState } from "react";

const Sidebar = () => {
  const [selectedItem, setSelectedItem] = useState("Dashboard");

  const menuItems = [
    {
      title: "Dashboard",
      icon: <DashboardIcon />,
      iconActive: <DashboardIcon fill="#094689" />,
      path: "/dashboard",
    },
    {
      title: "Facility Profile",
      icon: <FacilityProfileIcon />,
      iconActive: <FacilityProfileIcon fill="#094689" />,
      path: "/dashboard/facility-profile",
    },
    {
      title: "Support Network",
      icon: <SupportNetworkIcon />,
      iconActive: <SupportNetworkIcon fill="#094689" />,
      path: "/dashboard/support-network",
    },
    {
      title: "Deal Room",
      icon: <DealRoomIcon />,
      iconActive: <DealRoomIcon fill="#094689" />,
      path: "/dashboard/deal-room",
    },
    // ── Placement-phase features — re-enable when placement engine launches ──
    // {
    //   title: "Availability",
    //   icon: <AvailabilityIcon />,
    //   iconActive: <AvailabilityIcon fill="#094689" />,
    //   path: "/dashboard/availability",
    // },
    // {
    //   title: "Social Boost",
    //   icon: <SocialBoostIcon />,
    //   iconActive: <SocialBoostIcon fill="#094689" />,
    //   path: "/dashboard/social-boost",
    // },
    // ─────────────────────────────────────────────────────────────────────────
    // ── Caregiver directory moved to public landing page — re-enable if bringing back to dashboard ──
    // {
    //   title: "Caregiver",
    //   icon: (
    //     <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#475569" strokeWidth={1.8}>
    //       <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    //     </svg>
    //   ),
    //   iconActive: (
    //     <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#094689" strokeWidth={1.8}>
    //       <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    //     </svg>
    //   ),
    //   path: "/dashboard/caregivers",
    // },
    // ─────────────────────────────────────────────────────────────────────────
    {
      title: "Compliance",
      icon: (
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#475569" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      iconActive: (
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#094689" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      path: "/dashboard/compliance",
    },
  ];

  return (
    <div className="w-[256px] h-full pt-[59px] px-6 pb-6 bg-white border-r border-solid border-[#E2E8F0] flex flex-col justify-between">
      <div className="w-full h-auto flex flex-col gap-1">
        {menuItems.map((item, index) => (
          <Link
            href={item.path}
            onClick={() => setSelectedItem(item.title)}
            key={index}
            className={`w-full h-12 flex items-center py-3 px-4 gap-3 ${selectedItem === item.title ? "bg-[#0947871A]" : "bg-white"} rounded-xl hover:bg-[#F1F5F9] cursor-pointer transition-all duration-200`}
          >
            {selectedItem === item.title ? (
              <>{item.iconActive}</>
            ) : (
              <>{item.icon}</>
            )}
            <span
              className={`text-base font-medium ${selectedItem === item.title ? "text-[#094689]" : "text-[#475569]"}`}
            >
              {item.title}
            </span>
          </Link>
        ))}
      </div>
      <div className="w-full h-auto bg-[#F8FAFC] border border-solid border-[#E2E8F0] rounded-xl p-4 flex flex-col gap-2">
        <p className="font-bold text-xs text-[#94A3B8]">HELP CENTER</p>
        <p className="font-normal text-sm text-[#475569]">
          Need assistance with your facility profile?
        </p>
        <Link
          href={"/"}
          className="w-full h-auto bg-white border border-solid border-[#E2E8F0] rounded-lg py-2 flex justify-center items-center text-xs font-bold text-[#09488B]"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
