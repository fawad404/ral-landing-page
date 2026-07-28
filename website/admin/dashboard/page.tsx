'use client';
import React from 'react';
import Link from 'next/link';
import { useDashboardReport } from '@/hooks/useReports';
import { APP_ROUTES } from '@/api/endpoints';

const StatCard = ({ label, value, sub, color }: { label: string; value: number | string; sub?: string; color: string }) => (
  <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 flex flex-col gap-2">
    <p className="text-sm font-medium text-[#64748B]">{label}</p>
    <p className={`text-3xl font-black ${color}`}>{value}</p>
    {sub && <p className="text-xs text-[#94A3B8]">{sub}</p>}
  </div>
);

const STATUS_BADGE: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  placed: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-gray-500',
};

export default function AdminDashboardPage() {
  const { data, isLoading, isError, refetch } = useDashboardReport();

  if (isLoading) return (
    <div className="p-8 flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-[#09488B] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (isError) return (
    <div className="p-8 flex flex-col items-center justify-center h-64 gap-4">
      <p className="text-[#EF4444] font-semibold">Failed to load dashboard data.</p>
      <button onClick={() => refetch()} className="text-sm font-semibold text-[#09488B] hover:underline">Retry</button>
    </div>
  );

  const s = data?.summary;

  return (
    <div className="p-8 flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-black text-[#0F172A]">Admin Dashboard</h1>
        <p className="text-[#64748B] mt-1">Platform overview and recent activity.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Total Facilities" value={s?.totalFacilities ?? 0} sub={`${s?.activeFacilities ?? 0} active`} color="text-[#09488B]" />
        <StatCard label="Flagged Facilities" value={s?.flaggedFacilities ?? 0} sub="No availability update in 24h" color="text-red-500" />
        <StatCard label="Total Inquiries" value={s?.totalInquiries ?? 0} sub={`${data?.inquiriesByStatus?.new ?? 0} new`} color="text-[#0F172A]" />
        <StatCard label="Partners" value={s?.totalPartners ?? 0} sub={`${s?.visiblePartners ?? 0} visible`} color="text-[#10B981]" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Total Users" value={s?.totalUsers ?? 0} color="text-[#0F172A]" />
        <StatCard label="Pending Facilities" value={s?.pendingFacilities ?? 0} sub="Awaiting approval" color="text-yellow-500" />
        <StatCard label="Inactive Facilities" value={s?.inactiveFacilities ?? 0} color="text-[#94A3B8]" />
      </div>

      {/* Inquiry status + Recent */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
          <p className="font-bold text-sm text-[#0F172A] mb-3">Inquiries by Status</p>
          <div className="flex flex-col gap-2">
            {['new', 'contacted', 'placed', 'closed'].map((s) => (
              <div key={s} className="flex items-center justify-between">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_BADGE[s]}`}>{s}</span>
                <span className="text-sm font-bold text-[#0F172A]">{data?.inquiriesByStatus?.[s] ?? 0}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-2 bg-white border border-[#E2E8F0] rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="font-bold text-sm text-[#0F172A]">Recent Inquiries</p>
            <Link href={APP_ROUTES.ADMIN_INQUIRIES} className="text-xs font-semibold text-[#09488B] hover:underline">View all</Link>
          </div>
          <div className="flex flex-col gap-0">
            {(data?.recentInquiries ?? []).map((inq) => (
              <Link key={inq._id} href={APP_ROUTES.ADMIN_INQUIRY_DETAIL(inq._id)}
                className="flex items-center justify-between py-2.5 border-b border-[#F1F5F9] hover:bg-[#F8FAFC] rounded px-2 transition-colors">
                <div>
                  <p className="text-sm font-semibold text-[#0F172A]">{inq.familyData.name}</p>
                  <p className="text-xs text-[#64748B]">{inq.familyData.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_BADGE[inq.status] ?? ''}`}>{inq.status}</span>
                  <span className="text-xs text-[#94A3B8]">{new Date(inq.createdAt).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
            {(!data?.recentInquiries || data.recentInquiries.length === 0) && (
              <p className="text-sm text-[#94A3B8] text-center py-4">No inquiries yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
