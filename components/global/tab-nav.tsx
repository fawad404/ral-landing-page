"use client";
import React from "react";

interface Tab {
  label: string;
  value: string;
}

interface Props {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (value: string) => void;
}

const TabNav: React.FC<Props> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="w-full flex items-end gap-1 border-b border-solid border-[#E2E8F0]">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value;
        return (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={`px-4 pb-3 text-sm transition-colors duration-150 focus:outline-none border-b-2 -mb-px ${
              isActive
                ? "border-[#09488B] text-[#09488B] font-bold"
                : "border-transparent text-[#64748B] hover:text-[#0F172A] font-medium"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default TabNav;
