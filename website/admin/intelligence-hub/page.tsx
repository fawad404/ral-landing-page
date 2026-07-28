'use client';
import React, { useState } from 'react';
import CustomSelect from '@/components/global/CustomSelect';
import Link from 'next/link';
import { APP_ROUTES } from '@/api/endpoints';
import {
  useIHStats,
  useIHItems,
  useIHCategories,
  useIHSources,
  useTriggerIngest,
  useUpdateItem,
  useDeleteItem,
} from '@/hooks/useIntelligenceHub';
import type { ContentItem, ContentItemFilters, ContentStatus, PriorityLevel } from '@/types/intelligence-hub.types';

// ─── HELPERS ─────────────────────────────────────────────────────────────────

// Only articles in these categories belong to the newsletter workflow
const NEWSLETTER_CATEGORIES = new Set([
  'Compliance & Regulatory',
  'Staffing & Caregiver News',
  'Industry News & Operations',
  'Emergency & Safety Alerts',
  'Law / Policy / ALTCS Updates',
]);

const STATUS_BADGE: Record<ContentStatus, string> = {
  // legacy (kept for existing DB records)
  pending:        'bg-yellow-100 text-yellow-700',
  processed:      'bg-green-100 text-green-700',
  // active pipeline
  new:            'bg-slate-100 text-slate-600',
  processing:     'bg-blue-100 text-blue-700',
  pending_review: 'bg-amber-100 text-amber-700',
  // newsletter workflow
  approved:       'bg-emerald-100 text-emerald-700',
  rejected:       'bg-red-100 text-red-500',
  scheduled:      'bg-indigo-100 text-indigo-700',
  published:      'bg-teal-100 text-teal-700',
  archived:       'bg-gray-100 text-gray-500',
};

const STATUS_LABEL: Record<ContentStatus, string> = {
  pending:        'Legacy Pending',
  processed:      'Legacy Processed',
  new:            'New',
  processing:     'Processing',
  pending_review: 'Pending Review',
  approved:       'Approved',
  rejected:       'Rejected',
  scheduled:      'Scheduled',
  published:      'Published',
  archived:       'Archived',
};

const PRIORITY_BADGE: Record<PriorityLevel, string> = {
  normal: 'bg-gray-100 text-gray-600',
  high: 'bg-orange-100 text-orange-600',
  critical: 'bg-red-100 text-red-600',
};

function fmtDate(iso?: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 flex flex-col gap-1">
      <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">{label}</p>
      <p className={`text-2xl font-black ${color}`}>{value}</p>
    </div>
  );
}

// ─── ITEM ROW ─────────────────────────────────────────────────────────────────

