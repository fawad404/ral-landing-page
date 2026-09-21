'use client';
import React, { useMemo } from 'react';
import Link from 'next/link';
import { useDashboardReport } from '@/hooks/useReports';
import { useIHItems, useIHSources, useIHStats } from '@/hooks/useIntelligenceHub';
import { APP_ROUTES } from '@/api/endpoints';
import type { ContentItem, UrgencyLevel } from '@/types/intelligence-hub.types';

// ─── Small building blocks ────────────────────────────────────────────────────

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white border border-[#E2E8F0] rounded-xl shadow-[0_1px_2px_rgba(15,23,42,0.04)] ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ title, href, action = 'View All' }: { title: string; href?: string; action?: string }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-base font-bold text-[#0F172A]">{title}</h2>
    {href && (
      <Link href={href} className="text-xs font-medium text-[#334155] border border-[#E2E8F0] rounded-md px-3 py-1.5 hover:bg-[#F8FAFC] transition-colors">
        {action}
      </Link>
    )}
  </div>
);

const KpiIcon = ({ path, tone }: { path: string; tone: string }) => (
  <div className={`size-11 rounded-xl flex items-center justify-center shrink-0 ${tone}`}>
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  </div>
);

const KpiCard = ({ label, value, sub, subTone = 'text-[#64748B]', icon, tone, href }: {
  label: string; value: number | string; sub: string; subTone?: string; icon: string; tone: string; href?: string;
}) => {
  const body = (
    <Card className="p-5 h-full hover:border-[#CBD5E1] transition-colors">
      <div className="flex items-center gap-3">
        <KpiIcon path={icon} tone={tone} />
        <p className="text-sm font-medium text-[#334155] leading-tight">{label}</p>
      </div>
      <p className="text-[32px] font-bold text-[#0F172A] mt-3 leading-none">{value}</p>
      <p className={`text-xs mt-2 ${subTone}`}>{sub}</p>
    </Card>
  );
  return href ? <Link href={href}>{body}</Link> : body;
};

const Pill = ({ children, tone }: { children: React.ReactNode; tone: string }) => (
  <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-md capitalize whitespace-nowrap ${tone}`}>{children}</span>
);

const PRIORITY_TONE: Record<string, string> = {
  critical: 'bg-red-50 text-red-600',
  high: 'bg-red-50 text-red-600',
  normal: 'bg-amber-50 text-amber-600',
};

const URGENCY_TONE: Record<UrgencyLevel, string> = {
  immediate: 'bg-red-50 text-red-600',
  this_week: 'bg-orange-50 text-orange-600',
  monitor: 'bg-amber-50 text-amber-600',
  no_action: 'bg-slate-100 text-slate-500',
};

const URGENCY_LABEL: Record<UrgencyLevel, string> = {
  immediate: 'Immediate',
  this_week: 'This week',
  monitor: 'Monitor',
  no_action: 'No action',
};

const STATUS_BADGE: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  placed: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-gray-500',
};

const ITEM_STATUS_TONE: Record<string, string> = {
  pending_review: 'bg-amber-50 text-amber-600',
  new: 'bg-blue-50 text-blue-600',
  processing: 'bg-violet-50 text-violet-600',
  approved: 'bg-emerald-50 text-emerald-600',
  scheduled: 'bg-cyan-50 text-cyan-700',
  published: 'bg-emerald-50 text-emerald-600',
};

const CATEGORY_COLORS = ['#2563EB', '#10B981', '#8B5CF6', '#F59E0B', '#0EA5E9', '#64748B'];

const timeAgo = (iso?: string) => {
  if (!iso) return '';
  const mins = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs !== 1 ? 's' : ''} ago`;
  return `${Math.round(hrs / 24)} d ago`;
};

