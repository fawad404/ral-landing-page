"use client";
import Header from "@/components/global/header";
import React, { useState } from "react";
import { useArizonaUpdates } from "@/hooks/useArizonaUpdates";
import type { ArizonaUpdate } from "@/services/arizonaUpdatesService";

// Owner-facing view of the Intelligence Hub (Patrick's review 2026-09-24).
// Shows only items an admin has approved. No alerts or emails yet, so the copy
// tells owners to check back here.

const URGENCY: Record<string, { label: string; css: string }> = {
  immediate: { label: "Act now", css: "bg-[#EF44441A] text-[#EF4444]" },
  this_week: { label: "This week", css: "bg-[#F59E0B1A] text-[#B45309]" },
  monitor: { label: "Keep an eye on it", css: "bg-[#09488B1A] text-[#09488B]" },
  no_action: { label: "For your information", css: "bg-[#F1F5F9] text-[#64748B]" },
};

const formatDate = (d?: string) =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";

const Section = ({ label, text }: { label: string; text?: string }) =>
  text ? (
    <div className="flex flex-col gap-1">
      <p className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">{label}</p>
      <p className="text-sm text-[#334155] leading-relaxed">{text}</p>
    </div>
  ) : null;

const UpdateCard = ({ item }: { item: ArizonaUpdate }) => {
  const urgency = item.urgency ? URGENCY[item.urgency] : undefined;
  const date = formatDate(item.publishedAt || item.originalPublishDate || item.createdAt);
  return (
    <article className="bg-white rounded-2xl border border-solid border-[#E2E8F0] shadow-[0px_1px_2px_0px_#0000000D] p-6 flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2 text-xs text-[#64748B]">
        {urgency && <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${urgency.css}`}>{urgency.label}</span>}
        {item.category && <span className="font-semibold text-[#09488B]">{item.category}</span>}
        <span>{item.sourceName}</span>
        {date && <span>· {date}</span>}
      </div>
      <h2 className="text-lg font-bold text-[#0F172A] leading-snug">{item.aiHeadline || item.originalTitle}</h2>
      <Section label="What changed" text={item.aiSummary} />
      <Section label="Who it may affect" text={item.aiWhoIsAffected || item.aiWhatThisMeans} />
      <Section label="What to do" text={item.aiOperatorTakeaway} />
      <a
        href={item.articleUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-fit text-sm font-semibold text-[#09488B] hover:underline"
      >
        Read the source →
      </a>
    </article>
  );
};

const ArizonaUpdatesComponent = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useArizonaUpdates(page);
  const items = data?.items ?? [];
  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1;

  return (
    <div className="w-full h-full flex flex-col gap-8 p-10">
      <Header
        title="Arizona Updates"
        description="Regulatory, inspection and industry news for Arizona RAL owners, reviewed by the RAL Connect team."
      />

      <div className="bg-[#F8FAFC] border border-solid border-[#E2E8F0] rounded-xl px-5 py-4 text-sm text-[#475569] max-w-3xl">
        We collect updates from 22 industry sources, and our team picks the ones that matter to Arizona RAL owners.
        New updates are added here. We don&apos;t send email alerts yet, so check back regularly.
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="w-8 h-8 border-4 border-[#09488B] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : isError ? (
        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 flex items-center justify-between max-w-3xl">
          <p className="text-sm font-semibold text-red-700">Couldn&apos;t load Arizona Updates.</p>
          <button onClick={() => refetch()} className="text-sm font-semibold text-red-700 hover:underline">Try again</button>
        </div>
      ) : items.length === 0 ? (
        <div className="py-16 flex flex-col items-center gap-2 text-center max-w-3xl">
          <p className="text-base font-semibold text-[#475569]">No updates published yet</p>
          <p className="text-sm text-[#94A3B8] max-w-md">
            When our team approves an update about Arizona regulations, inspections, licensing or the RAL industry, it
            will appear here with what changed, who it may affect and what to do.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-5 max-w-3xl">
          {items.map((item) => (
            <UpdateCard key={item._id} item={item} />
          ))}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="text-sm font-semibold text-[#09488B] disabled:text-[#CBD5E1]"
              >
                ← Newer
              </button>
              <span className="text-xs text-[#94A3B8]">Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="text-sm font-semibold text-[#09488B] disabled:text-[#CBD5E1]"
              >
                Older →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ArizonaUpdatesComponent;
