'use client';
import React, { useState } from 'react';
import ConfirmDeleteModal from '@/components/global/ConfirmDeleteModal';
import CustomSelect from '@/components/global/CustomSelect';
import Link from 'next/link';
import { APP_ROUTES } from '@/api/endpoints';
import {
  useIHSources,
  useCreateSource,
  useUpdateSource,
  useDeleteSource,
} from '@/hooks/useIntelligenceHub';
import type { HealthStatus, IHSource, SourcePriority, SourceType, TrustLevel } from '@/types/intelligence-hub.types';

const PRIORITY_LABEL: Record<SourcePriority, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

const PRIORITY_COLOR: Record<SourcePriority, string> = {
  critical: 'bg-red-100 text-red-700',
  high: 'bg-orange-100 text-orange-700',
  medium: 'bg-blue-100 text-blue-700',
  low: 'bg-gray-100 text-gray-600',
};

const TRUST_LABEL: Record<TrustLevel, string> = {
  high: 'High Trust',
  medium: 'Medium Trust',
  low: 'Low Trust',
};

const HEALTH_LABEL: Record<HealthStatus, string> = {
  healthy: 'Healthy',
  warning: 'Warning',
  failing: 'Failing',
};

const HEALTH_COLOR: Record<HealthStatus, string> = {
  healthy: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  failing: 'bg-red-100 text-red-700',
};

const EMPTY_FORM = {
  name: '',
  rssUrl: '',
  websiteUrl: '',
  type: 'rss' as SourceType,
  industry: 'Assisted Living',
  categoriesText: '',
  scanFrequencyHours: 2,
  priority: 'medium' as SourcePriority,
  trustLevel: 'medium' as TrustLevel,
  description: '',
};

