'use client';
import React, { useState } from 'react';
import { useUsers, usePendingUsers, useApproveUser, useToggleUserStatus, useResetPassword } from '@/hooks/useUsers';
import type { User } from '@/types/user.types';

const ROLE_BADGE: Record<string, string> = {
  admin: 'bg-purple-100 text-purple-700',
  facility: 'bg-blue-100 text-blue-700',
  vendor: 'bg-teal-100 text-teal-700',
};

function UserRow({ user, onApprove, onToggle, onReset }: {
  user: User;
  onApprove: (id: string) => void;
  onToggle: (id: string, active: boolean) => void;
  onReset: (id: string) => void;
}) {
  const name = [user.firstName, user.lastName].filter(Boolean).join(' ') || '—';
  return (
    <tr className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC]">
      <td className="py-3 px-4">
        <p className="text-sm font-semibold text-[#0F172A]">{name}</p>
        <p className="text-xs text-[#64748B]">{user.email}</p>
      </td>
      <td className="py-3 px-4">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${ROLE_BADGE[user.role]}`}>{user.role}</span>
      </td>
      <td className="py-3 px-4">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500'}`}>
          {user.isActive ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td className="py-3 px-4">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${user.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
          {user.isApproved ? 'Approved' : 'Pending'}
        </span>
      </td>
      <td className="py-3 px-4 text-xs text-[#64748B]">
        {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
      </td>
      <td className="py-3 px-4">
        <div className="flex gap-2 flex-wrap">
          {!user.isApproved && (
            <button onClick={() => onApprove(user._id)} className="text-xs bg-[#09488B] text-white px-2 py-1 rounded-lg hover:bg-[#073a70]">Approve</button>
          )}
          <button onClick={() => onToggle(user._id, !user.isActive)}
            className={`text-xs px-2 py-1 rounded-lg border ${user.isActive ? 'border-red-300 text-red-500 hover:bg-red-50' : 'border-green-300 text-green-600 hover:bg-green-50'}`}>
            {user.isActive ? 'Deactivate' : 'Activate'}
          </button>
          <button onClick={() => onReset(user._id)} className="text-xs border border-[#E2E8F0] text-[#475569] px-2 py-1 rounded-lg hover:bg-[#F1F5F9]">Reset PW</button>
        </div>
      </td>
    </tr>
  );
}

export default function AdminUsersPage() {
  const [tab, setTab] = useState<'all' | 'pending'>('all');
  const [search, setSearch] = useState('');

  const allQuery = useUsers();
  const pendingQuery = usePendingUsers();
  const approve = useApproveUser();
  const toggle = useToggleUserStatus();
  const reset = useResetPassword();

  const source = tab === 'pending' ? (pendingQuery.data ?? []) : (allQuery.data ?? []);
  const filtered = source.filter(u =>
    u.role !== 'admin' &&
    (u.email.toLowerCase().includes(search.toLowerCase()) ||
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase()))
  );

  const isLoading = allQuery.isLoading || pendingQuery.isLoading;
  const isError = allQuery.isError || pendingQuery.isError;

  return (
    <div className="p-8 flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-black text-[#0F172A]">User Management</h1>
        <p className="text-[#64748B] mt-1">Approve, activate, deactivate and manage all users.</p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex bg-[#F1F5F9] rounded-xl p-1 gap-0">
          {(['all', 'pending'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${tab === t ? 'bg-white text-[#09488B] shadow-sm' : 'text-[#64748B]'}`}>
              {t === 'all' ? 'All Users' : `Pending (${pendingQuery.data?.length ?? 0})`}
            </button>
          ))}
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email…"
          className="border border-[#E2E8F0] rounded-xl px-4 py-2 text-sm outline-none focus:border-[#09488B] w-64" />
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-32"><div className="w-8 h-8 border-4 border-[#09488B] border-t-transparent rounded-full animate-spin" /></div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center h-32 gap-3">
            <p className="text-sm font-semibold text-red-500">Failed to load users.</p>
            <button onClick={() => { allQuery.refetch(); pendingQuery.refetch(); }} className="text-xs font-semibold text-[#09488B] hover:underline">Retry</button>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <tr>
                {['Name / Email', 'Role', 'Status', 'Approval', 'Last Login', 'Actions'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-bold text-[#64748B] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <UserRow key={u._id} user={u}
                  onApprove={(id) => approve.mutate(id)}
                  onToggle={(id, active) => toggle.mutate({ id, active })}
                  onReset={(id) => reset.mutate(id)} />
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center py-10 text-[#94A3B8] text-sm">No users found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
