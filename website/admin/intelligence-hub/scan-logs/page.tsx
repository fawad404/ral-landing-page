'use client';
import React, { useState } from 'react';
import CustomSelect from '@/components/global/CustomSelect';
import Link from 'next/link';
import { APP_ROUTES } from '@/api/endpoints';
import { useScanLogs } from '@/hooks/useIntelligenceHub';
import { useIHSources } from '@/hooks/useIntelligenceHub';
import type { ScanLogFilters, ScanOutcome } from '@/types/intelligence-hub.types';

const OUTCOME_COLOR: Record<ScanOutcome, string> = {
  success: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
};

function formatDateTime(value: string) {
  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminIntelligenceHubScanLogsPage() {
  const [sourceId, setSourceId] = useState('');
  const [outcome, setOutcome] = useState<ScanOutcome | ''>('');
  const [page, setPage] = useState(1);

  const sourcesQ = useIHSources();
  const sources = sourcesQ.data ?? [];

  const filters: ScanLogFilters = { sourceId: sourceId || undefined, outcome: outcome || undefined, page, limit: 30 };
  const logsQ = useScanLogs(filters);
  const data = logsQ.data;
  const logs = data?.logs ?? [];

  function resetPage() {
    setPage(1);
  }

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
            <span className="text-[#0F172A] font-medium">Scan History</span>
          </div>
          <h1 className="text-3xl font-black text-[#0F172A]">Scan History</h1>
          <p className="text-[#64748B] mt-1">
            Every scan attempt across all sources — which ran, which failed, and what they produced.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="w-56">
          <CustomSelect
            value={sourceId}
            onChange={(v) => { setSourceId(v); resetPage(); }}
            placeholder="All Sources"
            options={[{ value: '', label: 'All Sources' }, ...sources.map((s) => ({ value: s._id, label: s.name }))]}
          />
        </div>
        <div className="w-44">
          <CustomSelect
            value={outcome}
            onChange={(v) => { setOutcome(v as ScanOutcome | ''); resetPage(); }}
            placeholder="All Outcomes"
            options={[
              { value: '', label: 'All Outcomes' },
              { value: 'success', label: 'Success' },
              { value: 'failed', label: 'Failed' },
            ]}
          />
        </div>
        {data && <span className="text-xs text-[#64748B] ml-auto">{data.total} scan(s) logged</span>}
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
        {logsQ.isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="w-8 h-8 border-4 border-[#09488B] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                <tr>
                  {['Source', 'Scanned At', 'Trigger', 'Outcome', 'Imported', 'Modified', 'Already Exists', 'Not Relevant', 'Details'].map((h) => (
                    <th key={h} className="text-left py-2 px-4 text-xs font-bold text-[#94A3B8] uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log._id} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC]">
                    <td className="py-3 px-4 text-sm font-semibold text-[#0F172A]">{log.sourceName}</td>
                    <td className="py-3 px-4 text-xs text-[#64748B]">{formatDateTime(log.scannedAt)}</td>
                    <td className="py-3 px-4">
                      <span className="text-xs text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded-full">
                        {log.triggeredManually ? 'Manual' : 'Automatic'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${OUTCOME_COLOR[log.outcome]}`}>
                        {log.outcome}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-[#475569]">{log.imported}</td>
                    <td className="py-3 px-4 text-sm text-[#475569]">{log.modified}</td>
                    <td className="py-3 px-4 text-sm text-[#475569]">{log.alreadyExists}</td>
                    <td className="py-3 px-4 text-sm text-[#475569]">{log.notRelevant}</td>
                    <td className="py-3 px-4 text-xs text-red-500 max-w-[220px] truncate" title={log.errorMessage}>
                      {log.errorMessage ?? '—'}
                    </td>
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr>
                    <td colSpan={9} className="text-center py-6 text-[#94A3B8] text-sm">
                      No scan history yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="text-sm border border-[#E2E8F0] text-[#475569] px-3 py-1.5 rounded-lg hover:bg-[#F1F5F9] disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-xs text-[#64748B]">
            Page {data.page} of {data.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
            disabled={page >= data.totalPages}
            className="text-sm border border-[#E2E8F0] text-[#475569] px-3 py-1.5 rounded-lg hover:bg-[#F1F5F9] disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
