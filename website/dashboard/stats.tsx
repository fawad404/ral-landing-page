'use client';
import { Stat2Icon, Stat4Icon } from "@/assets";
import React, { useState } from "react";
import { useMyFacilities, useCreateFacility } from "@/hooks/useFacilities";
import { useComplianceStats } from "@/hooks/useCompliance";

const SetupFacilityCard = () => {
  const [name, setName] = useState('');
  const createFacility = useCreateFacility();

  return (
    <div className="w-full bg-white border border-[#E2E8F0] rounded-2xl px-8 py-8 flex flex-col items-center gap-5 shadow-sm">
      <div className="size-14 bg-[#09488B1A] rounded-2xl flex items-center justify-center">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M12 7V3H2V21H22V7H12ZM6 19H4V17H6V19ZM6 15H4V13H6V15ZM6 11H4V9H6V11ZM6 7H4V5H6V7ZM10 19H8V17H10V19ZM10 15H8V13H10V15ZM10 11H8V9H10V11ZM10 7H8V5H10V7ZM20 19H12V17H14V15H12V13H14V11H12V9H20V19ZM18 11H16V13H18V11ZM18 15H16V17H18V15Z" fill="#09488B" />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-lg font-bold text-[#0F172A]">Set up your facility</p>
        <p className="text-sm text-[#64748B] mt-1">Enter your facility name to get started. You can update all details from your profile.</p>
      </div>
      <div className="flex gap-3 w-full max-w-sm">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Sunrise Assisted Living"
          className="flex-1 border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#09488B] transition-colors"
        />
        <button
          onClick={() => { if (name.trim()) createFacility.mutate({ name: name.trim() }); }}
          disabled={!name.trim() || createFacility.isPending}
          className="px-5 py-2.5 bg-[#09488B] text-white text-sm font-bold rounded-xl hover:bg-[#083d77] transition-colors disabled:opacity-50"
        >
          {createFacility.isPending ? 'Creating...' : 'Create'}
        </button>
      </div>
    </div>
  );
};

const Stats = () => {
  const { data: facilities, isLoading, isError } = useMyFacilities();
  const facility = facilities?.[0];
  const complianceStats = useComplianceStats(facility?._id ?? '');
  const cs = complianceStats.data;

  if (isLoading) return (
    <div className="w-full h-auto grid grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="w-full h-[110px] rounded-2xl bg-white border border-solid border-[#E2E8F0] animate-pulse" />
      ))}
    </div>
  );

  if (isError) {
    return (
      <div className="w-full bg-red-50 border border-red-200 rounded-xl px-5 py-4">
        <p className="text-sm font-semibold text-red-700">Failed to load facility stats. Please refresh the page.</p>
      </div>
    );
  }

  if (!facility) {
    return <SetupFacilityCard />;
  }

  const profileStatusLabel =
    facility.status === 'approved' ? 'Approved'
    : facility.status === 'pending' ? 'Pending Review'
    : 'Rejected';

  const profileStatusCss =
    facility.status === 'approved' ? 'bg-[#10B9811A] text-[#10B981]'
    : facility.status === 'pending' ? 'bg-[#F59E0B1A] text-[#F59E0B]'
    : 'bg-[#EF44441A] text-[#EF4444]';

  const alertLabel = facility.isFlagged ? 'Flagged' : 'All Clear';
  const alertCss = facility.isFlagged ? 'bg-[#EF44441A] text-[#EF4444]' : 'bg-[#10B9811A] text-[#10B981]';

  const openTasks = cs?.tasks.open ?? 0;
  const overdueTasks = cs?.tasks.overdue ?? 0;
  const credAlerts = (cs?.credentials.expired ?? 0) + (cs?.credentials.expiringSoon ?? 0);
  const openIncidents = cs?.incidents.open ?? 0;

  const Details = [
    {
      title: "Open Tasks",
      value: complianceStats.isLoading ? '—' : String(openTasks),
      text: overdueTasks > 0 ? `${overdueTasks} overdue` : 'On track',
      textcss: overdueTasks > 0 ? 'bg-[#EF44441A] text-[#EF4444]' : 'bg-[#10B9811A] text-[#10B981]',
      icon: (
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#09488B" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
    {
      title: "Credential Alerts",
      value: complianceStats.isLoading ? '—' : String(credAlerts),
      text: cs?.credentials.expired ? `${cs.credentials.expired} expired` : cs?.credentials.expiringSoon ? `${cs.credentials.expiringSoon} expiring` : 'All valid',
      textcss: (cs?.credentials.expired ?? 0) > 0 ? 'bg-[#EF44441A] text-[#EF4444]' : (cs?.credentials.expiringSoon ?? 0) > 0 ? 'bg-[#F59E0B1A] text-[#F59E0B]' : 'bg-[#10B9811A] text-[#10B981]',
      icon: (
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#09488B" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      title: "Profile Status",
      value: profileStatusLabel,
      text: facility.isVisible ? "Visible" : "Hidden",
      textcss: profileStatusCss,
      icon: <Stat2Icon />,
    },
    {
      title: "Open Incidents",
      value: complianceStats.isLoading ? '—' : String(openIncidents),
      text: (cs?.incidents.critical ?? 0) > 0 ? `${cs!.incidents.critical} critical` : openIncidents === 0 ? 'None active' : undefined,
      textcss: (cs?.incidents.critical ?? 0) > 0 ? 'bg-[#EF44441A] text-[#EF4444]' : 'bg-[#10B9811A] text-[#10B981]',
      icon: <Stat4Icon />,
    },
  ];

  return (
    <div className="w-full h-auto grid grid-cols-4 gap-4">
      {Details.map((v, i) => (
        <div
          key={i}
          className="w-full h-auto p-[25px] rounded-2xl bg-white border border-solid border-[#E2E8F0] shadow-[0px_1px_2px_0px_#0000000D]"
        >
          <div className="w-full h-auto pb-5 flex justify-between items-center gap-3">
            <div className="size-9 bg-[#09488B1A] rounded-lg p-2 flex justify-center items-center">
              {v.icon}
            </div>
            {v.text && (
              <p className={`${v.textcss} py-1 px-2 font-bold text-[10px] rounded-full flex justify-center items-center`}>
                {v.text}
              </p>
            )}
          </div>
          <p className="font-medium text-sm text-[#64748B] pb-1">{v.title}</p>
          <p className="font-bold font-space text-[30px] text-[#0F172A]">{v.value}</p>
        </div>
      ))}
    </div>
  );
};

export default Stats;
