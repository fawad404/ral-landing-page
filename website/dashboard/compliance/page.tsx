'use client';
import React, { Suspense, useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import ConfirmDeleteModal from '@/components/global/ConfirmDeleteModal';
import CustomSelect from '@/components/global/CustomSelect';
import { useMyFacilities } from '@/hooks/useFacilities';
import {
  useComplianceStats,
  useComplianceTasks,
  useCreateTask,
  useUpdateTask,
  useCompleteTask,
  useDeleteTask,
  useComplianceIncidents,
  useCreateIncident,
  useUpdateIncident,
  useDeleteIncident,
  useStaffCredentials,
  useCreateCredential,
  useUpdateCredential,
  useDeleteCredential,
} from '@/hooks/useCompliance';
import type {
  ComplianceTask,
  ComplianceIncident,
  StaffCredential,
  TaskCategory,
  TaskPriority,
  TaskStatus,
  IncidentType,
  IncidentSeverity,
  IncidentStatus,
  CredentialType,
} from '@/types/compliance.types';

// ─── Constants ────────────────────────────────────────────────────────────────

const TASK_CATEGORIES: { value: TaskCategory; label: string }[] = [
  { value: 'documentation', label: 'Documentation' },
  { value: 'staffing', label: 'Staffing' },
  { value: 'medication', label: 'Medication' },
  { value: 'safety', label: 'Safety' },
  { value: 'training', label: 'Training' },
  { value: 'survey_prep', label: 'Survey Prep' },
  { value: 'infection_control', label: 'Infection Control' },
  { value: 'resident_care', label: 'Resident Care' },
  { value: 'other', label: 'Other' },
];

const TASK_PRIORITIES: { value: TaskPriority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: '#64748B' },
  { value: 'medium', label: 'Medium', color: '#F59E0B' },
  { value: 'high', label: 'High', color: '#F97316' },
  { value: 'critical', label: 'Critical', color: '#EF4444' },
];

const TASK_STATUSES: { value: TaskStatus; label: string; color: string; bg: string }[] = [
  { value: 'open', label: 'Open', color: '#3B82F6', bg: '#EFF6FF' },
  { value: 'in_progress', label: 'In Progress', color: '#F59E0B', bg: '#FFFBEB' },
  { value: 'completed', label: 'Completed', color: '#10B981', bg: '#ECFDF5' },
  { value: 'overdue', label: 'Overdue', color: '#EF4444', bg: '#FEF2F2' },
];

const INCIDENT_TYPES: { value: IncidentType; label: string }[] = [
  { value: 'fall', label: 'Fall' },
  { value: 'medication_error', label: 'Medication Error' },
  { value: 'elopement', label: 'Elopement' },
  { value: 'abuse_neglect', label: 'Abuse / Neglect' },
  { value: 'injury', label: 'Injury' },
  { value: 'illness_outbreak', label: 'Illness Outbreak' },
  { value: 'property_damage', label: 'Property Damage' },
  { value: 'behavioral', label: 'Behavioral' },
  { value: 'other', label: 'Other' },
];

const INCIDENT_SEVERITIES: { value: IncidentSeverity; label: string; color: string; bg: string }[] = [
  { value: 'minor', label: 'Minor', color: '#64748B', bg: '#F1F5F9' },
  { value: 'moderate', label: 'Moderate', color: '#F59E0B', bg: '#FFFBEB' },
  { value: 'serious', label: 'Serious', color: '#F97316', bg: '#FFF7ED' },
  { value: 'critical', label: 'Critical', color: '#EF4444', bg: '#FEF2F2' },
];

const INCIDENT_STATUSES: { value: IncidentStatus; label: string; color: string; bg: string }[] = [
  { value: 'open', label: 'Open', color: '#EF4444', bg: '#FEF2F2' },
  { value: 'under_review', label: 'Under Review', color: '#F59E0B', bg: '#FFFBEB' },
  { value: 'resolved', label: 'Resolved', color: '#10B981', bg: '#ECFDF5' },
  { value: 'reported_to_adhs', label: 'Reported to ADHS', color: '#8B5CF6', bg: '#F5F3FF' },
];

