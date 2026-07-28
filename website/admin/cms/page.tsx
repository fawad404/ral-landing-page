'use client';
import React, { useState } from 'react';
import ConfirmDeleteModal from '@/components/global/ConfirmDeleteModal';
import CustomSelect from '@/components/global/CustomSelect';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useResources, useCreateResource, useUpdateResource, useTogglePublish, useDeleteResource } from '@/hooks/useCms';
import type { Resource, ResourceType, CreateResourceDto } from '@/types/cms.types';

const RESOURCE_TYPES: ResourceType[] = ['blog', 'guidance', 'directory'];

const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  content: z.string().min(10, 'Content is required'),
  type: z.enum(['blog', 'guidance', 'directory']),
  excerpt: z.string().optional(),
  tags: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

function ResourceModal({ resource, onClose }: { resource?: Resource; onClose: () => void }) {
  const create = useCreateResource();
  const update = useUpdateResource(resource?._id ?? '');
  const isEdit = !!resource;

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: isEdit ? {
      title: resource.title,
      content: resource.content,
      type: resource.type,
      excerpt: resource.excerpt ?? '',
      tags: resource.tags?.join(', ') ?? '',
    } : { type: 'blog' },
  });

  const onSubmit = (data: FormData) => {
    const payload: CreateResourceDto = {
      title: data.title,
      content: data.content,
      type: data.type,
      excerpt: data.excerpt,
      tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    };
    if (isEdit) {
      update.mutate(payload, { onSuccess: onClose });
    } else {
      create.mutate(payload, { onSuccess: onClose });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl border border-[#E2E8F0] w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="font-bold text-lg text-[#0F172A]">{isEdit ? 'Edit Resource' : 'New Resource'}</h2>
          <button onClick={onClose} className="text-[#64748B] hover:text-[#0F172A] text-xl leading-none">×</button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1 col-span-2">
              <label className="text-sm font-medium text-[#475569]">Title *</label>
              <input {...register('title')} placeholder="Article title"
                className="border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#09488B]" />
              {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[#475569]">Type *</label>
              <CustomSelect
                value={watch('type') ?? 'blog'}
                onChange={(v) => setValue('type', v as ResourceType)}
                options={RESOURCE_TYPES.map(t => ({ value: t, label: t.charAt(0).toUpperCase() + t.slice(1) }))}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[#475569]">Tags (comma separated)</label>
              <input {...register('tags')} placeholder="seniors, memory-care, tips"
                className="border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#09488B]" />
            </div>
            <div className="flex flex-col gap-1 col-span-2">
              <label className="text-sm font-medium text-[#475569]">Excerpt</label>
              <input {...register('excerpt')} placeholder="Short description for listing views"
                className="border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#09488B]" />
            </div>
            <div className="flex flex-col gap-1 col-span-2">
              <label className="text-sm font-medium text-[#475569]">Content *</label>
              <textarea {...register('content')} rows={8} placeholder="Full article content…"
                className="border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#09488B] resize-none" />
              {errors.content && <p className="text-xs text-red-500">{errors.content.message}</p>}
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-2">
            <button type="button" onClick={onClose} className="px-5 py-2 border border-[#E2E8F0] text-[#475569] rounded-xl text-sm font-semibold hover:bg-[#F1F5F9]">Cancel</button>
            <button type="submit" disabled={create.isPending || update.isPending}
              className="px-5 py-2 bg-[#09488B] text-white rounded-xl text-sm font-semibold hover:bg-[#073a70] disabled:opacity-60">
              {create.isPending || update.isPending ? 'Saving…' : isEdit ? 'Save Changes' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const TYPE_BADGE: Record<string, string> = {
  blog: 'bg-purple-100 text-purple-700',
  guidance: 'bg-blue-100 text-blue-700',
  directory: 'bg-teal-100 text-teal-700',
};

export default function AdminCmsPage() {
  const [tab, setTab] = useState<ResourceType | 'all'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Resource | undefined>(undefined);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const params = tab !== 'all' ? { type: tab } : undefined;
  const { data: resources = [], isLoading, isError, refetch } = useResources(params);
  const togglePublish = useTogglePublish();
  const deleteResource = useDeleteResource();

  const openEdit = (r: Resource) => { setEditTarget(r); setShowModal(true); };
  const closeModal = () => { setEditTarget(undefined); setShowModal(false); };

  return (
    <div className="p-8 flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#0F172A]">Content Management</h1>
          <p className="text-[#64748B] mt-1">Manage blogs, guidance articles and directory content.</p>
        </div>
        <button onClick={() => { setEditTarget(undefined); setShowModal(true); }}
          className="bg-[#09488B] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#073a70]">
          + New Resource
        </button>
      </div>

      <div className="flex bg-[#F1F5F9] rounded-xl p-1 w-fit gap-0">
        {(['all', ...RESOURCE_TYPES] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${tab === t ? 'bg-white text-[#09488B] shadow-sm' : 'text-[#64748B]'}`}>
            {t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-32"><div className="w-8 h-8 border-4 border-[#09488B] border-t-transparent rounded-full animate-spin" /></div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center h-32 gap-3">
            <p className="text-sm font-semibold text-red-500">Failed to load content resources.</p>
            <button onClick={() => refetch()} className="text-xs font-semibold text-[#09488B] hover:underline">Retry</button>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <tr>{['Title', 'Type', 'Tags', 'Status', 'Created', 'Actions'].map(h => (
                <th key={h} className="text-left py-3 px-4 text-xs font-bold text-[#64748B] uppercase tracking-wide">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {resources.map(r => (
                <tr key={r._id} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC]">
                  <td className="py-3 px-4">
                    <p className="text-sm font-semibold text-[#0F172A] truncate max-w-[240px]">{r.title}</p>
                    {r.excerpt && <p className="text-xs text-[#64748B] truncate max-w-[240px]">{r.excerpt}</p>}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${TYPE_BADGE[r.type]}`}>{r.type}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {(r.tags ?? []).slice(0, 3).map(tag => (
                        <span key={tag} className="text-[10px] bg-[#F1F5F9] text-[#475569] px-1.5 py-0.5 rounded-full">{tag}</span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <button onClick={() => togglePublish.mutate(r._id)}
                      className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors ${r.isPublished ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                      {r.isPublished ? '● Published' : '○ Draft'}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-xs text-[#64748B]">{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(r)} className="text-xs border border-[#E2E8F0] text-[#475569] px-2 py-1 rounded-lg hover:bg-[#F1F5F9]">Edit</button>
                      <button onClick={() => setDeleteId(r._id)}
                        className="text-xs border border-red-200 text-red-500 px-2 py-1 rounded-lg hover:bg-red-50">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {resources.length === 0 && <tr><td colSpan={6} className="text-center py-10 text-[#94A3B8] text-sm">No content yet</td></tr>}
            </tbody>
          </table>
        )}
      </div>

      {showModal && <ResourceModal resource={editTarget} onClose={closeModal} />}
      {deleteId && (
        <ConfirmDeleteModal
          title="Delete Resource"
          message="Are you sure you want to delete this CMS resource? This action cannot be undone."
          onConfirm={() => { deleteResource.mutate(deleteId); setDeleteId(null); }}
          onCancel={() => setDeleteId(null)}
          isLoading={deleteResource.isPending}
        />
      )}
    </div>
  );
}
