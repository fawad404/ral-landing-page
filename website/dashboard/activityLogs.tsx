'use client';
import React from "react";
import Link from "next/link";
import { useMyFacilities } from "@/hooks/useFacilities";
import { useComplianceTasks, useStaffCredentials, useComplianceIncidents, useComplianceStats } from "@/hooks/useCompliance";
import { APP_ROUTES } from "@/api/endpoints";

function fmtDate(d?: string) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function daysUntil(d?: string) {
  if (!d) return null;
  return Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
}

const ActivityLogs = () => {
  const { data: facilities, isLoading: facLoading } = useMyFacilities();
  const facility = facilities?.[0];
  const facilityId = facility?._id ?? '';

  const tasksQ = useComplianceTasks(facilityId, { status: 'overdue', limit: 3 });
  const credsQ = useStaffCredentials(facilityId, { status: 'expired', limit: 3 });
  const expiringSoonQ = useStaffCredentials(facilityId, { status: 'expiring_soon', limit: 3 });
  const incidentsQ = useComplianceIncidents(facilityId, { status: 'open', limit: 3 });

  const statsQ = useComplianceStats(facilityId);
  const st = statsQ.data;
  const nothingTracked = !!st && st.tasks.total + st.credentials.total + st.incidents.total === 0;

  const isLoading = facLoading || tasksQ.isLoading || credsQ.isLoading;

  type AlertItem = {
    type: 'overdue' | 'expired' | 'expiring' | 'incident';
    label: string;
    sub: string;
    color: string;
    bg: string;
    dot: string;
  };

  const alerts: AlertItem[] = [];

  (tasksQ.data?.items ?? []).forEach((t) => {
    alerts.push({
      type: 'overdue',
      label: `Overdue task: ${t.title}`,
      sub: t.dueDate ? `Was due ${fmtDate(t.dueDate)}` : 'No due date set',
      color: '#EF4444',
      bg: '#FEF2F2',
      dot: '#EF4444',
    });
  });

  (credsQ.data?.items ?? []).forEach((c) => {
    alerts.push({
      type: 'expired',
      label: `Expired credential — ${c.staffName}`,
      sub: `${c.credentialType.replace(/_/g, ' ')} expired ${fmtDate(c.expirationDate)}`,
      color: '#EF4444',
      bg: '#FEF2F2',
      dot: '#EF4444',
    });
  });

  (expiringSoonQ.data?.items ?? []).forEach((c) => {
    const days = daysUntil(c.expirationDate);
    alerts.push({
      type: 'expiring',
      label: `Credential expiring — ${c.staffName}`,
      sub: `${c.credentialType.replace(/_/g, ' ')} expires in ${days}d (${fmtDate(c.expirationDate)})`,
      color: '#F59E0B',
      bg: '#FFFBEB',
      dot: '#F59E0B',
    });
  });

  (incidentsQ.data?.items ?? []).forEach((inc) => {
    alerts.push({
      type: 'incident',
      label: `Open incident: ${inc.title}`,
      sub: `${inc.severity} severity · ${fmtDate(inc.incidentDate)}`,
      color: '#F97316',
      bg: '#FFF7ED',
      dot: '#F97316',
    });
  });

  return (
    <div className="w-full h-auto rounded-2xl border border-solid border-[#E2E8F0] shadow-[0px_1px_2px_0px_#0000000D] flex flex-col">
      <div className="w-full h-auto py-4 px-6 bg-white rounded-t-2xl border-b border-solid border-[#E2E8F0] flex justify-between items-center">
        <p className="text-lg font-bold text-[#0F172A]">Compliance Alerts</p>
        <Link
          href={APP_ROUTES.DASHBOARD_COMPLIANCE}
          className="text-xs font-semibold text-[#09488B] hover:underline"
        >
          View All →
        </Link>
      </div>

      <div className="w-full h-auto bg-white flex flex-col">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="w-6 h-6 border-4 border-[#09488B] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !facilityId ? (
          <div className="py-8 flex justify-center">
            <p className="text-sm text-[#94A3B8]">Set up your facility to see alerts.</p>
          </div>
        ) : alerts.length === 0 && nothingTracked ? (
          <div className="py-8 flex flex-col items-center gap-2 text-center px-6">
            <p className="text-sm font-semibold text-[#475569]">Nothing tracked yet</p>
            <p className="text-xs text-[#94A3B8] max-w-md">
              This panel only reflects tasks, staff credentials and incidents you add in the Compliance Center. It isn&apos;t a compliance assessment.
            </p>
          </div>
        ) : alerts.length === 0 ? (
          <div className="py-8 flex flex-col items-center gap-2">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#10B981" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-semibold text-[#10B981]">No alerts in your tracked records.</p>
            <p className="text-xs text-[#94A3B8]">No overdue tasks, expired credentials, or open incidents among the records you&apos;ve entered.</p>
          </div>
        ) : (
          alerts.map((a, i) => (
            <div key={i} className="w-full py-3 px-6 flex items-start gap-4 border-b border-[#F1F5F9] last:border-0">
              <div className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: a.dot }} />
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-medium text-[#0F172A]">{a.label}</p>
                <p className="text-xs text-[#64748B]">{a.sub}</p>
              </div>
              <span
                className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5"
                style={{ color: a.color, backgroundColor: a.bg }}
              >
                {a.type === 'overdue' ? 'OVERDUE' : a.type === 'expired' ? 'EXPIRED' : a.type === 'expiring' ? 'EXPIRING' : 'OPEN'}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="w-full h-auto bg-[#F8FAFC] flex justify-center items-center p-[16px] rounded-b-2xl">
        <p className="font-normal text-xs text-[#94A3B8] text-center">
          Showing overdue tasks · expired/expiring credentials · open incidents
        </p>
      </div>
    </div>
  );
};

export default ActivityLogs;