function ItemRow({
  item,
  onApprove,
  onReject,
  onMarkReady,
  onSchedule,
  onPublish,
  onArchive,
  onDelete,
}: {
  item: ContentItem;
  onApprove: () => void;
  onReject: () => void;
  onMarkReady: () => void;
  onSchedule: () => void;
  onPublish: () => void;
  onArchive: () => void;
  onDelete: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <tr className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC]">
      {/* Title + Source */}
      <td className="py-3 px-4 max-w-[280px]">
        <Link
          href={APP_ROUTES.ADMIN_INTELLIGENCE_HUB_ITEM(item._id)}
          className="text-sm font-semibold text-[#0F172A] hover:text-[#09488B] line-clamp-2 leading-snug block"
        >
          {item.aiHeadline || item.originalTitle}
        </Link>
        <p className="text-xs text-[#64748B] mt-0.5 truncate">{item.sourceName}</p>
        {item.isArizonaSpecific && (
          <span className="text-[10px] font-bold text-[#09488B] bg-[#0947871A] px-1.5 py-0.5 rounded mt-0.5 inline-block">
            AZ
          </span>
        )}
      </td>

      {/* Category */}
      <td className="py-3 px-4">
        <span className="text-xs text-[#475569] bg-[#F1F5F9] px-2 py-0.5 rounded-full whitespace-nowrap">
          {item.category || '—'}
        </span>
      </td>

      {/* Status */}
      <td className="py-3 px-4">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_BADGE[item.status]}`}>
          {STATUS_LABEL[item.status] ?? item.status}
        </span>
      </td>

      {/* Priority */}
      <td className="py-3 px-4">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${PRIORITY_BADGE[item.priority]}`}>
          {item.priority}
        </span>
      </td>

      {/* Score */}
      <td className="py-3 px-4 text-center">
        {item.aiRelevanceScore ? (
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              item.aiRelevanceScore >= 7
                ? 'bg-green-100 text-green-700'
                : item.aiRelevanceScore >= 4
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-500'
            }`}
          >
            {item.aiRelevanceScore}/10
          </span>
        ) : (
          <span className="text-xs text-[#94A3B8]">—</span>
        )}
      </td>

      {/* Date */}
      <td className="py-3 px-4 text-xs text-[#64748B] whitespace-nowrap">{fmtDate(item.importedAt)}</td>

      {/* Flags */}
      <td className="py-3 px-4">
        <div className="flex gap-1.5 flex-wrap">
          {item.reviewed && (
            <span className="text-[10px] font-semibold bg-[#E0F2FE] text-blue-700 px-1.5 py-0.5 rounded">Reviewed</span>
          )}
          {item.approved && (
            <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">Approved</span>
          )}
          {item.readyToPost && (
            <span className="text-[10px] font-semibold bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">Ready</span>
          )}
        </div>
      </td>

      {/* Actions */}
      <td className="py-3 px-4">
        <div className="flex gap-1.5 flex-wrap items-center">
          <Link
            href={APP_ROUTES.ADMIN_INTELLIGENCE_HUB_ITEM(item._id)}
            className="text-xs bg-[#09488B] text-white px-2.5 py-1 rounded-lg hover:bg-[#073a70] whitespace-nowrap"
          >
            View
          </Link>
          {!item.approved && (item.status === 'pending_review' || item.status === 'processed') && (
            <button
              onClick={onApprove}
              className="text-xs bg-emerald-500 text-white px-2.5 py-1 rounded-lg hover:bg-emerald-600 whitespace-nowrap"
            >
              Approve
            </button>
          )}
          {item.approved && !item.readyToPost && item.status !== 'scheduled' && item.status !== 'published' && item.status !== 'archived' && (
            <button
              onClick={onMarkReady}
              className="text-xs bg-purple-500 text-white px-2.5 py-1 rounded-lg hover:bg-purple-600 whitespace-nowrap"
            >
              Mark Ready
            </button>
          )}
          {item.readyToPost && item.status !== 'scheduled' && item.status !== 'published' && item.status !== 'archived' && NEWSLETTER_CATEGORIES.has(item.category ?? '') && (
            <button
              onClick={onSchedule}
              className="text-xs bg-indigo-500 text-white px-2.5 py-1 rounded-lg hover:bg-indigo-600 whitespace-nowrap"
            >
              Schedule
            </button>
          )}
          {item.status === 'scheduled' && (
            <button
              onClick={onPublish}
              className="text-xs bg-teal-500 text-white px-2.5 py-1 rounded-lg hover:bg-teal-600 whitespace-nowrap"
            >
              Publish
            </button>
          )}
          {(item.status === 'published') && (
            <button
              onClick={onArchive}
              className="text-xs bg-gray-400 text-white px-2.5 py-1 rounded-lg hover:bg-gray-500 whitespace-nowrap"
            >
              Archive
            </button>
          )}
          {item.status !== 'rejected' && item.status !== 'published' && item.status !== 'archived' && !item.approved && (
            <button
              onClick={onReject}
              className="text-xs border border-red-300 text-red-500 px-2.5 py-1 rounded-lg hover:bg-red-50 whitespace-nowrap"
            >
              Reject
            </button>
          )}
          {confirmDelete ? (
            <>
              <button
                onClick={onDelete}
                className="text-xs bg-red-500 text-white px-2.5 py-1 rounded-lg hover:bg-red-600"
              >
                Confirm
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-xs border border-[#E2E8F0] text-[#475569] px-2.5 py-1 rounded-lg hover:bg-[#F1F5F9]"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="text-xs border border-[#E2E8F0] text-[#94A3B8] px-2.5 py-1 rounded-lg hover:bg-[#F1F5F9]"
            >
              Del
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function AdminIntelligenceHubPage() {
  const [filters, setFilters] = useState<ContentItemFilters>({ page: 1, limit: 20 });
  const [scheduleModal, setScheduleModal] = useState<{ id: string } | null>(null);
  const [scheduleDate, setScheduleDate] = useState('');

  const statsQ = useIHStats();
  const categoriesQ = useIHCategories();
  const sourcesQ = useIHSources();
  const itemsQ = useIHItems(filters);
  const triggerIngest = useTriggerIngest();
  const updateItem = useUpdateItem();
  const deleteItem = useDeleteItem();

  const stats = statsQ.data;
  const categories = categoriesQ.data ?? [];
  const sources = sourcesQ.data ?? [];
  const data = itemsQ.data;

  function setFilter(key: keyof ContentItemFilters, value: any) {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      // Reset to page 1 whenever a real filter changes, but not when navigating pages
      ...(key !== 'page' ? { page: 1 } : {}),
    }));
  }

  function clearFilters() {
    setFilters({ page: 1, limit: 20 });
  }

  return (
    <div className="p-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0F172A]">Intelligence Hub</h1>
          <p className="text-[#64748B] mt-1">
            Arizona Assisted Living market intelligence — daily insights engine.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href={APP_ROUTES.ADMIN_INTELLIGENCE_HUB_SOURCES}
            className="text-sm border border-[#E2E8F0] text-[#475569] px-4 py-2 rounded-xl hover:bg-[#F1F5F9] font-medium"
          >
            Manage Sources
          </Link>
          <button
            onClick={() => triggerIngest.mutate()}
            disabled={triggerIngest.isPending}
            className="text-sm bg-[#09488B] text-white px-4 py-2 rounded-xl hover:bg-[#073a70] font-medium disabled:opacity-60 flex items-center gap-2"
          >
            {triggerIngest.isPending ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Ingesting…
              </>
            ) : (
              'Run Ingest Now'
            )}
          </button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-3">
          <StatCard label="Total"          value={stats.total}           color="text-[#0F172A]" />
          <StatCard label="New"            value={stats.newItems}        color="text-slate-600" />
          <StatCard label="Processing"     value={stats.processing}      color="text-blue-600" />
          <StatCard label="Pending Review" value={stats.pendingReview}   color="text-amber-600" />
          <StatCard label="Approved"       value={stats.approved}        color="text-emerald-600" />
          <StatCard label="Rejected"       value={stats.rejected}        color="text-red-500" />
          <StatCard label="Ready"          value={stats.readyToPost}     color="text-purple-600" />
          <StatCard label="Scheduled"      value={stats.scheduled ?? 0}  color="text-indigo-600" />
          <StatCard label="Published"      value={stats.published ?? 0}  color="text-teal-600" />
          <StatCard label="Archived"       value={stats.archived ?? 0}   color="text-gray-500" />
        </div>
      )}

      {/* Filters */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 flex flex-wrap gap-3 items-end">
        {/* Search */}
        <div className="flex flex-col gap-1 min-w-[200px] flex-1">
          <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">Search</label>
          <input
            value={filters.search ?? ''}
            onChange={(e) => setFilter('search', e.target.value || undefined)}
            placeholder="Title, summary, headline…"
            className="h-10 border border-[#E2E8F0] rounded-lg px-3 text-sm outline-none focus:border-[#09488B]"
          />
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1 min-w-[190px]">
          <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">Category</label>
          <CustomSelect
            value={filters.category ?? ''}
            onChange={(v) => setFilter('category', v || undefined)}
            placeholder="All Categories"
            options={categories.map((c) => ({ value: c, label: c }))}
          />
        </div>

        {/* Source */}
        <div className="flex flex-col gap-1 min-w-[190px]">
          <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">Source</label>
          <CustomSelect
            value={filters.sourceName ?? ''}
            onChange={(v) => setFilter('sourceName', v || undefined)}
            placeholder="All Sources"
            options={sources.map((s) => ({ value: s.name, label: s.name }))}
          />
        </div>

        {/* Status */}
        <div className="flex flex-col gap-1 min-w-[165px]">
          <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">Status</label>
          <CustomSelect
            value={filters.status ?? ''}
            onChange={(v) => setFilter('status', v || undefined)}
            placeholder="All Statuses"
            options={[
              { value: 'new',            label: 'New' },
              { value: 'processing',     label: 'Processing' },
              { value: 'pending_review', label: 'Pending Review' },
              { value: 'approved',       label: 'Approved' },
              { value: 'rejected',       label: 'Rejected' },
              { value: 'scheduled',      label: 'Scheduled' },
              { value: 'published',      label: 'Published' },
              { value: 'archived',       label: 'Archived' },
              { value: 'pending',        label: 'Legacy Pending' },
              { value: 'processed',      label: 'Legacy Processed' },
            ]}
          />
        </div>

        {/* Priority */}
        <div className="flex flex-col gap-1 min-w-[145px]">
          <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">Priority</label>
          <CustomSelect
            value={filters.priority ?? ''}
            onChange={(v) => setFilter('priority', v || undefined)}
            placeholder="All"
            options={[
              { value: 'critical', label: 'Critical' },
              { value: 'high', label: 'High' },
              { value: 'normal', label: 'Normal' },
            ]}
          />
        </div>

        {/* Approved */}
        <div className="flex flex-col gap-1 min-w-[160px]">
          <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">Approved</label>
          <CustomSelect
            value={filters.approved === undefined || filters.approved === '' ? '' : String(filters.approved)}
            onChange={(v) => setFilter('approved', v === '' ? undefined : v === 'true')}
            placeholder="All"
            options={[
              { value: 'true', label: 'Approved' },
              { value: 'false', label: 'Not Approved' },
            ]}
          />
        </div>

        {/* Ready to Post */}
        <div className="flex flex-col gap-1 min-w-[160px]">
          <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">Ready</label>
          <CustomSelect
            value={filters.readyToPost === undefined || filters.readyToPost === '' ? '' : String(filters.readyToPost)}
            onChange={(v) => setFilter('readyToPost', v === '' ? undefined : v === 'true')}
            placeholder="All"
            options={[
              { value: 'true', label: 'Ready to Post' },
              { value: 'false', label: 'Not Ready' },
            ]}
          />
        </div>

        {/* Date From */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">From</label>
          <input
            type="date"
            value={filters.dateFrom ?? ''}
            onChange={(e) => setFilter('dateFrom', e.target.value || undefined)}
            className="h-10 border border-[#E2E8F0] rounded-lg px-3 text-sm outline-none focus:border-[#09488B]"
          />
        </div>

        {/* Date To */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">To</label>
          <input
            type="date"
            value={filters.dateTo ?? ''}
            onChange={(e) => setFilter('dateTo', e.target.value || undefined)}
            className="h-10 border border-[#E2E8F0] rounded-lg px-3 text-sm outline-none focus:border-[#09488B]"
          />
        </div>

        {/* Clear */}
        <button
          onClick={clearFilters}
          className="h-10 text-sm border border-[#E2E8F0] text-[#475569] px-4 rounded-lg hover:bg-[#F1F5F9] self-end"
        >
          Clear
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
        {itemsQ.isLoading ? (
          /* Initial load — full skeleton rows */
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <tr>
                  {['Title / Source', 'Category', 'Status', 'Priority', 'Score', 'Imported', 'Flags', 'Actions'].map((h) => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-bold text-[#64748B] uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...Array(8)].map((_, i) => (
                  <tr key={i} className="border-b border-[#F1F5F9]">
                    <td className="py-3 px-4"><div className="h-4 bg-[#F1F5F9] rounded w-48 animate-pulse mb-1" /><div className="h-3 bg-[#F1F5F9] rounded w-28 animate-pulse" /></td>
                    <td className="py-3 px-4"><div className="h-5 bg-[#F1F5F9] rounded-full w-24 animate-pulse" /></td>
                    <td className="py-3 px-4"><div className="h-5 bg-[#F1F5F9] rounded-full w-20 animate-pulse" /></td>
                    <td className="py-3 px-4"><div className="h-5 bg-[#F1F5F9] rounded-full w-16 animate-pulse" /></td>
                    <td className="py-3 px-4 text-center"><div className="h-5 bg-[#F1F5F9] rounded-full w-12 mx-auto animate-pulse" /></td>
                    <td className="py-3 px-4"><div className="h-4 bg-[#F1F5F9] rounded w-20 animate-pulse" /></td>
                    <td className="py-3 px-4"><div className="h-4 bg-[#F1F5F9] rounded w-16 animate-pulse" /></td>
                    <td className="py-3 px-4"><div className="h-7 bg-[#F1F5F9] rounded-lg w-28 animate-pulse" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Data loaded — show table, dim + spinner overlay while refetching */
          <div className="relative">
            {itemsQ.isFetching && (
              <div className="absolute inset-0 z-10 bg-white/60 flex items-center justify-center rounded-xl pointer-events-none">
                <div className="flex items-center gap-2.5 bg-white border border-[#E2E8F0] rounded-xl px-4 py-2.5 shadow-sm">
                  <div className="w-4 h-4 border-2 border-[#09488B] border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-semibold text-[#475569]">Updating…</span>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px]">
                <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <tr>
                    {['Title / Source', 'Category', 'Status', 'Priority', 'Score', 'Imported', 'Flags', 'Actions'].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left py-3 px-4 text-xs font-bold text-[#64748B] uppercase tracking-wide whitespace-nowrap"
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {(data?.items ?? []).map((item) => (
                    <ItemRow
                      key={item._id}
                      item={item}
                      onApprove={() => updateItem.mutate({ id: item._id, data: { approved: true, reviewed: true, status: 'approved' as ContentStatus } })}
                      onReject={() =>
                        updateItem.mutate({ id: item._id, data: { status: 'rejected' as ContentStatus, approved: false, readyToPost: false } })
                      }
                      onMarkReady={() => updateItem.mutate({ id: item._id, data: { readyToPost: true } })}
                      onSchedule={() => { setScheduleModal({ id: item._id }); setScheduleDate(''); }}
                      onPublish={() => updateItem.mutate({ id: item._id, data: { status: 'published' as ContentStatus } })}
                      onArchive={() => updateItem.mutate({ id: item._id, data: { status: 'archived' as ContentStatus } })}
                      onDelete={() => deleteItem.mutate(item._id)}
                    />
                  ))}
                  {(data?.items ?? []).length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-[#94A3B8] text-sm">
                        No content items found. Try running an ingest or adjusting filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {data && data.totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-[#E2E8F0]">
                <p className="text-sm text-[#64748B]">
                  Showing {(data.page - 1) * data.limit + 1}–
                  {Math.min(data.page * data.limit, data.total)} of {data.total}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilter('page', Math.max(1, (filters.page ?? 1) - 1))}
                    disabled={(filters.page ?? 1) <= 1}
                    className="text-sm border border-[#E2E8F0] text-[#475569] px-3 py-1.5 rounded-lg hover:bg-[#F1F5F9] disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-[#475569] px-2 py-1.5">
                    Page {data.page} of {data.totalPages}
                  </span>
                  <button
                    onClick={() => setFilter('page', Math.min(data.totalPages, (filters.page ?? 1) + 1))}
                    disabled={(filters.page ?? 1) >= data.totalPages}
                    className="text-sm border border-[#E2E8F0] text-[#475569] px-3 py-1.5 rounded-lg hover:bg-[#F1F5F9] disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Schedule modal */}
      {scheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm flex flex-col gap-4">
            <h3 className="text-base font-bold text-[#0F172A]">Schedule for Newsletter</h3>
            <p className="text-sm text-[#64748B]">Pick the newsletter issue date this article will appear in.</p>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#64748B] uppercase tracking-wide">Newsletter Date</label>
              <input
                type="date"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="h-10 border border-[#E2E8F0] rounded-xl px-3 text-sm outline-none focus:border-[#09488B]"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setScheduleModal(null)}
                className="text-sm border border-[#E2E8F0] text-[#475569] px-4 py-2 rounded-xl hover:bg-[#F1F5F9]"
              >
                Cancel
              </button>
              <button
                disabled={!scheduleDate || updateItem.isPending}
                onClick={() => {
                  updateItem.mutate(
                    { id: scheduleModal.id, data: { status: 'scheduled' as ContentStatus, scheduledFor: new Date(scheduleDate).toISOString() } },
                    { onSuccess: () => setScheduleModal(null) },
                  );
                }}
                className="text-sm bg-indigo-500 text-white px-4 py-2 rounded-xl hover:bg-indigo-600 disabled:opacity-40"
              >
                {updateItem.isPending ? 'Scheduling…' : 'Confirm Schedule'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
