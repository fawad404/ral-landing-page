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
import type { IHSource, SourceTier, SourceType } from '@/types/intelligence-hub.types';

const TIER_LABEL: Record<SourceTier, string> = {
  tier1: 'Tier 1 — Core',
  tier2: 'Tier 2 — High Value',
  tier3: 'Tier 3 — Local',
};

const TIER_COLOR: Record<SourceTier, string> = {
  tier1: 'bg-[#09488B] text-white',
  tier2: 'bg-blue-100 text-blue-700',
  tier3: 'bg-gray-100 text-gray-600',
};

const EMPTY_FORM = {
  name: '',
  rssUrl: '',
  websiteUrl: '',
  type: 'rss' as SourceType,
  tier: 'tier1' as SourceTier,
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
    name: initial?.name ?? '',
    rssUrl: initial?.rssUrl ?? '',
    websiteUrl: initial?.websiteUrl ?? '',
    type: initial?.type ?? 'rss',
    tier: initial?.tier ?? 'tier1',
    description: initial?.description ?? '',
  });

  function set(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const isEdit = !!initial?._id;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col">
        <div className="p-6 border-b border-[#E2E8F0]">
          <h2 className="text-xl font-black text-[#0F172A]">{isEdit ? 'Edit Source' : 'Add Source'}</h2>
        </div>

        <div className="p-6 flex flex-col gap-4">
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
                  { value: 'scrape', label: 'Scrape' },
                  { value: 'manual', label: 'Manual URL' },
                ]}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#64748B] uppercase tracking-wide">Tier</label>
              <CustomSelect
                value={form.tier}
                onChange={(v) => set('tier', v)}
                options={[
                  { value: 'tier1', label: 'Tier 1 — Core' },
                  { value: 'tier2', label: 'Tier 2 — High Value' },
                  { value: 'tier3', label: 'Tier 3 — Local' },
                ]}
              />
            </div>
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
            onClick={() => onSave(form)}
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
    <tr className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC]">
      <td className="py-3 px-4">
        <p className="text-sm font-semibold text-[#0F172A]">{source.name}</p>
        {source.description && (
          <p className="text-xs text-[#64748B] mt-0.5 line-clamp-1">{source.description}</p>
        )}
      </td>
      <td className="py-3 px-4">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TIER_COLOR[source.tier]}`}>
          {TIER_LABEL[source.tier]}
        </span>
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
        <a
          href={source.rssUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[#09488B] underline truncate max-w-[200px] block"
        >
          {source.rssUrl}
        </a>
      </td>
      <td className="py-3 px-4 text-xs text-[#64748B]">
        {source.lastFetchedAt
          ? new Date(source.lastFetchedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
          : 'Never'}
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

  const grouped: Record<SourceTier, IHSource[]> = {
    tier1: sources.filter((s) => s.tier === 'tier1'),
    tier2: sources.filter((s) => s.tier === 'tier2'),
    tier3: sources.filter((s) => s.tier === 'tier3'),
  };

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

      {/* Tables by tier */}
      {sourcesQ.isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="w-8 h-8 border-4 border-[#09488B] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        (['tier1', 'tier2', 'tier3'] as SourceTier[]).map((tier) => (
          <div key={tier} className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
            <div className="px-5 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
              <p className="text-sm font-bold text-[#0F172A]">{TIER_LABEL[tier]}</p>
              <span className="text-xs text-[#64748B]">
                {grouped[tier].filter((s) => s.isActive).length} active / {grouped[tier].length} total
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="border-b border-[#E2E8F0]">
                  <tr>
                    {['Source', 'Tier', 'Type', 'Status', 'RSS URL', 'Last Fetched', 'Actions'].map((h) => (
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
                  {grouped[tier].map((s) => (
                    <SourceRow
                      key={s._id}
                      source={s}
                      onEdit={() => openEdit(s)}
                      onToggle={() => updateSource.mutate({ id: s._id, data: { isActive: !s.isActive } })}
                      onDelete={() => setDeleteId(s._id)}
                    />
                  ))}
                  {grouped[tier].length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-6 text-[#94A3B8] text-sm">
                        No sources in this tier.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))
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
