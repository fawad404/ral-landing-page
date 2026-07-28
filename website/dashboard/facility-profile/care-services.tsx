"use client";
import React, { useEffect, useState } from "react";
import { useMyFacilities, useUpdateFacility } from "@/hooks/useFacilities";

interface ServiceItem {
  id: string;
  label: string;
  description: string;
}

const careServicesList: ServiceItem[] = [
  { id: "memory_care", label: "Memory Care", description: "Specialized support for Alzheimer's and dementia residents" },
  { id: "physical_therapy", label: "Physical Therapy", description: "On-site or contracted physical rehabilitation services" },
  { id: "occupational_therapy", label: "Occupational Therapy", description: "Assistance with daily living activities and independence" },
  { id: "speech_therapy", label: "Speech Therapy", description: "Language and swallowing disorder treatment" },
  { id: "hospice_care", label: "Hospice Care", description: "End-of-life comfort and palliative care support" },
  { id: "wound_care", label: "Wound Care", description: "Professional management of chronic and acute wounds" },
  { id: "diabetic_care", label: "Diabetic Care", description: "Monitoring and management of diabetes-related needs" },
  { id: "medication_management", label: "Medication Management", description: "Administration and tracking of resident medications" },
];

const amenitiesList: ServiceItem[] = [
  { id: "private_rooms", label: "Private Rooms", description: "Individual rooms with private bathrooms" },
  { id: "shared_rooms", label: "Shared Rooms", description: "Shared accommodation options available" },
  { id: "outdoor_spaces", label: "Outdoor Spaces", description: "Gardens, patios, or walking areas" },
  { id: "fitness_center", label: "Fitness Center", description: "Exercise equipment and group fitness classes" },
  { id: "dining_room", label: "Dining Room", description: "Restaurant-style communal dining" },
  { id: "activity_room", label: "Activity Room", description: "Dedicated space for group activities and events" },
  { id: "transportation", label: "Transportation", description: "Scheduled transportation for appointments and outings" },
  { id: "wifi", label: "Wi-Fi Access", description: "High-speed internet throughout the facility" },
];

const Toggle = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
  <button
    onClick={onToggle}
    className={`relative inline-flex items-center w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none flex-shrink-0 ${enabled ? "bg-[#09488B]" : "bg-[#CBD5E1]"}`}
    role="switch"
    aria-checked={enabled}
  >
    <span
      className={`inline-block w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 ${enabled ? "translate-x-5" : "translate-x-0.5"}`}
    />
  </button>
);

const ServiceSection = ({
  title,
  items,
  enabled,
  onToggle,
}: {
  title: string;
  items: ServiceItem[];
  enabled: Record<string, boolean>;
  onToggle: (id: string) => void;
}) => (
  <div className="flex flex-col gap-4">
    <p className="text-sm font-bold text-[#94A3B8] uppercase tracking-wide">{title}</p>
    <div className="bg-white rounded-xl border border-solid border-[#E2E8F0] overflow-hidden divide-y divide-[#F1F5F9]">
      {items.map((item) => (
        <div key={item.id} className="flex items-center justify-between px-6 py-4">
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-semibold text-[#0F172A]">{item.label}</p>
            <p className="text-xs font-normal text-[#64748B]">{item.description}</p>
          </div>
          <Toggle enabled={!!enabled[item.id]} onToggle={() => onToggle(item.id)} />
        </div>
      ))}
    </div>
  </div>
);

const allServiceIds = [...careServicesList, ...amenitiesList].map((s) => s.id);

const CareServices = () => {
  const { data: facilities, isLoading } = useMyFacilities();
  const facility = facilities?.[0];
  const update = useUpdateFacility(facility?._id ?? '');

  const [enabled, setEnabled] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (facility) {
      const current = facility.services ?? [];
      const map: Record<string, boolean> = {};
      allServiceIds.forEach((id) => { map[id] = current.includes(id); });
      setEnabled(map);
    }
  }, [facility]);

  const toggle = (id: string) => setEnabled((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleSave = () => {
    if (!facility) return;
    const services = allServiceIds.filter((id) => enabled[id]);
    // Preserve any services from the backend that aren't in our known list
    const extraServices = (facility.services ?? []).filter((s) => !allServiceIds.includes(s));
    update.mutate({ services: [...services, ...extraServices] });
  };

  const handleDiscard = () => {
    if (!facility) return;
    const current = facility.services ?? [];
    const map: Record<string, boolean> = {};
    allServiceIds.forEach((id) => { map[id] = current.includes(id); });
    setEnabled(map);
  };

  const careEnabled = Object.fromEntries(careServicesList.map((s) => [s.id, enabled[s.id] ?? false]));
  const amenitiesEnabled = Object.fromEntries(amenitiesList.map((s) => [s.id, enabled[s.id] ?? false]));

  if (isLoading) return (
    <div className="flex justify-center items-center h-32">
      <div className="w-8 h-8 border-4 border-[#09488B] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!facility) return (
    <div className="mx-10 mt-4">
      <div className="bg-[#09488B0D] border border-[#09488B1A] rounded-xl px-5 py-4">
        <p className="text-sm font-semibold text-[#09488B]">No facility registered yet. Care services will be available once your facility is created.</p>
      </div>
    </div>
  );

  return (
    <div className="w-full grow">
      <div className="mx-10 mb-10 flex flex-col gap-8">
        <ServiceSection
          title="Care Services"
          items={careServicesList}
          enabled={careEnabled}
          onToggle={toggle}
        />
        <ServiceSection
          title="Amenities"
          items={amenitiesList}
          enabled={amenitiesEnabled}
          onToggle={toggle}
        />
      </div>

      {/* Sticky Footer */}
      <div className="w-full h-auto py-4 bg-[#FFFFFFCC] sticky bottom-0 left-0 px-10 border-t border-solid border-[#09488B1A] flex justify-end items-center gap-3">
        <button onClick={handleDiscard} className="w-fit h-auto px-6 py-3 rounded-lg flex justify-center items-center">
          <p className="font-semibold text-sm text-[#475569]">Discard Changes</p>
        </button>
        <button onClick={handleSave} disabled={update.isPending || !facility}
          className="w-fit h-auto px-10 py-3 rounded-lg bg-[#09488B] flex justify-center items-center disabled:opacity-50">
          <p className="font-bold text-sm text-white uppercase">{update.isPending ? 'Saving…' : 'Save Changes'}</p>
        </button>
      </div>
    </div>
  );
};

export default CareServices;
