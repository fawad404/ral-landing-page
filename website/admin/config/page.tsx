'use client';
import React, { useEffect, useState } from 'react';
import { useAdminConfig, useUpdateAdminConfig } from '@/hooks/useAdminConfig';

export default function AdminConfigPage() {
  const { data: config, isLoading } = useAdminConfig();
  const updateConfig = useUpdateAdminConfig();

  const [weights, setWeights] = useState({ distance: 0.4, services: 0.4, budget: 0.2 });
  const [maxResults, setMaxResults] = useState(10);
  const [defaultLimit, setDefaultLimit] = useState(5);
  const [categoryLimits, setCategoryLimits] = useState<Record<string, number>>({});
  const [newCatKey, setNewCatKey] = useState('');
  const [newCatVal, setNewCatVal] = useState('5');

  useEffect(() => {
    if (config) {
      setWeights(config.matchingWeights ?? { distance: 0.4, services: 0.4, budget: 0.2 });
      setMaxResults(config.maxMatchResults ?? 10);
      setDefaultLimit(config.defaultCategoryLimit ?? 5);
      setCategoryLimits(config.categoryLimits ?? {});
    }
  }, [config]);

  const weightSum = +(weights.distance + weights.services + weights.budget).toFixed(2);
  const isValid = weightSum === 1.0;

  const handleSaveWeights = () => {
    updateConfig.mutate({ matchingWeights: weights, maxMatchResults: maxResults });
  };

  const handleSaveLimits = () => {
    updateConfig.mutate({ categoryLimits, defaultCategoryLimit: defaultLimit });
  };

  const addCategory = () => {
    if (!newCatKey.trim()) return;
    setCategoryLimits(prev => ({ ...prev, [newCatKey.toLowerCase().trim()]: Number(newCatVal) || 5 }));
    setNewCatKey('');
    setNewCatVal('5');
  };

  const removeCategory = (key: string) => {
    setCategoryLimits(prev => { const n = { ...prev }; delete n[key]; return n; });
  };

  if (isLoading) return (
    <div className="p-8 flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-[#09488B] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-8 flex flex-col gap-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-black text-[#0F172A]">Platform Configuration</h1>
        <p className="text-[#64748B] mt-1">Configure matching weights, category limits and matching settings.</p>
      </div>

      {/* Matching Weights */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 flex flex-col gap-5">
        <div>
          <p className="font-bold text-[#0F172A]">Matching Algorithm Weights</p>
          <p className="text-sm text-[#64748B] mt-0.5">Controls how inquiries are matched to facilities. All three weights must sum to 1.0.</p>
        </div>

        {(['distance', 'services', 'budget'] as const).map(key => (
          <div key={key} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-[#475569] capitalize">{key} Match Weight</label>
              <span className={`text-sm font-bold ${weights[key] > 0 ? 'text-[#09488B]' : 'text-[#94A3B8]'}`}>
                {(weights[key] * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range" min={0} max={1} step={0.05}
              value={weights[key]}
              onChange={e => setWeights(prev => ({ ...prev, [key]: +e.target.value }))}
              className="w-full accent-[#09488B]"
            />
          </div>
        ))}

        <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold ${isValid ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-500'}`}>
          {isValid ? '✓' : '✗'} Weight total: {(weightSum * 100).toFixed(0)}% {!isValid && '— must equal 100%'}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-[#475569]">Max Match Results</label>
          <input type="number" min={1} max={50} value={maxResults} onChange={e => setMaxResults(Number(e.target.value))}
            className="border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#09488B] w-32" />
        </div>

        <button onClick={handleSaveWeights} disabled={!isValid || updateConfig.isPending}
          className="w-full bg-[#09488B] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#073a70] disabled:opacity-50">
          {updateConfig.isPending ? 'Saving…' : 'Save Matching Configuration'}
        </button>
      </div>

      {/* Category Limits */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 flex flex-col gap-5">
        <div>
          <p className="font-bold text-[#0F172A]">Partner Category Limits</p>
          <p className="text-sm text-[#64748B] mt-0.5">Set the maximum number of partners allowed per category.</p>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-[#475569]">Default Limit (fallback for unconfigured categories)</label>
          <input type="number" min={1} value={defaultLimit} onChange={e => setDefaultLimit(Number(e.target.value))}
            className="border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#09488B] w-32" />
        </div>

        <div className="flex flex-col gap-2">
          {Object.entries(categoryLimits).map(([cat, lim]) => (
            <div key={cat} className="flex items-center gap-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5">
              <span className="text-sm font-semibold text-[#0F172A] flex-1 capitalize">{cat}</span>
              <input type="number" min={1} value={lim}
                onChange={e => setCategoryLimits(prev => ({ ...prev, [cat]: Number(e.target.value) }))}
                className="w-20 border border-[#E2E8F0] rounded-lg px-2 py-1 text-sm outline-none focus:border-[#09488B] text-center" />
              <button onClick={() => removeCategory(cat)} className="text-red-400 hover:text-red-600 text-sm font-bold">×</button>
            </div>
          ))}
        </div>

        {/* Add new category */}
        <div className="flex gap-3">
          <input value={newCatKey} onChange={e => setNewCatKey(e.target.value)} placeholder="Category name (e.g. home-health)"
            className="flex-1 border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#09488B]" />
          <input type="number" value={newCatVal} onChange={e => setNewCatVal(e.target.value)} min={1}
            className="w-20 border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#09488B] text-center" />
          <button onClick={addCategory} className="bg-[#F1F5F9] text-[#09488B] font-semibold px-4 py-2.5 rounded-xl text-sm hover:bg-[#E2E8F0]">
            + Add
          </button>
        </div>

        <button onClick={handleSaveLimits} disabled={updateConfig.isPending}
          className="w-full bg-[#09488B] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#073a70] disabled:opacity-50">
          {updateConfig.isPending ? 'Saving…' : 'Save Category Limits'}
        </button>
      </div>
    </div>
  );
}
