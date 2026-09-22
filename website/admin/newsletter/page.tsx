'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { APP_ROUTES } from '@/api/endpoints';
import { useIHItems, useUpdateItem } from '@/hooks/useIntelligenceHub';
import type { ContentItem, ContentStatus } from '@/types/intelligence-hub.types';

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const NEWSLETTER_CATEGORIES = [
  'All',
  'Compliance & Regulatory',
  'Staffing & Caregiver News',
  'Industry News & Operations',
  'Emergency & Safety Alerts',
  'Law / Policy / ALTCS Updates',
];

function fmtDate(iso?: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="text-[10px] font-semibold text-[#09488B] bg-[#E8F1FB] border border-[#09488B20] px-2 py-0.5 rounded hover:bg-[#dbeafe] transition-colors whitespace-nowrap"
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

// ─── CONTENT CARD ─────────────────────────────────────────────────────────────

function ContentCard({
  item,
  onPublish,
  onArchive,
  onMoveBack,
  onReschedule,
}: {
  item: ContentItem;
  onPublish: () => void;
  onArchive: () => void;
  onMoveBack: () => void;
  onReschedule: (date: string) => void;
}) {
  const [rescheduleMode, setRescheduleMode] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm">
      {/* Card header */}
      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              {item.category && (
                <span className="text-[10px] font-bold text-[#09488B] bg-[#E8F1FB] px-2 py-0.5 rounded-full">
                  {item.category}
                </span>
              )}
              {item.isArizonaSpecific && (
                <span className="text-[10px] font-bold text-white bg-[#09488B] px-2 py-0.5 rounded-full">
                  AZ
                </span>
              )}
              {item.aiRelevanceScore && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  item.aiRelevanceScore >= 7 ? 'bg-green-100 text-green-700' :
                  item.aiRelevanceScore >= 4 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-500'
                }`}>
                  Score: {item.aiRelevanceScore}/10
                </span>
              )}
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                item.status === 'published' ? 'bg-teal-100 text-teal-700' : 'bg-indigo-100 text-indigo-700'
              }`}>
                {item.status === 'published' ? 'Published' : 'Scheduled'}
              </span>
            </div>
            <h3 className="text-sm font-bold text-[#0F172A] leading-snug line-clamp-2">
              {item.aiHeadline || item.originalTitle}
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              {item.sourceName} · {fmtDate(item.originalPublishDate || item.importedAt)}
            </p>
            {item.scheduledFor && (
              <p className="text-xs font-semibold text-indigo-600 mt-0.5">
                Newsletter issue: {fmtDate(item.scheduledFor)}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5 shrink-0">
            {item.status === 'scheduled' && (
              <button
                onClick={onPublish}
                className="text-xs bg-teal-500 text-white px-3 py-1.5 rounded-lg hover:bg-teal-600 font-medium whitespace-nowrap"
              >
                Mark Published
              </button>
            )}
            {item.status === 'scheduled' && !rescheduleMode && (
              <button
                onClick={() => { setRescheduleMode(true); setNewDate(''); }}
                className="text-xs border border-indigo-200 text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-50 font-medium whitespace-nowrap"
              >
                Change Date
              </button>
            )}
            {item.status === 'published' && (
              <button
                onClick={onArchive}
                className="text-xs bg-gray-400 text-white px-3 py-1.5 rounded-lg hover:bg-gray-500 font-medium whitespace-nowrap"
              >
                Archive
              </button>
            )}
            <button
              onClick={onMoveBack}
              className="text-xs border border-[#E2E8F0] text-[#475569] px-3 py-1.5 rounded-lg hover:bg-[#F1F5F9] font-medium whitespace-nowrap"
            >
              Move Back
            </button>
            <Link
              href={APP_ROUTES.ADMIN_INTELLIGENCE_HUB_ITEM(item._id)}
              className="text-xs text-center border border-[#09488B20] text-[#09488B] px-3 py-1.5 rounded-lg hover:bg-[#E8F1FB] font-medium whitespace-nowrap"
            >
              Edit Full
            </Link>
          </div>
        </div>

        {/* AI Summary preview */}
        {item.aiSummary && (
          <p className="text-sm text-[#475569] leading-relaxed line-clamp-3">{item.aiSummary}</p>
        )}

        <button
          onClick={() => setExpanded((p) => !p)}
          className="text-xs text-[#09488B] font-semibold self-start hover:underline"
        >
          {expanded ? 'Hide newsletter content ↑' : 'Show newsletter content ↓'}
        </button>

        {rescheduleMode && (
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="h-8 border border-[#E2E8F0] rounded-lg px-2 text-xs outline-none focus:border-indigo-400"
            />
            <button
              disabled={!newDate}
              onClick={() => { onReschedule(new Date(newDate).toISOString()); setRescheduleMode(false); }}
              className="text-xs bg-indigo-500 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-600 disabled:opacity-40"
            >
              Confirm
            </button>
            <button
              onClick={() => setRescheduleMode(false)}
              className="text-xs border border-[#E2E8F0] text-[#475569] px-3 py-1.5 rounded-lg hover:bg-[#F1F5F9]"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Expanded newsletter content blocks */}
      {expanded && (
        <div className="border-t border-[#F1F5F9] p-4 flex flex-col gap-4 bg-[#FAFBFC]">

          {/* Summary */}
          {item.aiSummary && (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-[#64748B] uppercase tracking-wide">Summary</p>
                <CopyButton text={item.aiSummary} />
              </div>
              <p className="text-sm text-[#0F172A] leading-relaxed bg-white border border-[#E2E8F0] rounded-lg p-3">
                {item.aiSummary}
              </p>
            </div>
          )}

          {/* What This Means */}
          {item.aiWhatThisMeans && (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-[#64748B] uppercase tracking-wide">What This Means for Operators</p>
                <CopyButton text={item.aiWhatThisMeans} />
              </div>
              <p className="text-sm text-[#0F172A] leading-relaxed bg-white border border-[#E2E8F0] rounded-lg p-3">
                {item.aiWhatThisMeans}
              </p>
            </div>
          )}

          {/* Operator Takeaway */}
          {item.aiOperatorTakeaway && (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-[#64748B] uppercase tracking-wide">Operator Takeaway</p>
                <CopyButton text={item.aiOperatorTakeaway} />
              </div>
              <p className="text-sm text-[#0F172A] leading-relaxed bg-white border border-[#E2E8F0] rounded-lg p-3">
                {item.aiOperatorTakeaway}
              </p>
            </div>
          )}

          {/* Email Blurb */}
          {item.aiEmailBlurb && (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-[#64748B] uppercase tracking-wide">Email Newsletter Blurb</p>
                <CopyButton text={item.aiEmailBlurb} />
              </div>
              <p className="text-sm text-[#0F172A] leading-relaxed bg-white border border-[#E2E8F0] rounded-lg p-3 whitespace-pre-wrap">
                {item.aiEmailBlurb}
              </p>
            </div>
          )}

          {/* Source link */}
          <div className="flex items-center gap-2">
            <p className="text-xs text-[#94A3B8]">Original article:</p>
            <a
              href={item.articleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#09488B] hover:underline truncate max-w-xs"
            >
              {item.articleUrl}
            </a>
            <CopyButton text={item.articleUrl} />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function AdminNewsletterPage() {
  const [activeTab, setActiveTab] = useState<'scheduled' | 'published'>('scheduled');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  // Platform links follow whatever domain the dashboard is served from.
  const [origin, setOrigin] = useState('https://ral-connect-dashboard.vercel.app');
  useEffect(() => setOrigin(window.location.origin), []);

  const scheduledQ = useIHItems({ status: 'scheduled', limit: 100 });
  const publishedQ = useIHItems({ status: 'published', limit: 100 });
  const updateItem = useUpdateItem();

  const activeItems = (activeTab === 'scheduled' ? scheduledQ.data?.items : publishedQ.data?.items) ?? [];

  const filtered = activeItems
    .filter((item) => categoryFilter === 'All' || item.category === categoryFilter)
    .filter((item) => !dateFilter || item.scheduledFor?.startsWith(dateFilter));

  const scheduledCount = scheduledQ.data?.total ?? 0;
  const publishedCount = publishedQ.data?.total ?? 0;

  return (
    <div className="p-8 flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-black text-[#0F172A]">Newsletter Staging</h1>
          <p className="text-[#64748B] mt-1">
            Review and copy approved content before publishing your Beehiiv newsletter.
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Link
            href={APP_ROUTES.ADMIN_INTELLIGENCE_HUB}
            className="text-sm border border-[#E2E8F0] text-[#475569] px-4 py-2 rounded-xl hover:bg-[#F1F5F9] font-medium"
          >
            ← Back to Intelligence Hub
          </Link>
        </div>
      </div>

      {/* Quick Links — Vendor Portal + Deal Room */}
      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4">
        <p className="text-xs font-bold text-[#64748B] uppercase tracking-wide mb-3">
          Platform Links — include these in your newsletter
        </p>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white border border-[#E2E8F0] rounded-lg px-3 py-2">
            <span className="text-xs font-semibold text-[#0F172A]">Vendor Portal:</span>
            <code className="text-xs text-[#09488B] bg-[#E8F1FB] px-2 py-0.5 rounded">
              {origin}/vendor
            </code>
            <CopyButton text={`${origin}/vendor`} />
          </div>
          <div className="flex items-center gap-2 bg-white border border-[#E2E8F0] rounded-lg px-3 py-2">
            <span className="text-xs font-semibold text-[#0F172A]">Deal Room:</span>
            <code className="text-xs text-[#09488B] bg-[#E8F1FB] px-2 py-0.5 rounded">
              {origin}/dashboard/deal-room
            </code>
            <CopyButton text={`${origin}/dashboard/deal-room`} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#F1F5F9] p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('scheduled')}
          className={`text-sm font-semibold px-5 py-2 rounded-lg transition-all ${
            activeTab === 'scheduled'
              ? 'bg-white text-[#09488B] shadow-sm'
              : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          Scheduled
          <span className={`ml-2 text-xs font-bold px-1.5 py-0.5 rounded-full ${
            activeTab === 'scheduled' ? 'bg-indigo-100 text-indigo-700' : 'bg-[#E2E8F0] text-[#64748B]'
          }`}>
            {scheduledCount}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('published')}
          className={`text-sm font-semibold px-5 py-2 rounded-lg transition-all ${
            activeTab === 'published'
              ? 'bg-white text-[#09488B] shadow-sm'
              : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          Published
          <span className={`ml-2 text-xs font-bold px-1.5 py-0.5 rounded-full ${
            activeTab === 'published' ? 'bg-teal-100 text-teal-700' : 'bg-[#E2E8F0] text-[#64748B]'
          }`}>
            {publishedCount}
          </span>
        </button>
      </div>

      {/* Newsletter date filter */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-[#64748B] uppercase tracking-wide whitespace-nowrap">Filter by Issue Date</label>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="h-9 border border-[#E2E8F0] rounded-lg px-3 text-sm outline-none focus:border-[#09488B]"
          />
        </div>
        {dateFilter && (
          <button
            onClick={() => setDateFilter('')}
            className="text-xs border border-[#E2E8F0] text-[#475569] px-3 py-1.5 rounded-lg hover:bg-[#F1F5F9]"
          >
            Clear date
          </button>
        )}
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2">
        {NEWSLETTER_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
              categoryFilter === cat
                ? 'bg-[#09488B] text-white border-[#09488B]'
                : 'bg-white text-[#475569] border-[#E2E8F0] hover:border-[#09488B] hover:text-[#09488B]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Content list */}
      {(activeTab === 'scheduled' ? scheduledQ.isLoading : publishedQ.isLoading) ? (
        <div className="flex flex-col gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-[#E2E8F0] rounded-xl p-4">
              <div className="h-4 bg-[#F1F5F9] rounded w-3/4 animate-pulse mb-2" />
              <div className="h-3 bg-[#F1F5F9] rounded w-1/2 animate-pulse mb-3" />
              <div className="h-3 bg-[#F1F5F9] rounded w-full animate-pulse" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-12 text-center">
          <p className="text-[#94A3B8] text-sm">
            {activeTab === 'scheduled'
              ? 'No scheduled content yet. Go to Intelligence Hub, approve items, mark them Ready, then Schedule them.'
              : 'No published content yet.'}
          </p>
          <Link
            href={APP_ROUTES.ADMIN_INTELLIGENCE_HUB}
            className="mt-4 inline-block text-sm text-[#09488B] font-semibold hover:underline"
          >
            Go to Intelligence Hub →
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((item) => (
            <ContentCard
              key={item._id}
              item={item}
              onPublish={() => updateItem.mutate({ id: item._id, data: { status: 'published' as ContentStatus } })}
              onArchive={() => updateItem.mutate({ id: item._id, data: { status: 'archived' as ContentStatus } })}
              onMoveBack={() => updateItem.mutate({ id: item._id, data: { status: 'approved' as ContentStatus, readyToPost: true } })}
              onReschedule={(date) => updateItem.mutate({ id: item._id, data: { scheduledFor: date } })}
            />
          ))}
        </div>
      )}
    </div>
  );
}