const itemTitle = (i: ContentItem) => i.aiHeadline || i.originalTitle;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const report = useDashboardReport();
  const { data: stats } = useIHStats();
  const { data: sources = [] } = useIHSources();
  const queue = useIHItems({ status: 'pending_review', limit: 7 });
  const critical = useIHItems({ priority: 'critical', limit: 3 });
  const recent = useIHItems({ limit: 100 });

  const s = report.data?.summary;

  const sourceCounts = useMemo(() => {
    const total = sources.length;
    const paused = sources.filter((x) => !x.isActive).length;
    const live = sources.filter((x) => x.isActive);
    return {
      total,
      active: live.length,
      healthy: live.filter((x) => x.healthStatus === 'healthy').length,
      warning: live.filter((x) => x.healthStatus === 'warning').length,
      failing: live.filter((x) => x.healthStatus === 'failing').length,
      paused,
    };
  }, [sources]);

  const topCategories = useMemo(() => {
    const counts = new Map<string, number>();
    (recent.data?.items ?? []).forEach((i) => {
      if (i.category) counts.set(i.category, (counts.get(i.category) ?? 0) + 1);
    });
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [recent.data]);

  const criticalTotal = critical.data?.total ?? 0;
  const maxCat = topCategories[0]?.[1] ?? 1;

  return (
    <div className="p-8 flex flex-col gap-6">
      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-4">
        <KpiCard
          label="Sources Active"
          value={sourceCounts.active}
          sub={sourceCounts.failing > 0 ? `${sourceCounts.failing} failing` : `of ${sourceCounts.total} sources`}
          subTone={sourceCounts.failing > 0 ? 'text-red-500' : 'text-[#64748B]'}
          icon="M4 7v10c0 2 3.6 3 8 3s8-1 8-3V7M4 7c0 2 3.6 3 8 3s8-1 8-3M4 7c0-2 3.6-3 8-3s8 1 8 3M4 12c0 2 3.6 3 8 3s8-1 8-3"
          tone="bg-blue-50 text-blue-600"
          href={APP_ROUTES.ADMIN_INTELLIGENCE_HUB_SOURCES}
        />
        <KpiCard
          label="New Intelligence"
          value={stats?.newItems ?? 0}
          sub={`${stats?.total ?? 0} items total`}
          icon="M13 10V3L4 14h7v7l9-11h-7z"
          tone="bg-emerald-50 text-emerald-600"
          href={APP_ROUTES.ADMIN_INTELLIGENCE_HUB}
        />
        <KpiCard
          label="Pending Review"
          value={stats?.pendingReview ?? 0}
          sub="items waiting"
          icon="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          tone="bg-orange-50 text-orange-500"
          href={APP_ROUTES.ADMIN_INTELLIGENCE_HUB}
        />
        <KpiCard
          label="Published"
          value={stats?.published ?? 0}
          sub="items published"
          icon="M5 13l4 4L19 7"
          tone="bg-violet-50 text-violet-600"
          href={APP_ROUTES.ADMIN_INTELLIGENCE_HUB}
        />
        <KpiCard
          label="Ready to Post"
          value={stats?.readyToPost ?? 0}
          sub={stats?.scheduled ? `${stats.scheduled} scheduled` : 'nothing scheduled'}
          subTone="text-[#64748B]"
          icon="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          tone="bg-sky-50 text-sky-600"
          href={APP_ROUTES.ADMIN_NEWSLETTER}
        />
        <KpiCard
          label="Critical Alerts"
          value={criticalTotal}
          sub={criticalTotal > 0 ? 'needs attention' : 'all clear'}
          subTone={criticalTotal > 0 ? 'text-red-500' : 'text-emerald-600'}
          icon="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
          tone="bg-red-50 text-red-500"
          href={APP_ROUTES.ADMIN_INTELLIGENCE_HUB}
        />
      </div>

      {/* Queue + Platform overview */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2 p-6">
          <CardHeader title="Incoming Intelligence Queue" href={APP_ROUTES.ADMIN_INTELLIGENCE_HUB} />
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] font-semibold text-[#475569] border-b border-[#E2E8F0]">
                  {['Headline', 'Source', 'Category', 'Importance', 'Urgency', 'AI Conf.', 'Status'].map((h) => (
                    <th key={h} className="py-2.5 pr-3 font-semibold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(queue.data?.items ?? []).map((i) => (
                  <tr key={i._id} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3 pr-3 min-w-[200px]">
                      <Link href={APP_ROUTES.ADMIN_INTELLIGENCE_HUB_ITEM(i._id)} className="text-xs font-semibold text-[#0F172A] hover:text-[#09488B] line-clamp-2">
                        {itemTitle(i)}
                      </Link>
                    </td>
                    <td className="py-3 pr-3 text-xs text-[#475569] max-w-[110px] truncate" title={i.sourceName}>{i.sourceName}</td>
                    <td className="py-3 pr-3 text-xs text-[#475569] max-w-[110px] truncate" title={i.category}>{i.category ?? '—'}</td>
                    <td className="py-3 pr-3"><Pill tone={PRIORITY_TONE[i.priority] ?? PRIORITY_TONE.normal}>{i.priority}</Pill></td>
                    <td className="py-3 pr-3"><Pill tone={URGENCY_TONE[i.urgency] ?? URGENCY_TONE.no_action}>{URGENCY_LABEL[i.urgency] ?? '—'}</Pill></td>
                    <td className="py-3 pr-3 text-xs font-semibold text-[#0F172A]">
                      {i.aiRelevanceScore ? `${i.aiRelevanceScore}/10` : '—'}
                    </td>
                    <td className="py-3"><Pill tone={ITEM_STATUS_TONE[i.status] ?? 'bg-slate-100 text-slate-500'}>{i.status.replace('_', ' ')}</Pill></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {queue.isLoading && (
              <div className="py-10 flex justify-center">
                <div className="w-7 h-7 border-4 border-[#09488B] border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {!queue.isLoading && (queue.data?.items ?? []).length === 0 && (
              <p className="text-sm text-[#94A3B8] text-center py-8">Nothing waiting for review.</p>
            )}
          </div>
          <Link href={APP_ROUTES.ADMIN_INTELLIGENCE_HUB} className="inline-block mt-4 text-sm font-medium text-[#09488B] hover:underline">
            View All Incoming Intelligence →
          </Link>
        </Card>

        <Card className="p-6">
          <CardHeader title="Platform Overview" href={APP_ROUTES.ADMIN_REPORTS} action="Reports" />
          {report.isLoading ? (
            <div className="py-10 flex justify-center">
              <div className="w-7 h-7 border-4 border-[#09488B] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : report.isError ? (
            <div className="py-8 flex flex-col items-center gap-3">
              <p className="text-sm font-semibold text-[#EF4444]">Failed to load dashboard data.</p>
              <button onClick={() => report.refetch()} className="text-sm font-semibold text-[#09488B] hover:underline">Retry</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Facilities', value: s?.totalFacilities ?? 0, sub: `${s?.activeFacilities ?? 0} active`, color: 'text-[#09488B]' },
                  { label: 'Flagged', value: s?.flaggedFacilities ?? 0, sub: 'No update in 24h', color: 'text-red-500' },
                  { label: 'Pending', value: s?.pendingFacilities ?? 0, sub: 'Awaiting approval', color: 'text-amber-500' },
                  { label: 'Inactive', value: s?.inactiveFacilities ?? 0, sub: 'Facilities', color: 'text-[#94A3B8]' },
                  { label: 'Users', value: s?.totalUsers ?? 0, sub: 'Registered', color: 'text-[#0F172A]' },
                  { label: 'Partners', value: s?.totalPartners ?? 0, sub: `${s?.visiblePartners ?? 0} visible`, color: 'text-emerald-500' },
                ].map((m) => (
                  <div key={m.label} className="rounded-lg bg-[#F8FAFC] border border-[#EEF2F7] px-4 py-3">
                    <p className="text-xs font-medium text-[#64748B]">{m.label}</p>
                    <p className={`text-2xl font-bold mt-1 ${m.color}`}>{m.value}</p>
                    <p className="text-[11px] text-[#94A3B8]">{m.sub}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-[#EEF2F7]">
                <p className="text-xs font-semibold text-[#475569] mb-3">Inquiries by Status · {s?.totalInquiries ?? 0} total</p>
                <div className="grid grid-cols-4 gap-2">
                  {['new', 'contacted', 'placed', 'closed'].map((k) => (
                    <div key={k} className="text-center">
                      <p className="text-lg font-bold text-[#0F172A]">{report.data?.inquiriesByStatus?.[k] ?? 0}</p>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_BADGE[k]}`}>{k}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card className="p-6">
          <CardHeader title="Source Health" href={APP_ROUTES.ADMIN_INTELLIGENCE_HUB_SOURCES} />
          <SourceHealth counts={sourceCounts} />
        </Card>

        <Card className="p-6">
          <CardHeader title="Top Categories" href={APP_ROUTES.ADMIN_INTELLIGENCE_HUB} />
          <div className="flex flex-col gap-4">
            {topCategories.map(([name, count], idx) => (
              <div key={name} className="flex items-center gap-3">
                <span className="text-xs font-medium text-[#0F172A] w-[112px] truncate" title={name}>{name}</span>
                <div className="flex-1 h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(count / maxCat) * 100}%`, background: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }} />
                </div>
                <span className="text-xs font-semibold text-[#475569] w-6 text-right">{count}</span>
              </div>
            ))}
            {topCategories.length === 0 && <p className="text-sm text-[#94A3B8] text-center py-6">No categorized items yet.</p>}
          </div>
        </Card>

        <Card className="p-6">
          <CardHeader title="Recent Inquiries" href={APP_ROUTES.ADMIN_INQUIRIES} />
          <div className="flex flex-col">
            {(report.data?.recentInquiries ?? []).map((inq) => (
              <Link key={inq._id} href={APP_ROUTES.ADMIN_INQUIRY_DETAIL(inq._id)}
                className="flex items-center justify-between gap-2 py-2.5 border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC] rounded px-1 transition-colors">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#0F172A] truncate">{inq.familyData.name}</p>
                  <p className="text-[11px] text-[#64748B] truncate">{new Date(inq.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize shrink-0 ${STATUS_BADGE[inq.status] ?? ''}`}>{inq.status}</span>
              </Link>
            ))}
            {(!report.data?.recentInquiries || report.data.recentInquiries.length === 0) && (
              <p className="text-sm text-[#94A3B8] text-center py-6">No inquiries yet</p>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <CardHeader title="Recent Alerts" href={APP_ROUTES.ADMIN_INTELLIGENCE_HUB} />
          <div className="flex flex-col gap-3">
            {(critical.data?.items ?? []).map((i) => (
              <Link key={i._id} href={APP_ROUTES.ADMIN_INTELLIGENCE_HUB_ITEM(i._id)}
                className="block rounded-lg border border-red-100 bg-red-50/60 p-3.5 hover:bg-red-50 transition-colors">
                <p className="text-[10px] font-bold tracking-wide text-red-600">CRITICAL ALERT</p>
                <p className="text-sm font-semibold text-[#0F172A] mt-1 line-clamp-2">{itemTitle(i)}</p>
                <div className="flex items-center justify-between mt-2 text-[11px] text-[#64748B]">
                  <span className="truncate">{i.sourceName}</span>
                  <span className="shrink-0 ml-2">{timeAgo(i.importedAt)}</span>
                </div>
              </Link>
            ))}
            {!critical.isLoading && (critical.data?.items ?? []).length === 0 && (
              <p className="text-sm text-[#94A3B8] text-center py-6">No critical alerts.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── Source health donut ──────────────────────────────────────────────────────

function SourceHealth({ counts }: { counts: { total: number; healthy: number; warning: number; failing: number; paused: number } }) {
  const R = 52;
  const C = 2 * Math.PI * R;
  const segments = [
    { label: 'Healthy', value: counts.healthy, color: '#22C55E' },
    { label: 'Failing', value: counts.failing, color: '#EF4444' },
    { label: 'Warning', value: counts.warning, color: '#F59E0B' },
    { label: 'Paused', value: counts.paused, color: '#94A3B8' },
  ];
  let offset = 0;

  return (
    <div className="flex items-center gap-5">
      <svg width="132" height="132" viewBox="0 0 132 132" className="shrink-0">
        <g transform="rotate(-90 66 66)">
          <circle cx="66" cy="66" r={R} fill="none" stroke="#F1F5F9" strokeWidth="14" />
          {counts.total > 0 && segments.map((seg) => {
            const len = (seg.value / counts.total) * C;
            const el = (
              <circle key={seg.label} cx="66" cy="66" r={R} fill="none" stroke={seg.color} strokeWidth="14"
                strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-offset} />
            );
            offset += len;
            return el;
          })}
        </g>
        <text x="66" y="66" textAnchor="middle" fontSize="24" fontWeight="700" fill="#0F172A">{counts.total}</text>
        <text x="66" y="84" textAnchor="middle" fontSize="10" fill="#64748B">Total Sources</text>
      </svg>
      <div className="flex flex-col gap-2.5 text-xs min-w-0">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2">
            <span className="size-2 rounded-full shrink-0" style={{ background: seg.color }} />
            <span className="text-[#475569]">{seg.label}</span>
            <span className="font-semibold text-[#0F172A] ml-auto pl-2">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