const CREDENTIAL_TYPES: { value: CredentialType; label: string }[] = [
  { value: 'fingerprint_clearance', label: 'Fingerprint Clearance Card' },
  { value: 'cpr_first_aid', label: 'CPR / First Aid' },
  { value: 'tb_test', label: 'TB Test' },
  { value: 'food_handler', label: 'Food Handler Card' },
  { value: 'alzheimers_training', label: "Alzheimer's Training" },
  { value: 'manager_certification', label: 'Manager Certification' },
  { value: 'cna', label: 'CNA Certificate' },
  { value: 'medication_aide', label: 'Medication Aide' },
  { value: 'direct_care_worker', label: 'Direct Care Worker' },
  { value: 'other', label: 'Other' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(d?: string) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function daysUntil(d?: string) {
  if (!d) return null;
  const diff = Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
  return diff;
}

function getTaskStatus(s: TaskStatus) {
  return TASK_STATUSES.find((x) => x.value === s) ?? TASK_STATUSES[0];
}

function getPriority(p: TaskPriority) {
  return TASK_PRIORITIES.find((x) => x.value === p) ?? TASK_PRIORITIES[1];
}

function getIncidentSeverity(s: IncidentSeverity) {
  return INCIDENT_SEVERITIES.find((x) => x.value === s) ?? INCIDENT_SEVERITIES[0];
}

function getIncidentStatus(s: IncidentStatus) {
  return INCIDENT_STATUSES.find((x) => x.value === s) ?? INCIDENT_STATUSES[0];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  color,
  icon,
}: {
  label: string;
  value: number;
  sub?: string;
  color: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 flex items-start gap-4">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: color + '1A' }}>
        <span style={{ color }}>{icon}</span>
      </div>
      <div>
        <p className="text-2xl font-bold text-[#0F172A]">{value}</p>
        <p className="text-sm font-medium text-[#475569]">{label}</p>
        {sub && <p className="text-xs text-[#94A3B8] mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
          <h2 className="text-base font-semibold text-[#0F172A]">{title}</h2>
          <button onClick={onClose} className="text-[#94A3B8] hover:text-[#475569]">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto p-6 flex flex-col gap-4">{children}</div>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[#374151]">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  'w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:border-[#09488B] bg-white';
const textareaCls =
  'w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:border-[#09488B] bg-white resize-none';
const selectCls =
  'w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:border-[#09488B] bg-white';

function FilterDropdown({
  placeholder,
  value,
  options,
  onChange,
}: {
  placeholder: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 h-9 px-3 bg-white border rounded-lg text-sm transition-all min-w-[160px] justify-between ${
          value
            ? 'border-[#09488B] text-[#09488B] font-medium'
            : 'border-[#E2E8F0] text-[#64748B]'
        } hover:border-[#09488B] hover:text-[#09488B]`}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`flex-shrink-0 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-50 top-full mt-1.5 right-0 bg-white border border-[#E2E8F0] rounded-xl shadow-lg py-1 min-w-[200px] max-h-60 overflow-y-auto">
          <button
            type="button"
            onClick={() => { onChange(''); setOpen(false); }}
            className={`w-full text-left px-3 py-2 text-sm hover:bg-[#F1F5F9] transition-colors ${!value ? 'text-[#09488B] font-semibold' : 'text-[#64748B]'}`}
          >
            {placeholder}
          </button>
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-[#F1F5F9] transition-colors ${value === opt.value ? 'text-[#09488B] font-semibold bg-[#EFF6FF]' : 'text-[#374151]'}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Tasks Tab ────────────────────────────────────────────────────────────────

function TasksTab({ facilityId, filters, setFilters }: { facilityId: string; filters: Record<string, any>; setFilters: React.Dispatch<React.SetStateAction<Record<string, any>>> }) {
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<ComplianceTask | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const tasksQ = useComplianceTasks(facilityId, filters);
  const createMut = useCreateTask(facilityId);
  const updateMut = useUpdateTask(facilityId);
  const completeMut = useCompleteTask(facilityId);
  const deleteMut = useDeleteTask(facilityId);

  const tasks = tasksQ.data?.items ?? [];
  const total = tasksQ.data?.total ?? 0;
  const totalPages = tasksQ.data?.totalPages ?? 1;

  function openAdd() {
    setForm({ category: 'other', priority: 'medium' });
    setShowAdd(true);
  }

  function openEdit(t: ComplianceTask) {
    setEditing(t);
    setForm({
      title: t.title,
      description: t.description ?? '',
      category: t.category,
      priority: t.priority,
      status: t.status,
      dueDate: t.dueDate ? t.dueDate.substring(0, 10) : '',
      assignedTo: t.assignedTo ?? '',
      notes: t.notes ?? '',
    });
  }

  function submit() {
    const payload = { ...form, facilityId };
    if (editing) {
      updateMut.mutate({ id: editing._id, data: payload }, { onSuccess: () => setEditing(null) });
    } else {
      createMut.mutate(payload, { onSuccess: () => setShowAdd(false) });
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Add button */}
      <div className="flex justify-end">
        <button
          onClick={openAdd}
          className="h-9 px-4 bg-[#09488B] text-white text-sm font-semibold rounded-lg hover:bg-[#073d77] transition-colors"
        >
          + Add Task
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B]">Task</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B]">Category</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B]">Priority</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B]">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B]">Due Date</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B]">Assigned To</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {tasksQ.isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-[#E2E8F0]">
                    {Array.from({ length: 7 }).map((__, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-[#F1F5F9] rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              : tasks.length === 0
              ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-[#94A3B8]">
                    No tasks found.
                  </td>
                </tr>
              )
              : tasks.map((task) => {
                  const st = getTaskStatus(task.status);
                  const pr = getPriority(task.priority);
                  const days = daysUntil(task.dueDate);
                  return (
                    <tr key={task._id} className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC]">
                      <td className="px-4 py-3 font-medium text-[#0F172A] max-w-[220px]">
                        <p className="truncate">{task.title}</p>
                        {task.description && (
                          <p className="text-xs text-[#94A3B8] truncate">{task.description}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-[#475569] capitalize">
                        {task.category.replace(/_/g, ' ')}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-semibold" style={{ color: pr.color }}>
                          {pr.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="text-xs font-semibold px-2 py-1 rounded-full"
                          style={{ color: st.color, backgroundColor: st.bg }}
                        >
                          {st.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#475569]">
                        {task.dueDate ? (
                          <span className={days !== null && days < 0 ? 'text-red-500 font-medium' : days !== null && days <= 3 ? 'text-orange-500 font-medium' : ''}>
                            {fmtDate(task.dueDate)}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="px-4 py-3 text-[#475569]">{task.assignedTo || '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          {task.status !== 'completed' && (
                            <button
                              onClick={() => completeMut.mutate(task._id)}
                              className="text-xs px-2 py-1 rounded-lg bg-[#ECFDF5] text-[#10B981] font-semibold hover:bg-[#D1FAE5] transition-colors"
                            >
                              Done
                            </button>
                          )}
                          <button
                            onClick={() => openEdit(task)}
                            className="text-xs px-2 py-1 rounded-lg bg-[#EFF6FF] text-[#3B82F6] font-semibold hover:bg-[#DBEAFE] transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteId(task._id)}
                            className="text-xs px-2 py-1 rounded-lg bg-[#FEF2F2] text-[#EF4444] font-semibold hover:bg-[#FEE2E2] transition-colors"
                          >
                            Del
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-[#475569]">
          <span>{total} tasks</span>
          <div className="flex gap-2">
            <button
              disabled={(filters.page ?? 1) <= 1}
              onClick={() => setFilters((p) => ({ ...p, page: (p.page ?? 1) - 1 }))}
              className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] disabled:opacity-40 hover:bg-[#F1F5F9]"
            >
              Prev
            </button>
            <span className="px-3 py-1.5">
              {filters.page ?? 1} / {totalPages}
            </span>
            <button
              disabled={(filters.page ?? 1) >= totalPages}
              onClick={() => setFilters((p) => ({ ...p, page: (p.page ?? 1) + 1 }))}
              className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] disabled:opacity-40 hover:bg-[#F1F5F9]"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <ConfirmDeleteModal
          title="Delete Task"
          message="Are you sure you want to delete this task? This action cannot be undone."
          onConfirm={() => { deleteMut.mutate(deleteId); setDeleteId(null); }}
          onCancel={() => setDeleteId(null)}
          isLoading={deleteMut.isPending}
        />
      )}

      {/* Add / Edit Modal */}
      {(showAdd || editing) && (
        <Modal
          title={editing ? 'Edit Task' : 'New Compliance Task'}
          onClose={() => { setShowAdd(false); setEditing(null); }}
        >
          <Field label="Title" required>
            <input className={inputCls} value={form.title ?? ''} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="e.g. Update medication records" />
          </Field>
          <Field label="Description">
            <textarea className={textareaCls} rows={2} value={form.description ?? ''} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category">
              <CustomSelect value={form.category ?? 'other'} onChange={(v) => setForm((p) => ({ ...p, category: v }))} options={TASK_CATEGORIES} />
            </Field>
            <Field label="Priority">
              <CustomSelect value={form.priority ?? 'medium'} onChange={(v) => setForm((p) => ({ ...p, priority: v }))} options={TASK_PRIORITIES} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Due Date">
              <input type="date" className={inputCls} value={form.dueDate ?? ''} onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))} />
            </Field>
            <Field label="Assigned To">
              <input className={inputCls} value={form.assignedTo ?? ''} onChange={(e) => setForm((p) => ({ ...p, assignedTo: e.target.value }))} placeholder="Staff name" />
            </Field>
          </div>
          {editing && (
            <Field label="Status">
              <CustomSelect value={form.status ?? 'open'} onChange={(v) => setForm((p) => ({ ...p, status: v }))} options={TASK_STATUSES} />
            </Field>
          )}
          <Field label="Notes">
            <textarea className={textareaCls} rows={2} value={form.notes ?? ''} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} />
          </Field>
          <div className="flex gap-3 pt-2">
            <button onClick={() => { setShowAdd(false); setEditing(null); }} className="flex-1 h-10 rounded-lg border border-[#E2E8F0] text-sm font-semibold text-[#475569] hover:bg-[#F1F5F9]">
              Cancel
            </button>
            <button
              onClick={submit}
              disabled={!form.title || createMut.isPending || updateMut.isPending}
              className="flex-1 h-10 rounded-lg bg-[#09488B] text-white text-sm font-semibold hover:bg-[#073d77] disabled:opacity-50"
            >
              {editing ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Incidents Tab ────────────────────────────────────────────────────────────

function IncidentsTab({ facilityId, filters, setFilters }: { facilityId: string; filters: Record<string, any>; setFilters: React.Dispatch<React.SetStateAction<Record<string, any>>> }) {
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<ComplianceIncident | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const incidentsQ = useComplianceIncidents(facilityId, filters);
  const createMut = useCreateIncident(facilityId);
  const updateMut = useUpdateIncident(facilityId);
  const deleteMut = useDeleteIncident(facilityId);

  const incidents = incidentsQ.data?.items ?? [];
  const total = incidentsQ.data?.total ?? 0;
  const totalPages = incidentsQ.data?.totalPages ?? 1;

  function openAdd() {
    setForm({ type: 'other', severity: 'minor', incidentDate: new Date().toISOString().substring(0, 10) });
    setShowAdd(true);
  }

  function openEdit(i: ComplianceIncident) {
    setEditing(i);
    setForm({
      title: i.title,
      type: i.type,
      severity: i.severity,
      status: i.status,
      incidentDate: i.incidentDate?.substring(0, 10) ?? '',
      description: i.description ?? '',
      immediateActions: i.immediateActions ?? '',
      residentsInvolved: (i.residentsInvolved ?? []).join(', '),
      staffInvolved: (i.staffInvolved ?? []).join(', '),
      reportedToAdhs: i.reportedToAdhs,
      adhsReportNumber: i.adhsReportNumber ?? '',
      followUpRequired: i.followUpRequired,
      followUpNotes: i.followUpNotes ?? '',
    });
  }

  function submit() {
    const payload = {
      ...form,
      facilityId,
      residentsInvolved: form.residentsInvolved ? form.residentsInvolved.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
      staffInvolved: form.staffInvolved ? form.staffInvolved.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
    };
    if (editing) {
      updateMut.mutate({ id: editing._id, data: payload }, { onSuccess: () => setEditing(null) });
    } else {
      createMut.mutate(payload, { onSuccess: () => setShowAdd(false) });
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Add button */}
      <div className="flex justify-end">
        <button onClick={openAdd} className="h-9 px-4 bg-[#09488B] text-white text-sm font-semibold rounded-lg hover:bg-[#073d77] transition-colors">
          + Log Incident
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B]">Incident</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B]">Type</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B]">Severity</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B]">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B]">Date</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B]">ADHS</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {incidentsQ.isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-[#E2E8F0]">
                    {Array.from({ length: 7 }).map((__, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 bg-[#F1F5F9] rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              : incidents.length === 0
              ? <tr><td colSpan={7} className="px-4 py-10 text-center text-sm text-[#94A3B8]">No incidents logged.</td></tr>
              : incidents.map((inc) => {
                  const sv = getIncidentSeverity(inc.severity);
                  const st = getIncidentStatus(inc.status);
                  return (
                    <tr key={inc._id} className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC]">
                      <td className="px-4 py-3 font-medium text-[#0F172A] max-w-[200px]">
                        <p className="truncate">{inc.title}</p>
                      </td>
                      <td className="px-4 py-3 text-[#475569] capitalize">{inc.type.replace(/_/g, ' ')}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ color: sv.color, backgroundColor: sv.bg }}>{sv.label}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ color: st.color, backgroundColor: st.bg }}>{st.label}</span>
                      </td>
                      <td className="px-4 py-3 text-[#475569]">{fmtDate(inc.incidentDate)}</td>
                      <td className="px-4 py-3">
                        {inc.reportedToAdhs
                          ? <span className="text-xs font-semibold text-[#8B5CF6]">Reported</span>
                          : <span className="text-xs text-[#94A3B8]">No</span>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          <button onClick={() => openEdit(inc)} className="text-xs px-2 py-1 rounded-lg bg-[#EFF6FF] text-[#3B82F6] font-semibold hover:bg-[#DBEAFE]">Edit</button>
                          <button onClick={() => setDeleteId(inc._id)} className="text-xs px-2 py-1 rounded-lg bg-[#FEF2F2] text-[#EF4444] font-semibold hover:bg-[#FEE2E2]">Del</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-[#475569]">
          <span>{total} incidents</span>
          <div className="flex gap-2">
            <button disabled={(filters.page ?? 1) <= 1} onClick={() => setFilters((p) => ({ ...p, page: (p.page ?? 1) - 1 }))} className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] disabled:opacity-40 hover:bg-[#F1F5F9]">Prev</button>
            <span className="px-3 py-1.5">{filters.page ?? 1} / {totalPages}</span>
            <button disabled={(filters.page ?? 1) >= totalPages} onClick={() => setFilters((p) => ({ ...p, page: (p.page ?? 1) + 1 }))} className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] disabled:opacity-40 hover:bg-[#F1F5F9]">Next</button>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <ConfirmDeleteModal
          title="Delete Incident"
          message="Are you sure you want to delete this incident? This action cannot be undone."
          onConfirm={() => { deleteMut.mutate(deleteId); setDeleteId(null); }}
          onCancel={() => setDeleteId(null)}
          isLoading={deleteMut.isPending}
        />
      )}

      {/* Add / Edit Modal */}
      {(showAdd || editing) && (
        <Modal title={editing ? 'Edit Incident' : 'Log Incident'} onClose={() => { setShowAdd(false); setEditing(null); }}>
          <Field label="Title" required>
            <input className={inputCls} value={form.title ?? ''} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="e.g. Resident fall in hallway" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Type" required>
              <CustomSelect value={form.type ?? 'other'} onChange={(v) => setForm((p) => ({ ...p, type: v }))} options={INCIDENT_TYPES} />
            </Field>
            <Field label="Severity" required>
              <CustomSelect value={form.severity ?? 'minor'} onChange={(v) => setForm((p) => ({ ...p, severity: v }))} options={INCIDENT_SEVERITIES} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Incident Date" required>
              <input type="date" className={inputCls} value={form.incidentDate ?? ''} onChange={(e) => setForm((p) => ({ ...p, incidentDate: e.target.value }))} />
            </Field>
            {editing && (
              <Field label="Status">
                <CustomSelect value={form.status ?? 'open'} onChange={(v) => setForm((p) => ({ ...p, status: v }))} options={INCIDENT_STATUSES} />
              </Field>
            )}
          </div>
          <Field label="Description">
            <textarea className={textareaCls} rows={2} value={form.description ?? ''} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
          </Field>
          <Field label="Immediate Actions Taken">
            <textarea className={textareaCls} rows={2} value={form.immediateActions ?? ''} onChange={(e) => setForm((p) => ({ ...p, immediateActions: e.target.value }))} />
          </Field>
          <Field label="Residents Involved (comma-separated)">
            <input className={inputCls} value={form.residentsInvolved ?? ''} onChange={(e) => setForm((p) => ({ ...p, residentsInvolved: e.target.value }))} placeholder="e.g. Jane D., John S." />
          </Field>
          <Field label="Staff Involved (comma-separated)">
            <input className={inputCls} value={form.staffInvolved ?? ''} onChange={(e) => setForm((p) => ({ ...p, staffInvolved: e.target.value }))} placeholder="e.g. Maria G." />
          </Field>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-[#374151] cursor-pointer">
              <input type="checkbox" checked={!!form.reportedToAdhs} onChange={(e) => setForm((p) => ({ ...p, reportedToAdhs: e.target.checked }))} />
              Reported to ADHS
            </label>
          </div>
          {form.reportedToAdhs && (
            <Field label="ADHS Report Number">
              <input className={inputCls} value={form.adhsReportNumber ?? ''} onChange={(e) => setForm((p) => ({ ...p, adhsReportNumber: e.target.value }))} />
            </Field>
          )}
          <div className="flex gap-3 pt-2">
            <button onClick={() => { setShowAdd(false); setEditing(null); }} className="flex-1 h-10 rounded-lg border border-[#E2E8F0] text-sm font-semibold text-[#475569] hover:bg-[#F1F5F9]">Cancel</button>
            <button onClick={submit} disabled={!form.title || !form.incidentDate || createMut.isPending || updateMut.isPending} className="flex-1 h-10 rounded-lg bg-[#09488B] text-white text-sm font-semibold hover:bg-[#073d77] disabled:opacity-50">
              {editing ? 'Save Changes' : 'Log Incident'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Credentials Tab ──────────────────────────────────────────────────────────

function CredentialsTab({ facilityId, filters, setFilters }: { facilityId: string; filters: Record<string, any>; setFilters: React.Dispatch<React.SetStateAction<Record<string, any>>> }) {
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<StaffCredential | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const credsQ = useStaffCredentials(facilityId, filters);
  const createMut = useCreateCredential(facilityId);
  const updateMut = useUpdateCredential(facilityId);
  const deleteMut = useDeleteCredential(facilityId);

  const creds = credsQ.data?.items ?? [];
  const total = credsQ.data?.total ?? 0;
  const totalPages = credsQ.data?.totalPages ?? 1;

  function openAdd() {
    setForm({ credentialType: 'fingerprint_clearance' });
    setShowAdd(true);
  }

  function openEdit(c: StaffCredential) {
    setEditing(c);
    setForm({
      staffName: c.staffName,
      role: c.role,
      credentialType: c.credentialType,
      credentialName: c.credentialName ?? '',
      issueDate: c.issueDate?.substring(0, 10) ?? '',
      expirationDate: c.expirationDate?.substring(0, 10) ?? '',
      notes: c.notes ?? '',
    });
  }

  function submit() {
    const payload = { ...form, facilityId };
    if (editing) {
      updateMut.mutate({ id: editing._id, data: payload }, { onSuccess: () => setEditing(null) });
    } else {
      createMut.mutate(payload, { onSuccess: () => setShowAdd(false) });
    }
  }

  function credStatusBadge(status: string) {
    if (status === 'expired') return { color: '#EF4444', bg: '#FEF2F2', label: 'Expired' };
    if (status === 'expiring_soon') return { color: '#F59E0B', bg: '#FFFBEB', label: 'Expiring Soon' };
    return { color: '#10B981', bg: '#ECFDF5', label: 'Valid' };
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Add button */}
      <div className="flex justify-end">
        <button onClick={openAdd} className="h-9 px-4 bg-[#09488B] text-white text-sm font-semibold rounded-lg hover:bg-[#073d77] transition-colors">
          + Add Credential
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B]">Staff</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B]">Role</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B]">Credential</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B]">Expires</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B]">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {credsQ.isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-[#E2E8F0]">
                    {Array.from({ length: 6 }).map((__, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 bg-[#F1F5F9] rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              : creds.length === 0
              ? <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-[#94A3B8]">No credentials found.</td></tr>
              : creds.map((cred) => {
                  const badge = credStatusBadge(cred.status);
                  const days = daysUntil(cred.expirationDate);
                  const credLabel = CREDENTIAL_TYPES.find((c) => c.value === cred.credentialType)?.label ?? cred.credentialType;
                  return (
                    <tr key={cred._id} className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC]">
                      <td className="px-4 py-3 font-medium text-[#0F172A]">{cred.staffName}</td>
                      <td className="px-4 py-3 text-[#475569]">{cred.role}</td>
                      <td className="px-4 py-3 text-[#475569]">{cred.credentialName || credLabel}</td>
                      <td className="px-4 py-3">
                        <span className={`font-medium ${cred.status === 'expired' ? 'text-red-500' : cred.status === 'expiring_soon' ? 'text-orange-500' : 'text-[#475569]'}`}>
                          {fmtDate(cred.expirationDate)}
                        </span>
                        {days !== null && days > 0 && days <= 30 && (
                          <span className="ml-1 text-xs text-orange-400">({days}d)</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ color: badge.color, backgroundColor: badge.bg }}>{badge.label}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          <button onClick={() => openEdit(cred)} className="text-xs px-2 py-1 rounded-lg bg-[#EFF6FF] text-[#3B82F6] font-semibold hover:bg-[#DBEAFE]">Edit</button>
                          <button onClick={() => setDeleteId(cred._id)} className="text-xs px-2 py-1 rounded-lg bg-[#FEF2F2] text-[#EF4444] font-semibold hover:bg-[#FEE2E2]">Del</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-[#475569]">
          <span>{total} credentials</span>
          <div className="flex gap-2">
            <button disabled={(filters.page ?? 1) <= 1} onClick={() => setFilters((p) => ({ ...p, page: (p.page ?? 1) - 1 }))} className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] disabled:opacity-40 hover:bg-[#F1F5F9]">Prev</button>
            <span className="px-3 py-1.5">{filters.page ?? 1} / {totalPages}</span>
            <button disabled={(filters.page ?? 1) >= totalPages} onClick={() => setFilters((p) => ({ ...p, page: (p.page ?? 1) + 1 }))} className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] disabled:opacity-40 hover:bg-[#F1F5F9]">Next</button>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <ConfirmDeleteModal
          title="Delete Credential"
          message="Are you sure you want to delete this staff credential? This action cannot be undone."
          onConfirm={() => { deleteMut.mutate(deleteId); setDeleteId(null); }}
          onCancel={() => setDeleteId(null)}
          isLoading={deleteMut.isPending}
        />
      )}

      {/* Add / Edit Modal */}
      {(showAdd || editing) && (
        <Modal title={editing ? 'Edit Credential' : 'Add Staff Credential'} onClose={() => { setShowAdd(false); setEditing(null); }}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Staff Name" required>
              <input className={inputCls} value={form.staffName ?? ''} onChange={(e) => setForm((p) => ({ ...p, staffName: e.target.value }))} placeholder="Full name" />
            </Field>
            <Field label="Role" required>
              <input className={inputCls} value={form.role ?? ''} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))} placeholder="e.g. Caregiver" />
            </Field>
          </div>
          <Field label="Credential Type" required>
            <CustomSelect value={form.credentialType ?? 'fingerprint_clearance'} onChange={(v) => setForm((p) => ({ ...p, credentialType: v }))} options={CREDENTIAL_TYPES} />
          </Field>
          {form.credentialType === 'other' && (
            <Field label="Credential Name" required>
              <input className={inputCls} value={form.credentialName ?? ''} onChange={(e) => setForm((p) => ({ ...p, credentialName: e.target.value }))} placeholder="e.g. OSHA Training" />
            </Field>
          )}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Issue Date">
              <input type="date" className={inputCls} value={form.issueDate ?? ''} onChange={(e) => setForm((p) => ({ ...p, issueDate: e.target.value }))} />
            </Field>
            <Field label="Expiration Date" required>
              <input type="date" className={inputCls} value={form.expirationDate ?? ''} onChange={(e) => setForm((p) => ({ ...p, expirationDate: e.target.value }))} />
            </Field>
          </div>
          <Field label="Notes">
            <textarea className={textareaCls} rows={2} value={form.notes ?? ''} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} />
          </Field>
          <div className="flex gap-3 pt-2">
            <button onClick={() => { setShowAdd(false); setEditing(null); }} className="flex-1 h-10 rounded-lg border border-[#E2E8F0] text-sm font-semibold text-[#475569] hover:bg-[#F1F5F9]">Cancel</button>
            <button onClick={submit} disabled={!form.staffName || !form.role || !form.expirationDate || createMut.isPending || updateMut.isPending} className="flex-1 h-10 rounded-lg bg-[#09488B] text-white text-sm font-semibold hover:bg-[#073d77] disabled:opacity-50">
              {editing ? 'Save Changes' : 'Add Credential'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const TABS = ['Tasks', 'Incidents', 'Credentials'] as const;
type Tab = (typeof TABS)[number];

function ComplianceContent() {
  const facilitiesQ = useMyFacilities();
  const facilities = facilitiesQ.data ?? [];

  const searchParams = useSearchParams();
  const [facilityId, setFacilityId] = useState<string>('');

  const tabFromUrl = searchParams.get('tab');
  const initialTab: Tab =
    tabFromUrl === 'incidents' ? 'Incidents' :
    tabFromUrl === 'credentials' ? 'Credentials' :
    'Tasks';
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);

  const [taskFilters, setTaskFilters] = useState<Record<string, any>>({ page: 1 });
  const [incidentFilters, setIncidentFilters] = useState<Record<string, any>>({ page: 1 });
  const [credFilters, setCredFilters] = useState<Record<string, any>>({ page: 1 });

  useEffect(() => {
    const t = searchParams.get('tab');
    if (t === 'incidents') setActiveTab('Incidents');
    else if (t === 'credentials') setActiveTab('Credentials');
    else setActiveTab('Tasks');
  }, [searchParams]);

  const resolvedFacilityId = facilityId || facilities[0]?._id || '';

  const statsQ = useComplianceStats(resolvedFacilityId);
  const stats = statsQ.data;

  return (
    <div className="w-full min-h-full bg-[#F8FAFC] p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Compliance Center</h1>
          <p className="text-sm text-[#64748B] mt-0.5">
            Track tasks, incidents, and staff credentials for survey readiness
          </p>
        </div>
        {facilities.length > 1 && (
          <CustomSelect
            className="w-56"
            value={resolvedFacilityId}
            onChange={(v) => setFacilityId(v)}
            options={facilities.map((f) => ({ value: f._id, label: f.name }))}
          />
        )}
      </div>

      {/* Stats */}
      {resolvedFacilityId && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Open Tasks"
            value={stats?.tasks.open ?? 0}
            sub={stats?.tasks.overdue ? `${stats.tasks.overdue} overdue` : undefined}
            color="#3B82F6"
            icon={
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
          />
          <StatCard
            label="Overdue Tasks"
            value={stats?.tasks.overdue ?? 0}
            sub="need attention"
            color="#EF4444"
            icon={
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            label="Open Incidents"
            value={stats?.incidents.open ?? 0}
            sub={stats?.incidents.critical ? `${stats.incidents.critical} critical` : undefined}
            color="#F97316"
            icon={
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            }
          />
          <StatCard
            label="Credential Alerts"
            value={(stats?.credentials.expired ?? 0) + (stats?.credentials.expiringSoon ?? 0)}
            sub={`${stats?.credentials.expired ?? 0} expired · ${stats?.credentials.expiringSoon ?? 0} expiring`}
            color="#8B5CF6"
            icon={
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            }
          />
        </div>
      )}

      {/* No facility state */}
      {!resolvedFacilityId && !facilitiesQ.isLoading && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center">
          <p className="text-[#94A3B8] text-sm">No facility found. Please set up your facility profile first.</p>
        </div>
      )}

      {/* Tabs + Filters + Content */}
      {resolvedFacilityId && (
        <div className="flex flex-col gap-4">
          {/* Tab types (left) + Filters (right) */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex gap-1 bg-white rounded-xl border border-[#E2E8F0] p-1 w-fit">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeTab === tab
                      ? 'bg-[#09488B] text-white shadow-sm'
                      : 'text-[#475569] hover:bg-[#F1F5F9]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              {activeTab === 'Tasks' && (
                <>
                  <FilterDropdown
                    placeholder="All Statuses"
                    value={taskFilters.status ?? ''}
                    options={TASK_STATUSES}
                    onChange={(v) => setTaskFilters((p) => ({ ...p, status: v || undefined, page: 1 }))}
                  />
                  <FilterDropdown
                    placeholder="All Priorities"
                    value={taskFilters.priority ?? ''}
                    options={TASK_PRIORITIES}
                    onChange={(v) => setTaskFilters((p) => ({ ...p, priority: v || undefined, page: 1 }))}
                  />
                  <FilterDropdown
                    placeholder="All Categories"
                    value={taskFilters.category ?? ''}
                    options={TASK_CATEGORIES}
                    onChange={(v) => setTaskFilters((p) => ({ ...p, category: v || undefined, page: 1 }))}
                  />
                </>
              )}
              {activeTab === 'Incidents' && (
                <>
                  <FilterDropdown
                    placeholder="All Types"
                    value={incidentFilters.type ?? ''}
                    options={INCIDENT_TYPES}
                    onChange={(v) => setIncidentFilters((p) => ({ ...p, type: v || undefined, page: 1 }))}
                  />
                  <FilterDropdown
                    placeholder="All Severities"
                    value={incidentFilters.severity ?? ''}
                    options={INCIDENT_SEVERITIES}
                    onChange={(v) => setIncidentFilters((p) => ({ ...p, severity: v || undefined, page: 1 }))}
                  />
                  <FilterDropdown
                    placeholder="All Statuses"
                    value={incidentFilters.status ?? ''}
                    options={INCIDENT_STATUSES}
                    onChange={(v) => setIncidentFilters((p) => ({ ...p, status: v || undefined, page: 1 }))}
                  />
                </>
              )}
              {activeTab === 'Credentials' && (
                <>
                  <FilterDropdown
                    placeholder="All Statuses"
                    value={credFilters.status ?? ''}
                    options={[
                      { value: 'valid', label: 'Valid' },
                      { value: 'expiring_soon', label: 'Expiring Soon' },
                      { value: 'expired', label: 'Expired' },
                    ]}
                    onChange={(v) => setCredFilters((p) => ({ ...p, status: v || undefined, page: 1 }))}
                  />
                  <FilterDropdown
                    placeholder="All Types"
                    value={credFilters.credentialType ?? ''}
                    options={CREDENTIAL_TYPES}
                    onChange={(v) => setCredFilters((p) => ({ ...p, credentialType: v || undefined, page: 1 }))}
                  />
                  <div className="relative">
                    <svg
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                      width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                    </svg>
                    <input
                      className="h-9 pl-8 pr-3 rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:border-[#09488B] bg-white w-64 placeholder:text-[#94A3B8]"
                      placeholder="Search staff..."
                      value={credFilters.staffName ?? ''}
                      onChange={(e) => setCredFilters((p) => ({ ...p, staffName: e.target.value || undefined, page: 1 }))}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {activeTab === 'Tasks' && <TasksTab facilityId={resolvedFacilityId} filters={taskFilters} setFilters={setTaskFilters} />}
          {activeTab === 'Incidents' && <IncidentsTab facilityId={resolvedFacilityId} filters={incidentFilters} setFilters={setIncidentFilters} />}
          {activeTab === 'Credentials' && <CredentialsTab facilityId={resolvedFacilityId} filters={credFilters} setFilters={setCredFilters} />}
        </div>
      )}
    </div>
  );
}

export default function CompliancePage() {
  return (
    <Suspense>
      <ComplianceContent />
    </Suspense>
  );
}
