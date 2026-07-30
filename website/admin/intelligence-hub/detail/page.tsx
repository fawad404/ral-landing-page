'use client';
import React, { useEffect, useState } from 'react';
import CustomSelect from '@/components/global/CustomSelect';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { APP_ROUTES } from '@/api/endpoints';
import {
  useIHItem,
  useUpdateItem,
  useReprocessItem,
  useDeleteItem,
  useIHCategories,
} from '@/hooks/useIntelligenceHub';
import type { ChangeType, ContentStatus, OpportunityLevel, PriorityLevel, RiskLevel, UrgencyLevel } from '@/types/intelligence-hub.types';

const STATUS_BADGE: Record<ContentStatus, string> = {
  pending:        'bg-yellow-100 text-yellow-700',
  processed:      'bg-green-100 text-green-700',
  new:            'bg-slate-100 text-slate-600',
  processing:     'bg-blue-100 text-blue-700',
  pending_review: 'bg-amber-100 text-amber-700',
  approved:       'bg-emerald-100 text-emerald-700',
  rejected:       'bg-red-100 text-red-500',
  scheduled:      'bg-indigo-100 text-indigo-700',
  published:      'bg-teal-100 text-teal-700',
  archived:       'bg-gray-100 text-gray-500',
};

const NEWSLETTER_CATEGORIES = new Set([
  'Compliance & Regulatory',
  'Staffing & Caregiver News',
  'Industry News & Operations',
  'Emergency & Safety Alerts',
  'Law / Policy / ALTCS Updates',
]);

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

const CHANGE_TYPE_LABEL: Record<ChangeType, string> = {
  new_regulation: 'New Regulation',
  updated_regulation: 'Updated Regulation',
  deadline_changed: 'Deadline Changed',
  funding_opportunity: 'Funding Opportunity',
  technology_release: 'Technology Release',
  survey_guidance: 'Survey Guidance',
  industry_trend: 'Industry Trend',
  ownership_change: 'Ownership Change',
  executive_appointment: 'Executive Appointment',
  partnership_announcement: 'Partnership Announcement',
  other: 'Other',
};

const CHANGE_TYPE_OPTIONS = (Object.keys(CHANGE_TYPE_LABEL) as ChangeType[]).map((v) => ({
  value: v,
  label: CHANGE_TYPE_LABEL[v],
}));

const URGENCY_LABEL: Record<UrgencyLevel, string> = {
  immediate: 'Immediate',
  this_week: 'This Week',
  monitor: 'Monitor',
  no_action: 'No Action Needed',
};

const URGENCY_BADGE: Record<UrgencyLevel, string> = {
  immediate: 'bg-red-100 text-red-700',
  this_week: 'bg-orange-100 text-orange-700',
  monitor: 'bg-blue-100 text-blue-700',
  no_action: 'bg-gray-100 text-gray-500',
};

const URGENCY_OPTIONS = (Object.keys(URGENCY_LABEL) as UrgencyLevel[]).map((v) => ({
  value: v,
  label: URGENCY_LABEL[v],
}));

const RISK_LABEL: Record<RiskLevel, string> = {
  low: 'Low Risk',
  medium: 'Medium Risk',
  high: 'High Risk',
  critical: 'Critical Risk',
};

const RISK_BADGE: Record<RiskLevel, string> = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700',
};

const RISK_OPTIONS = (Object.keys(RISK_LABEL) as RiskLevel[]).map((v) => ({
  value: v,
  label: RISK_LABEL[v],
}));

const OPPORTUNITY_LABEL: Record<OpportunityLevel, string> = {
  low: 'Low Opportunity',
  medium: 'Medium Opportunity',
  high: 'High Opportunity',
};

const OPPORTUNITY_BADGE: Record<OpportunityLevel, string> = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-sky-100 text-sky-700',
  high: 'bg-green-100 text-green-700',
};

