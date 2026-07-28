'use client';
import React from 'react';
import { useDashboardReport, useFacilityReport, useInquiryReport, usePartnerReport } from '@/hooks/useReports';

function StatCard({ label, value, sub, color = 'text-[#0F172A]' }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
      <p className="text-sm font-medium text-[#64748B]">{label}</p>
      <p className={`text-3xl font-black mt-1 ${color}`}>{value}</p>
      {sub && <p className="text-xs text-[#94A3B8] mt-1">{sub}</p>}
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <p className="text-lg font-bold text-[#0F172A] border-b border-[#E2E8F0] pb-2">{title}</p>;
}

const STATUS_COLOR: Record<string, string> = {
  approved: 'bg-green-500', pending: 'bg-yellow-400', rejected: 'bg-red-400',
  new: 'bg-blue-500', contacted: 'bg-yellow-400', placed: 'bg-green-500', closed: 'bg-gray-400',
};

function SectionError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 flex items-center justify-between">
      <p className="text-sm font-semibold text-red-700">{message}</p>
      <button onClick={onRetry} className="text-xs font-semibold text-[#09488B] hover:underline ml-4">Retry</button>
    </div>
  );
}

export default function AdminReportsPage() {
  const dashboard = useDashboardReport();
  const facility = useFacilityReport();
  const inquiry = useInquiryReport();
  const partner = usePartnerReport();

  const isLoading = dashboard.isLoading || facility.isLoading || inquiry.isLoading || partner.isLoading;

  if (isLoading) return (
    <div className="p-8 flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-[#09488B] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const s = dashboard.data?.summary;
  const ir = inquiry.data;
  const fr = facility.data;
  const pr = partner.data;

  return (
    <div className="p-8 flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-black text-[#0F172A]">Reports & Analytics</h1>
        <p className="text-[#64748B] mt-1">Platform-wide aggregated statistics.</p>
      </div>

      {/* Platform Overview */}
      <div className="flex flex-col gap-3">
        <SectionTitle title="Platform Overview" />
        {dashboard.isError ? (
          <SectionError message="Failed to load platform overview." onRetry={() => dashboard.refetch()} />
        ) : (
          <div className="grid grid-cols-4 gap-4">
            <StatCard label="Total Facilities" value={s?.totalFacilities ?? 0} sub={`${s?.activeFacilities ?? 0} active, ${s?.pendingFacilities ?? 0} pending`} color="text-[#09488B]" />
            <StatCard label="Flagged Facilities" value={s?.flaggedFacilities ?? 0} sub="No update in 24h" color="text-red-500" />
            <StatCard label="Total Users" value={s?.totalUsers ?? 0} color="text-[#0F172A]" />
            <StatCard label="Total Partners" value={s?.totalPartners ?? 0} sub={`${s?.visiblePartners ?? 0} visible`} color="text-[#10B981]" />
          </div>
        )}
      </div>

      {/* Inquiry Stats */}
      <div className="flex flex-col gap-3">
        <SectionTitle title="Inquiries" />
        {inquiry.isError && <SectionError message="Failed to load inquiry stats." onRetry={() => inquiry.refetch()} />}
        <div className="grid grid-cols-4 gap-4">
          <StatCard label="Total Inquiries" value={ir?.total ?? 0} color="text-[#0F172A]" />
          <StatCard label="Last 30 Days" value={ir?.recent30Days ?? 0} color="text-[#09488B]" />
          <StatCard label="Placement Rate" value={ir?.placementRate ?? '0%'} color="text-[#10B981]" />
          <StatCard label="Avg Matched Facilities" value={ir?.avgMatchedFacilities ?? 0} color="text-[#0F172A]" />
        </div>
        {ir?.byStatus && ir.byStatus.length > 0 && (
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
            <p className="text-sm font-bold text-[#0F172A] mb-3">Inquiries by Status</p>
            <div className="flex flex-col gap-2">
              {ir.byStatus.map(item => {
                const pct = ir.total > 0 ? Math.round((item.count / ir.total) * 100) : 0;
                return (
                  <div key={item._id} className="flex items-center gap-3">
                    <span className="text-sm text-[#475569] capitalize w-20">{item._id}</span>
                    <div className="flex-1 h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                      <div className={`h-2 rounded-full ${STATUS_COLOR[item._id] ?? 'bg-gray-400'}`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-sm font-bold text-[#0F172A] w-8 text-right">{item.count}</span>
                    <span className="text-xs text-[#94A3B8] w-8">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Facility Stats */}
      <div className="flex flex-col gap-3">
        <SectionTitle title="Facilities" />
        {facility.isError && <SectionError message="Failed to load facility stats." onRetry={() => facility.refetch()} />}
        <div className="grid grid-cols-2 gap-4">
          {fr?.byStatus && (
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
              <p className="text-sm font-bold text-[#0F172A] mb-3">By Status</p>
              <div className="flex flex-col gap-2">
                {fr.byStatus.map(item => (
                  <div key={item._id} className="flex items-center justify-between">
                    <span className="text-sm text-[#475569] capitalize">{item._id}</span>
                    <span className="text-sm font-bold text-[#0F172A]">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {fr?.byService && fr.byService.length > 0 && (
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
              <p className="text-sm font-bold text-[#0F172A] mb-3">Top Services Offered</p>
              <div className="flex flex-col gap-2">
                {fr.byService.slice(0, 8).map(item => (
                  <div key={item._id} className="flex items-center justify-between">
                    <span className="text-sm text-[#475569]">{item._id}</span>
                    <span className="text-xs font-bold text-[#09488B] bg-[#09488B0D] px-2 py-0.5 rounded-full">{item.count} facilities</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {fr?.avgAvailability && (
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
            <div className="grid grid-cols-3 divide-x divide-[#E2E8F0]">
              <div className="px-4 first:pl-0">
                <p className="text-xs text-[#64748B]">Avg Availability</p>
                <p className="text-2xl font-black text-[#09488B] mt-1">{fr.avgAvailability.avgAvailability?.toFixed(1) ?? 0}</p>
              </div>
              <div className="px-4">
                <p className="text-xs text-[#64748B]">Total Capacity</p>
                <p className="text-2xl font-black text-[#0F172A] mt-1">{fr.avgAvailability.totalCapacity}</p>
              </div>
              <div className="px-4">
                <p className="text-xs text-[#64748B]">Total Available</p>
                <p className="text-2xl font-black text-[#10B981] mt-1">{fr.avgAvailability.totalAvailable}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Partner Stats */}
      <div className="flex flex-col gap-3">
        <SectionTitle title="Partners" />
        {partner.isError && <SectionError message="Failed to load partner stats." onRetry={() => partner.refetch()} />}
        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Total Partners" value={pr?.total ?? 0} color="text-[#0F172A]" />
          <StatCard label="Visible" value={pr?.visible ?? 0} color="text-[#10B981]" />
          <StatCard label="Hidden" value={pr?.hidden ?? 0} color="text-[#94A3B8]" />
        </div>
        {pr?.byCategory && pr.byCategory.length > 0 && (
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
            <p className="text-sm font-bold text-[#0F172A] mb-3">By Category</p>
            <div className="flex flex-col gap-2">
              {pr.byCategory.map(cat => (
                <div key={cat._id} className="flex items-center justify-between">
                  <span className="text-sm text-[#475569] capitalize">{cat._id}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#10B981]">{cat.visible} visible</span>
                    <span className="text-sm font-bold text-[#0F172A]">{cat.count} total</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
