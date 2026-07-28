"use client";
import React, { useEffect, useState } from "react";
import { useMyFacilities, useUpdateFacility } from "@/hooks/useFacilities";

interface PolicyField {
  id: string;
  label: string;
  placeholder: string;
}

const policyFields: PolicyField[] = [
  { id: "admission", label: "Admission Policy", placeholder: "Describe your admission criteria and process for new residents..." },
  { id: "discharge", label: "Discharge Policy", placeholder: "Outline the conditions under which a resident may be discharged..." },
  { id: "visitor", label: "Visitor Policy", placeholder: "Describe visiting hours, rules, and any restrictions..." },
  { id: "medication", label: "Medication Policy", placeholder: "Explain how medications are managed, stored, and administered..." },
  { id: "emergency", label: "Emergency & Evacuation Policy", placeholder: "Detail your emergency response plan and evacuation procedures..." },
  { id: "privacy", label: "Privacy & Confidentiality Policy", placeholder: "Describe how resident information is protected and shared..." },
];

const Policies = () => {
  const { data: facilities = [], isLoading, isError } = useMyFacilities();
  const facility = facilities[0];
  const updateFacility = useUpdateFacility(facility?._id ?? '');

  const [policies, setPolicies] = useState<Record<string, string>>({
    admission: '', discharge: '', visitor: '', medication: '', emergency: '', privacy: '',
  });
  const [saved, setSaved] = useState<Record<string, string>>(policies);

  // Populate from backend once facility loads
  useEffect(() => {
    if (facility?.policies) {
      const loaded = {
        admission: facility.policies.admission ?? '',
        discharge: facility.policies.discharge ?? '',
        visitor: facility.policies.visitor ?? '',
        medication: facility.policies.medication ?? '',
        emergency: facility.policies.emergency ?? '',
        privacy: facility.policies.privacy ?? '',
      };
      setPolicies(loaded);
      setSaved(loaded);
    }
  }, [facility?._id]);

  const handleChange = (id: string, value: string) => {
    setPolicies((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = () => {
    if (!facility) return;
    updateFacility.mutate(
      { policies },
      { onSuccess: () => setSaved({ ...policies }) }
    );
  };

  const handleDiscard = () => {
    setPolicies({ ...saved });
  };

  const filledCount = Object.values(policies).filter((v) => v.trim().length > 0).length;

  if (isLoading) {
    return (
      <div className="mx-10 mt-6 flex flex-col gap-4">
        {[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-xl bg-[#F1F5F9] animate-pulse" />)}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-10 mt-6 p-4 rounded-xl bg-red-50 border border-red-200">
        <p className="text-sm text-red-600">Failed to load facility data. Please refresh the page.</p>
      </div>
    );
  }

  if (!facility) {
    return (
      <div className="mx-10 mt-6 p-4 rounded-xl bg-[#09488B0D] border border-[#09488B1A]">
        <p className="text-sm font-semibold text-[#09488B]">No facility registered yet. Policies will be available once your facility is created.</p>
      </div>
    );
  }

  return (
    <div className="w-full grow">
      <div className="mx-10 mb-10 flex flex-col gap-6">
        {/* Progress banner */}
        <div className="bg-white border border-solid border-[#E2E8F0] rounded-xl px-6 py-4 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-[#0F172A]">Policy Completion</p>
            <p className="text-xs text-[#64748B]">{filledCount} of {policyFields.length} policies filled out</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-40 h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#09488B] rounded-full transition-all duration-300"
                style={{ width: `${(filledCount / policyFields.length) * 100}%` }}
              />
            </div>
            <span className="text-sm font-bold text-[#09488B]">
              {Math.round((filledCount / policyFields.length) * 100)}%
            </span>
          </div>
        </div>

        {/* Policy fields */}
        <div className="bg-white rounded-xl border border-solid border-[#E2E8F0] overflow-hidden divide-y divide-[#F1F5F9]">
          {policyFields.map((field) => (
            <div key={field.id} className="px-6 py-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-[#0F172A]">{field.label}</label>
                {policies[field.id]?.trim().length > 0 ? (
                  <span className="text-xs font-semibold text-[#10B981] bg-[#10B9811A] px-2.5 py-1 rounded-full">Filled</span>
                ) : (
                  <span className="text-xs font-semibold text-[#94A3B8] bg-[#F1F5F9] px-2.5 py-1 rounded-full">Empty</span>
                )}
              </div>
              <textarea
                value={policies[field.id] ?? ""}
                onChange={(e) => handleChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                rows={3}
                className="w-full text-sm text-[#0F172A] border border-solid border-[#E2E8F0] rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-[#09488B33] focus:border-[#09488B] transition-colors placeholder-[#94A3B8]"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="w-full h-auto py-4 bg-[#FFFFFFCC] sticky bottom-0 left-0 px-10 border-t border-solid border-[#09488B1A] flex justify-end items-center gap-3">
        <button onClick={handleDiscard} disabled={updateFacility.isPending} className="w-fit h-auto px-6 py-3 rounded-lg flex justify-center items-center disabled:opacity-50">
          <p className="font-semibold text-sm text-[#475569]">Discard Changes</p>
        </button>
        <button onClick={handleSave} disabled={updateFacility.isPending} className="w-fit h-auto px-10 py-3 rounded-lg bg-[#09488B] flex justify-center items-center disabled:opacity-60">
          <p className="font-bold text-sm text-white uppercase">
            {updateFacility.isPending ? 'Saving...' : 'Save Changes'}
          </p>
        </button>
      </div>
    </div>
  );
};

export default Policies;