const OPPORTUNITY_OPTIONS = (Object.keys(OPPORTUNITY_LABEL) as OpportunityLevel[]).map((v) => ({
  value: v,
  label: OPPORTUNITY_LABEL[v],
}));

function fmtDate(iso?: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function EditableField({
  label,
  value,
  onChange,
  multiline = false,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  rows?: number;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-bold text-[#64748B] uppercase tracking-wide">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className="border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm text-[#0F172A] outline-none focus:border-[#09488B] resize-vertical leading-relaxed"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm text-[#0F172A] outline-none focus:border-[#09488B]"
        />
      )}
    </div>
  );
}

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="text-xs border border-[#E2E8F0] text-[#475569] px-3 py-1.5 rounded-lg hover:bg-[#F1F5F9] flex items-center gap-1.5"
    >
      {copied ? '✓ Copied!' : `Copy ${label ?? ''}`}
    </button>
  );
}

interface Props {
  id: string;
}

export default function AdminIntelligenceHubDetailPage({ id }: Props) {
  const router = useRouter();
  const itemQ = useIHItem(id);
  const categoriesQ = useIHCategories();
  const updateItem = useUpdateItem();
  const reprocess = useReprocessItem();
  const deleteItem = useDeleteItem();

  const item = itemQ.data;
  const categories = categoriesQ.data ?? [];
  const reprocessError: string | null =
    reprocess.error
      ? ((reprocess.error as any)?.response?.data?.message ?? (reprocess.error as any)?.message ?? 'AI processing failed')
      : null;

  // Local editable state
  const [aiHeadline, setAiHeadline] = useState('');
  const [aiSummary, setAiSummary] = useState('');
  const [aiWhatThisMeans, setAiWhatThisMeans] = useState('');
  const [aiOperatorTakeaway, setAiOperatorTakeaway] = useState('');
  const [aiFacebookPost, setAiFacebookPost] = useState('');
  const [aiEmailBlurb, setAiEmailBlurb] = useState('');
  const [aiWhoIsAffected, setAiWhoIsAffected] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('normal');
  const [changeType, setChangeType] = useState<ChangeType>('other');
  const [urgency, setUrgency] = useState<UrgencyLevel>('monitor');
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('low');
  const [opportunityLevel, setOpportunityLevel] = useState<OpportunityLevel>('low');
  const [isDirty, setIsDirty] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');

  useEffect(() => {
    if (item) {
      setAiHeadline(item.aiHeadline ?? '');
      setAiSummary(item.aiSummary ?? '');
      setAiWhatThisMeans(item.aiWhatThisMeans ?? '');
      setAiOperatorTakeaway(item.aiOperatorTakeaway ?? '');
      setAiFacebookPost(item.aiFacebookPost ?? '');
      setAiEmailBlurb(item.aiEmailBlurb ?? '');
      setAiWhoIsAffected(item.aiWhoIsAffected ?? '');
      setCategory(item.category ?? '');
      setTags((item.tags ?? []).join(', '));
      setNotes(item.notes ?? '');
      setPriority(item.priority ?? 'normal');
      setChangeType(item.changeType ?? 'other');
      setUrgency(item.urgency ?? 'monitor');
      setRiskLevel(item.riskLevel ?? 'low');
      setOpportunityLevel(item.opportunityLevel ?? 'low');
      setIsDirty(false);
    }
  }, [item]);

  function markDirty() {
    setIsDirty(true);
  }

  function handleSave() {
    updateItem.mutate({
      id,
      data: {
        aiHeadline,
        aiSummary,
        aiWhatThisMeans,
        aiOperatorTakeaway,
        aiFacebookPost,
        aiEmailBlurb,
        aiWhoIsAffected,
        category,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        notes,
        priority,
        changeType,
        urgency,
        riskLevel,
        opportunityLevel,
      },
    }, {
      onSuccess: () => setIsDirty(false),
    });
  }

  function handleQuickAction(data: Record<string, any>) {
    updateItem.mutate({ id, data });
  }

  function handleReprocess() {
    reprocess.mutate(id);
  }

  function handleDelete() {
    deleteItem.mutate(id, {
      onSuccess: () => router.push(APP_ROUTES.ADMIN_INTELLIGENCE_HUB),
    });
  }

  if (itemQ.isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-[#09488B] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="p-8">
        <p className="text-[#64748B]">Item not found.</p>
        <Link href={APP_ROUTES.ADMIN_INTELLIGENCE_HUB} className="text-[#09488B] text-sm underline mt-2 block">
          Back to Hub
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Breadcrumb + back */}
      <div className="flex items-center gap-2 text-sm text-[#64748B]">
        <Link href={APP_ROUTES.ADMIN_INTELLIGENCE_HUB} className="hover:text-[#09488B]">
          Intelligence Hub
        </Link>
        <span>/</span>
        <span className="text-[#0F172A] font-medium truncate max-w-xs">{item.originalTitle}</span>
      </div>

      {/* Header row */}
      <div className="flex items-start gap-4 justify-between flex-wrap">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 flex-wrap">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_BADGE[item.status] ?? 'bg-gray-100 text-gray-500'}`}>
              {STATUS_LABEL[item.status] ?? item.status}
            </span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${PRIORITY_BADGE[item.priority]}`}>
              {item.priority} priority
            </span>
            {item.changeType && (
              <span className="text-xs font-semibold bg-[#EEF2FF] text-indigo-700 px-2 py-0.5 rounded-full">
                {CHANGE_TYPE_LABEL[item.changeType]}
              </span>
            )}
            {item.urgency && (
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${URGENCY_BADGE[item.urgency]}`}>
                {URGENCY_LABEL[item.urgency]}
              </span>
            )}
            {item.riskLevel && (
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${RISK_BADGE[item.riskLevel]}`}>
                {RISK_LABEL[item.riskLevel]}
              </span>
            )}
            {item.opportunityLevel && item.opportunityLevel !== 'low' && (
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${OPPORTUNITY_BADGE[item.opportunityLevel]}`}>
                {OPPORTUNITY_LABEL[item.opportunityLevel]}
              </span>
            )}
            {item.contentUpdated && (
              <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                Content Updated
              </span>
            )}
            {item.isArizonaSpecific && (
              <span className="text-xs font-bold text-[#09488B] bg-[#0947871A] px-2 py-0.5 rounded-full">
                Arizona Specific
              </span>
            )}
            {item.aiRelevanceScore && (
              <span className="text-xs font-semibold bg-[#F1F5F9] text-[#475569] px-2 py-0.5 rounded-full">
                Relevance: {item.aiRelevanceScore}/10
              </span>
            )}
          </div>
          {item.aiWhoIsAffected && (
            <p className="text-xs text-[#475569]">
              <span className="font-bold text-[#64748B] uppercase tracking-wide">Who's Affected:</span> {item.aiWhoIsAffected}
            </p>
          )}
          <p className="text-xs text-[#94A3B8]">
            Imported {fmtDate(item.importedAt)} · Source: {item.sourceName}
            {item.scheduledFor && ` · Scheduled for ${fmtDate(item.scheduledFor)}`}
            {item.publishedAt && ` · Published ${fmtDate(item.publishedAt)}`}
            {item.editedBy && ` · Edited by ${item.editedBy} on ${fmtDate(item.editedAt)}`}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 flex-wrap">
          {isDirty && (
            <button
              onClick={handleSave}
              disabled={updateItem.isPending}
              className="text-sm bg-[#09488B] text-white px-4 py-2 rounded-xl hover:bg-[#073a70] font-medium disabled:opacity-60"
            >
              {updateItem.isPending ? 'Saving…' : 'Save Changes'}
            </button>
          )}
          <button
            onClick={handleReprocess}
            disabled={reprocess.isPending}
            className="text-sm border border-[#E2E8F0] text-[#475569] px-4 py-2 rounded-xl hover:bg-[#F1F5F9] font-medium disabled:opacity-60"
          >
            {reprocess.isPending ? 'Processing…' : 'Re-run AI'}
          </button>
          {!item.reviewed && (
            <button
              onClick={() => handleQuickAction({ reviewed: true })}
              className="text-sm border border-blue-200 text-blue-600 px-4 py-2 rounded-xl hover:bg-blue-50 font-medium"
            >
              Mark Reviewed
            </button>
          )}
          {!item.approved && (item.status === 'pending_review' || item.status === 'processed') && (
            <button
              onClick={() => handleQuickAction({ approved: true, reviewed: true, status: 'approved' as ContentStatus })}
              className="text-sm bg-emerald-500 text-white px-4 py-2 rounded-xl hover:bg-emerald-600 font-medium"
            >
              Approve
            </button>
          )}
          {item.approved && !item.readyToPost && item.status !== 'scheduled' && item.status !== 'published' && item.status !== 'archived' && (
            <button
              onClick={() => handleQuickAction({ readyToPost: true })}
              className="text-sm bg-purple-500 text-white px-4 py-2 rounded-xl hover:bg-purple-600 font-medium"
            >
              Mark Ready to Post
            </button>
          )}
          {item.readyToPost && item.status !== 'scheduled' && item.status !== 'published' && item.status !== 'archived' && NEWSLETTER_CATEGORIES.has(item.category ?? '') && (
            <button
              onClick={() => { setShowScheduleModal(true); setScheduleDate(''); }}
              className="text-sm bg-indigo-500 text-white px-4 py-2 rounded-xl hover:bg-indigo-600 font-medium"
            >
              Schedule
            </button>
          )}
          {item.readyToPost && item.status !== 'scheduled' && item.status !== 'published' && item.status !== 'archived' && !NEWSLETTER_CATEGORIES.has(item.category ?? '') && (
            <span className="text-xs text-[#94A3B8] px-3 py-2">
              Not a newsletter category
            </span>
          )}
          {item.status === 'scheduled' && (
            <button
              onClick={() => handleQuickAction({ status: 'published' as ContentStatus })}
              className="text-sm bg-teal-500 text-white px-4 py-2 rounded-xl hover:bg-teal-600 font-medium"
            >
              Mark Published
            </button>
          )}
          {item.status === 'published' && (
            <button
              onClick={() => handleQuickAction({ status: 'archived' as ContentStatus })}
              className="text-sm bg-gray-400 text-white px-4 py-2 rounded-xl hover:bg-gray-500 font-medium"
            >
              Archive
            </button>
          )}
          {item.status !== 'rejected' && item.status !== 'published' && item.status !== 'archived' && !item.approved && (
            <button
              onClick={() => handleQuickAction({ status: 'rejected' as ContentStatus, approved: false, readyToPost: false })}
              className="text-sm border border-red-200 text-red-500 px-4 py-2 rounded-xl hover:bg-red-50 font-medium"
            >
              Reject
            </button>
          )}
        </div>
      </div>

      {/* AI error banner */}
      {reprocessError && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 flex items-start gap-3">
          <span className="text-red-500 text-lg mt-0.5">⚠</span>
          <div>
            <p className="text-sm font-semibold text-red-700">AI Processing Failed</p>
            <p className="text-sm text-red-600 mt-0.5">{reprocessError}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Raw content */}
        <div className="flex flex-col gap-4">
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 flex flex-col gap-4">
            <h2 className="text-base font-bold text-[#0F172A]">Original Article</h2>

            <div>
              <p className="text-xs font-bold text-[#64748B] uppercase tracking-wide mb-1">Original Title</p>
              <p className="text-sm text-[#0F172A] leading-relaxed">{item.originalTitle}</p>
            </div>

            {item.originalExcerpt && (
              <div>
                <p className="text-xs font-bold text-[#64748B] uppercase tracking-wide mb-1">Excerpt</p>
                <p className="text-sm text-[#475569] leading-relaxed line-clamp-6">{item.originalExcerpt}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-bold text-[#64748B] uppercase tracking-wide mb-1">Source</p>
                <p className="text-sm text-[#0F172A]">{item.sourceName}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-[#64748B] uppercase tracking-wide mb-1">Published</p>
                <p className="text-sm text-[#0F172A]">{fmtDate(item.originalPublishDate)}</p>
              </div>
            </div>

            {item.articleUrl && (
              <a
                href={item.articleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#09488B] underline break-all"
              >
                View original article ↗
              </a>
            )}
          </div>

          {/* Admin controls */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 flex flex-col gap-4">
            <h2 className="text-base font-bold text-[#0F172A]">Admin Controls</h2>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#64748B] uppercase tracking-wide">Category</label>
                <CustomSelect
                  value={category}
                  onChange={(v) => { setCategory(v); markDirty(); }}
                  placeholder="— Select —"
                  options={categories.map((c) => ({ value: c, label: c }))}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#64748B] uppercase tracking-wide">Priority</label>
                <CustomSelect
                  value={priority}
                  onChange={(v) => { setPriority(v as PriorityLevel); markDirty(); }}
                  options={[
                    { value: 'normal', label: 'Normal' },
                    { value: 'high', label: 'High' },
                    { value: 'critical', label: 'Critical' },
                  ]}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#64748B] uppercase tracking-wide">
                Change Type <span className="normal-case font-normal text-[#94A3B8]">(what kind of change this is — set by AI, editable)</span>
              </label>
              <CustomSelect
                value={changeType}
                onChange={(v) => { setChangeType(v as ChangeType); markDirty(); }}
                options={CHANGE_TYPE_OPTIONS}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#64748B] uppercase tracking-wide">Urgency</label>
                <CustomSelect
                  value={urgency}
                  onChange={(v) => { setUrgency(v as UrgencyLevel); markDirty(); }}
                  options={URGENCY_OPTIONS}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#64748B] uppercase tracking-wide">Risk Level</label>
                <CustomSelect
                  value={riskLevel}
                  onChange={(v) => { setRiskLevel(v as RiskLevel); markDirty(); }}
                  options={RISK_OPTIONS}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#64748B] uppercase tracking-wide">Opportunity</label>
                <CustomSelect
                  value={opportunityLevel}
                  onChange={(v) => { setOpportunityLevel(v as OpportunityLevel); markDirty(); }}
                  options={OPPORTUNITY_OPTIONS}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#64748B] uppercase tracking-wide">Tags (comma separated)</label>
              <input
                value={tags}
                onChange={(e) => { setTags(e.target.value); markDirty(); }}
                placeholder="compliance, staffing, arizona…"
                className="border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#09488B]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#64748B] uppercase tracking-wide">Internal Notes</label>
              <textarea
                value={notes}
                onChange={(e) => { setNotes(e.target.value); markDirty(); }}
                rows={3}
                placeholder="Add internal notes here…"
                className="border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#09488B] resize-vertical"
              />
            </div>

            {/* Status flags */}
            <div className="flex gap-3 flex-wrap">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={item.reviewed}
                  onChange={(e) => handleQuickAction({ reviewed: e.target.checked })}
                  className="w-4 h-4 accent-[#09488B]"
                />
                <span className="text-sm text-[#475569]">Reviewed</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={item.approved}
                  onChange={(e) => handleQuickAction({ approved: e.target.checked })}
                  className="w-4 h-4 accent-[#09488B]"
                />
                <span className="text-sm text-[#475569]">Approved</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={item.readyToPost}
                  onChange={(e) => handleQuickAction({ readyToPost: e.target.checked })}
                  className="w-4 h-4 accent-[#09488B]"
                />
                <span className="text-sm text-[#475569]">Ready to Post</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={item.featured}
                  onChange={(e) => handleQuickAction({ featured: e.target.checked })}
                  className="w-4 h-4 accent-[#09488B]"
                />
                <span className="text-sm text-[#475569]">Featured</span>
              </label>
            </div>

            {/* Save */}
            {isDirty && (
              <button
                onClick={handleSave}
                disabled={updateItem.isPending}
                className="w-full text-sm bg-[#09488B] text-white py-2.5 rounded-xl hover:bg-[#073a70] font-semibold disabled:opacity-60"
              >
                {updateItem.isPending ? 'Saving…' : 'Save Changes'}
              </button>
            )}

            {/* Danger */}
            <button
              onClick={handleDelete}
              className="w-full text-sm border border-red-200 text-red-400 py-2 rounded-xl hover:bg-red-50 font-medium mt-1"
            >
              Delete This Item
            </button>
          </div>
        </div>

        {/* RIGHT: AI outputs */}
        <div className="flex flex-col gap-4">
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#0F172A]">AI-Generated Content</h2>
              <button
                onClick={handleReprocess}
                disabled={reprocess.isPending}
                className="text-xs border border-[#E2E8F0] text-[#475569] px-3 py-1.5 rounded-lg hover:bg-[#F1F5F9] disabled:opacity-60"
              >
                {reprocess.isPending ? 'Processing…' : 'Re-run AI'}
              </button>
            </div>

            <EditableField
              label="Rewritten Headline"
              value={aiHeadline}
              onChange={(v) => { setAiHeadline(v); markDirty(); }}
            />

            <EditableField
              label="Short Summary (2–4 sentences)"
              value={aiSummary}
              onChange={(v) => { setAiSummary(v); markDirty(); }}
              multiline
              rows={3}
            />

            <EditableField
              label="What This Means (for owners/managers)"
              value={aiWhatThisMeans}
              onChange={(v) => { setAiWhatThisMeans(v); markDirty(); }}
              multiline
              rows={4}
            />

            <EditableField
              label="Operator Takeaway"
              value={aiOperatorTakeaway}
              onChange={(v) => { setAiOperatorTakeaway(v); markDirty(); }}
              multiline
              rows={3}
            />

            <EditableField
              label="Who Is Affected"
              value={aiWhoIsAffected}
              onChange={(v) => { setAiWhoIsAffected(v); markDirty(); }}
            />
          </div>

          {/* Facebook post */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#0F172A]">Facebook Post Draft</h2>
              {aiFacebookPost && <CopyButton text={aiFacebookPost} label="Post" />}
            </div>
            <EditableField
              label="Facebook Post"
              value={aiFacebookPost}
              onChange={(v) => { setAiFacebookPost(v); markDirty(); }}
              multiline
              rows={8}
            />
            {aiFacebookPost && (
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3">
                <p className="text-xs font-bold text-[#64748B] uppercase tracking-wide mb-2">Preview</p>
                <p className="text-sm text-[#0F172A] leading-relaxed whitespace-pre-wrap">{aiFacebookPost}</p>
              </div>
            )}
          </div>

          {/* Email blurb */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#0F172A]">Email Blurb</h2>
              {aiEmailBlurb && <CopyButton text={aiEmailBlurb} label="Blurb" />}
            </div>
            <EditableField
              label="Email Blurb"
              value={aiEmailBlurb}
              onChange={(v) => { setAiEmailBlurb(v); markDirty(); }}
              multiline
              rows={4}
            />
          </div>
        </div>
      </div>

      {/* Schedule modal */}
      {showScheduleModal && (
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
                onClick={() => setShowScheduleModal(false)}
                className="text-sm border border-[#E2E8F0] text-[#475569] px-4 py-2 rounded-xl hover:bg-[#F1F5F9]"
              >
                Cancel
              </button>
              <button
                disabled={!scheduleDate || updateItem.isPending}
                onClick={() => {
                  handleQuickAction({ status: 'scheduled' as ContentStatus, scheduledFor: new Date(scheduleDate).toISOString() });
                  setShowScheduleModal(false);
                }}
                className="text-sm bg-indigo-500 text-white px-4 py-2 rounded-xl hover:bg-indigo-600 disabled:opacity-40"
              >
                Confirm Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
