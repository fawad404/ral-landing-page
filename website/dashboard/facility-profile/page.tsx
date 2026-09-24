"use client";
import Header from "@/components/global/header";
import TabNav from "@/components/global/tab-nav";
import React, { useState } from "react";
import Overview from "./overview";
import CareServices from "./care-services";
import Photos from "./photos";
import Policies from "./policies";
import Contact from "./contact";

type TabValue = "overview" | "care-services" | "photos" | "policies" | "contact";

const tabs = [
  { label: "Overview", value: "overview" },
  { label: "Care & Services (optional)", value: "care-services" },
  { label: "Photos (optional)", value: "photos" },
  { label: "Policies (optional)", value: "policies" },
  { label: "Contact (optional)", value: "contact" },
];

const FacilityProfileComponent = () => {
  const [activeTab, setActiveTab] = useState<TabValue>("overview");

  return (
    <div className="w-full h-full flex flex-col relative">
      <div className="px-10 pt-10 pb-8 flex flex-col gap-8">
        <Header
          title="My Facility Profile"
          description="Manage how your home is represented to prospective residents and staff."
        />
        <p className="max-w-3xl bg-[#F8FAFC] border border-solid border-[#E2E8F0] rounded-xl px-5 py-3 text-sm text-[#475569]">
          <strong className="text-[#0F172A]">Required for review:</strong>{" "}facility name, city and total beds on the Overview tab.
          Everything else is optional. Add services, photos, policies and contacts whenever you&apos;re ready.
        </p>
        <TabNav
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(val) => setActiveTab(val as TabValue)}
        />
      </div>

      {activeTab === "overview" && <Overview />}
      {activeTab === "care-services" && <CareServices />}
      {activeTab === "photos" && <Photos />}
      {activeTab === "policies" && <Policies />}
      {activeTab === "contact" && <Contact />}
    </div>
  );
};

export default FacilityProfileComponent;