function SourceModal({
  initial,
  onSave,
  onClose,
  loading,
}: {
  initial?: Partial<IHSource>;
  onSave: (data: Partial<IHSource>) => void;
  onClose: () => void;
  loading: boolean;
}) {
  const [form, setForm] = useState({
    name: initial?.name ?? EMPTY_FORM.name,
    rssUrl: initial?.rssUrl ?? EMPTY_FORM.rssUrl,
    websiteUrl: initial?.websiteUrl ?? EMPTY_FORM.websiteUrl,
    type: initial?.type ?? EMPTY_FORM.type,
    industry: initial?.industry ?? EMPTY_FORM.industry,
    categoriesText: (initial?.categories ?? []).join(', '),
    scanFrequencyHours: initial?.scanFrequencyHours ?? EMPTY_FORM.scanFrequencyHours,
    priority: initial?.priority ?? EMPTY_FORM.priority,
    trustLevel: initial?.trustLevel ?? EMPTY_FORM.trustLevel,
    description: initial?.description ?? EMPTY_FORM.description,
  });

  function set(key: string, value: string | number) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const isEdit = !!initial?._id;

  function handleSave() {
    const categories = form.categoriesText
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    onSave({
      name: form.name,
      rssUrl: form.rssUrl,
      websiteUrl: form.websiteUrl,
      type: form.type as SourceType,
      industry: form.industry,
      categories,
      scanFrequencyHours: Number(form.scanFrequencyHours) || 2,
      priority: form.priority as SourcePriority,
      trustLevel: form.trustLevel as TrustLevel,
      description: form.description,
    });
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-[#E2E8F0]">
          <h2 className="text-xl font-black text-[#0F172A]">{isEdit ? 'Edit Source' : 'Add Source'}</h2>
        </div>

        <div className="p-6 flex flex-col gap-4 overflow-y-auto">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#64748B] uppercase tracking-wide">Source Name *</label>
            <input
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="McKnight's Senior Living"
              className="border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#09488B]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#64748B] uppercase tracking-wide">RSS Feed URL *</label>
            <input
              value={form.rssUrl}
              onChange={(e) => set('rssUrl', e.target.value)}
              placeholder="https://example.com/feed/"
              className="border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#09488B]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#64748B] uppercase tracking-wide">Website URL</label>
            <input
              value={form.websiteUrl}
              onChange={(e) => set('websiteUrl', e.target.value)}
              placeholder="https://example.com"
              className="border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#09488B]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#64748B] uppercase tracking-wide">Type</label>
              <CustomSelect
                value={form.type}
                onChange={(v) => set('type', v)}
                options={[
                  { value: 'rss', label: 'RSS Feed' },
                  { value: 'scrape', label: 'Scrape (coming soon)' },
                  { value: 'manual', label: 'Manual URL (coming soon)' },
                ]}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#64748B] uppercase tracking-wide">Industry</label>
              <input
                value={form.industry}
                onChange={(e) => set('industry', e.target.value)}
                placeholder="Assisted Living"
                className="border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#09488B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#64748B] uppercase tracking-wide">Priority</label>
              <CustomSelect
                value={form.priority}
                onChange={(v) => set('priority', v)}
                options={[
                  { value: 'critical', label: 'Critical' },
                  { value: 'high', label: 'High' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'low', label: 'Low' },
                ]}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#64748B] uppercase tracking-wide">Trust Level</label>
              <CustomSelect
                value={form.trustLevel}
                onChange={(v) => set('trustLevel', v)}
                options={[
                  { value: 'high', label: 'High Trust' },
                  { value: 'medium', label: 'Medium Trust' },
                  { value: 'low', label: 'Low Trust' },
                ]}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#64748B] uppercase tracking-wide">
              Scan Frequency (hours)
            </label>
            <input
              type="number"
              min={0.5}
              step={0.5}
              value={form.scanFrequencyHours}
              onChange={(e) => set('scanFrequencyHours', e.target.value)}
              className="border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#09488B]"
            />
            <p className="text-xs text-[#94A3B8]">How often this source should be checked for new content.</p>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#64748B] uppercase tracking-wide">Categories</label>
            <input
              value={form.categoriesText}
              onChange={(e) => set('categoriesText', e.target.value)}
              placeholder="Compliance & Regulatory, Staffing & Caregiver News"
              className="border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#09488B]"
            />
            <p className="text-xs text-[#94A3B8]">Comma-separated. Which content categories this source typically produces.</p>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#64748B] uppercase tracking-wide">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={2}
              placeholder="Brief description of what this source provides"
              className="border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#09488B] resize-none"
            />
          </div>
        </div>

        <div className="p-6 border-t border-[#E2E8F0] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="text-sm border border-[#E2E8F0] text-[#475569] px-4 py-2 rounded-xl hover:bg-[#F1F5F9]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!form.name || !form.rssUrl || loading}
            className="text-sm bg-[#09488B] text-white px-5 py-2 rounded-xl hover:bg-[#073a70] disabled:opacity-60 font-semibold"
          >
            {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Source'}
          </button>
        </div>
      </div>
    </div>
  );
}

function formatDate(value?: string) {
  if (!value) return 'Never';
  return new Date(value).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function SourceRow({
  source,
  onEdit,
  onToggle,
  onDelete,
}: {
  source: IHSource;
  onEdit: () => void;
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <tr className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] align-top">
      <td className="py-3 px-4">
        <p className="text-sm font-semibold text-[#0F172A]">{source.name}</p>
        {source.description && (
          <p className="text-xs text-[#64748B] mt-0.5 line-clamp-1">{source.description}</p>
        )}
        {source.categories?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {source.categories.map((c) => (
              <span key={c} className="text-[10px] bg-[#F1F5F9] text-[#475569] px-1.5 py-0.5 rounded-full">
                {c}
              </span>
            ))}
          </div>
        )}
      </td>
      <td className="py-3 px-4">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${PRIORITY_COLOR[source.priority]}`}>
          {PRIORITY_LABEL[source.priority]}
        </span>
      </td>
      <td className="py-3 px-4">
        <span className="text-xs text-[#64748B]">{TRUST_LABEL[source.trustLevel]}</span>
      </td>
      <td className="py-3 px-4">
        <span className="text-xs text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded-full capitalize">
          {source.type}
        </span>
      </td>
      <td className="py-3 px-4">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${source.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500'}`}>
          {source.isActive ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td className="py-3 px-4">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${HEALTH_COLOR[source.healthStatus]}`}>
          {HEALTH_LABEL[source.healthStatus]}
        </span>
        {source.consecutiveFailures > 0 && (
          <p className="text-[10px] text-[#94A3B8] mt-1">{source.consecutiveFailures} failed attempt(s)</p>
        )}
      </td>
      <td className="py-3 px-4 text-xs text-[#64748B]">
        <p>Scan: {formatDate(source.lastScanAt)}</p>
        <p className="mt-0.5">Success: {formatDate(source.lastSuccessfulScanAt)}</p>
      </td>
      <td className="py-3 px-4">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={onEdit}
            className="text-xs border border-[#E2E8F0] text-[#475569] px-2.5 py-1 rounded-lg hover:bg-[#F1F5F9]"
          >
            Edit
          </button>
          <button
            onClick={onToggle}
            className={`text-xs px-2.5 py-1 rounded-lg border ${
              source.isActive
                ? 'border-red-200 text-red-500 hover:bg-red-50'
                : 'border-green-200 text-green-600 hover:bg-green-50'
            }`}
          >
            {source.isActive ? 'Disable' : 'Enable'}
          </button>
          <button
            onClick={onDelete}
            className="text-xs border border-red-200 text-red-500 px-2.5 py-1 rounded-lg hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function AdminIntelligenceHubSourcesPage() {
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<IHSource | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const sourcesQ = useIHSources();
  const createSource = useCreateSource();
  const updateSource = useUpdateSource();
  const deleteSource = useDeleteSource();

  const sources = sourcesQ.data ?? [];

  function openAdd() {
    setEditTarget(null);
    setShowModal(true);
  }

  function openEdit(source: IHSource) {
    setEditTarget(source);
    setShowModal(true);
  }

  function handleSave(data: Partial<IHSource>) {
    if (editTarget) {
      updateSource.mutate(
        { id: editTarget._id, data },
        { onSuccess: () => setShowModal(false) },
      );
    } else {
      createSource.mutate(data, { onSuccess: () => setShowModal(false) });
    }
  }

  const saving = createSource.isPending || updateSource.isPending;

  return (
    <div className="p-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-[#64748B] mb-2">
            <Link href={APP_ROUTES.ADMIN_INTELLIGENCE_HUB} className="hover:text-[#09488B]">
              Intelligence Hub
            </Link>
            <span>/</span>
            <span className="text-[#0F172A] font-medium">Sources</span>
          </div>
          <h1 className="text-3xl font-black text-[#0F172A]">Source Management</h1>
          <p className="text-[#64748B] mt-1">Manage RSS feeds and content sources. {sources.length} total sources.</p>
        </div>
        <button
          onClick={openAdd}
          className="text-sm bg-[#09488B] text-white px-4 py-2 rounded-xl hover:bg-[#073a70] font-medium"
        >
          + Add Source
        </button>
      </div>

      {/* Flat sources table, sorted by priority (highest first) */}
      {sourcesQ.isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="w-8 h-8 border-4 border-[#09488B] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                <tr>
                  {['Source', 'Priority', 'Trust', 'Type', 'Status', 'Health', 'Scan Activity', 'Actions'].map((h) => (
                    <th
                      key={h}
                      className="text-left py-2 px-4 text-xs font-bold text-[#94A3B8] uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sources.map((s) => (
                  <SourceRow
                    key={s._id}
                    source={s}
                    onEdit={() => openEdit(s)}
                    onToggle={() => updateSource.mutate({ id: s._id, data: { isActive: !s.isActive } })}
                    onDelete={() => setDeleteId(s._id)}
                  />
                ))}
                {sources.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-6 text-[#94A3B8] text-sm">
                      No sources yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <SourceModal
          initial={editTarget ?? undefined}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
          loading={saving}
        />
      )}
      {deleteId && (
        <ConfirmDeleteModal
          title="Delete Source"
          message="Are you sure you want to delete this RSS source? This action cannot be undone."
          onConfirm={() => { deleteSource.mutate(deleteId); setDeleteId(null); }}
          onCancel={() => setDeleteId(null)}
          isLoading={deleteSource.isPending}
        />
      )}
    </div>
  );
}
