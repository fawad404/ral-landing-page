"use client";
import {
  AdditionalNoteIcon,
  BedRoomIcon,
  ChevronDownIcon,
  SharedRoomIcon,
} from "@/assets";
import React, { useEffect, useState } from "react";
import { useMyFacilities, useUpdateAvailability, useUpdateFacility } from "@/hooks/useFacilities";

type RoomCount = "0" | "1" | "2" | "3+";
type GenderPreference = "None" | "Female" | "Male";

const ROOM_VALUES: Record<RoomCount, number> = { "0": 0, "1": 1, "2": 2, "3+": 3 };

const Form = () => {
  const { data: facilities, isLoading } = useMyFacilities();
  const facility = facilities?.[0];

  const updateAvailability = useUpdateAvailability(facility?._id ?? '');
  const updateFacility = useUpdateFacility(facility?._id ?? '');

  const [privateRooms, setPrivateRooms] = useState<RoomCount>("0");
  const [sharedRooms, setSharedRooms] = useState<RoomCount>("0");
  const [memoryCare, setMemoryCare] = useState(false);
  const [genderPreference, setGenderPreference] = useState<GenderPreference>("None");
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState("");

  const roomOptions: RoomCount[] = ["0", "1", "2", "3+"];
  const genderOptions: GenderPreference[] = ["None", "Female", "Male"];

  useEffect(() => {
    if (facility) {
      const total = facility.availabilityCount ?? 0;
      const priv = Math.ceil(total / 2);
      const shared = total - priv;
      const clamp = (n: number): RoomCount => n <= 0 ? "0" : n === 1 ? "1" : n === 2 ? "2" : "3+";
      setPrivateRooms(clamp(priv));
      setSharedRooms(clamp(shared));
      setMemoryCare(facility.services?.includes("memory_care") ?? false);
      setGenderPreference((facility.genderPreference as GenderPreference) ?? "None");
      setNote(facility.description ?? "");
    }
  }, [facility]);

  const handleSave = () => {
    if (!facility) return;
    const total = ROOM_VALUES[privateRooms] + ROOM_VALUES[sharedRooms];
    updateAvailability.mutate({ availabilityCount: total });

    const currentServices = facility.services ?? [];
    let updatedServices = [...currentServices];
    if (memoryCare && !updatedServices.includes("memory_care")) {
      updatedServices.push("memory_care");
    } else if (!memoryCare) {
      updatedServices = updatedServices.filter((s) => s !== "memory_care");
    }

    const genderChanged = genderPreference !== (facility.genderPreference ?? "None");
    const noteChanged = note !== (facility.description ?? "");
    const servicesChanged = JSON.stringify(updatedServices) !== JSON.stringify(currentServices);

    if (noteChanged || servicesChanged || genderChanged) {
      updateFacility.mutate({
        services: updatedServices,
        description: note || undefined,
        genderPreference,
      });
    }
  };

  const handleCancel = () => {
    if (!facility) return;
    const total = facility.availabilityCount ?? 0;
    const priv = Math.ceil(total / 2);
    const shared = total - priv;
    const clamp = (n: number): RoomCount => n <= 0 ? "0" : n === 1 ? "1" : n === 2 ? "2" : "3+";
    setPrivateRooms(clamp(priv));
    setSharedRooms(clamp(shared));
    setMemoryCare(facility.services?.includes("memory_care") ?? false);
    setGenderPreference((facility.genderPreference as GenderPreference) ?? "None");
    setNote(facility.description ?? "");
  };

  const isSaving = updateAvailability.isPending || updateFacility.isPending;

  if (isLoading) return (
    <div className="flex justify-center items-center h-32">
      <div className="w-8 h-8 border-4 border-[#09488B] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!facility) return (
    <div className="mx-10 mt-4">
      <div className="bg-[#09488B0D] border border-[#09488B1A] rounded-xl px-5 py-4">
        <p className="text-sm font-semibold text-[#09488B]">No facility registered yet. You need a facility profile before managing availability.</p>
      </div>
    </div>
  );

  return (
    <div className="w-full grow">
      <div className="bg-white mx-10 mb-10 rounded-xl shadow-[0px_1px_2px_0px_#0000000D] border border-solid border-[#09488B0D] p-8 w-full max-w-[672px] flex flex-col gap-10">
        {/* Private Rooms */}
        <div className="w-full h-auto flex flex-col gap-4">
          <div className="flex justify-start items-center gap-2">
            <BedRoomIcon />
            <span className="text-sm font-bold text-[#94A3B8] uppercase">
              Private Rooms Available
            </span>
          </div>
          <div className="grid grid-cols-4 gap-0 rounded-lg overflow-hidden p-1 bg-[#F1F5F9]">
            {roomOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setPrivateRooms(opt)}
                className={`py-3 text-base font-semibold rounded-md transition-colors duration-150 focus:outline-none
                ${
                  privateRooms === opt
                    ? "bg-white text-[#09488B] shadow-[0px_1px_2px_0px_#0000000D]"
                    : "bg-transparent text-[#64748B] hover:bg-slate-50"
                }
              `}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>


        {/* Shared Rooms */}
        <div className="w-full h-auto flex flex-col gap-4">
          <div className="flex justify-start items-center gap-2">
            <SharedRoomIcon />
            <span className="text-sm font-bold text-[#94A3B8] uppercase">
              Shared Rooms Available
            </span>
          </div>
          <div className="grid grid-cols-4 gap-0 rounded-lg overflow-hidden p-1 bg-[#F1F5F9]">
            {roomOptions.map((opt) => (
                <button
                key={opt}
                onClick={() => setSharedRooms(opt)}
                className={`py-3 text-base font-semibold rounded-md transition-colors duration-150 focus:outline-none
                    ${
                        sharedRooms === opt
                    ? "bg-white text-[#09488B] shadow-[0px_1px_2px_0px_#0000000D]"
                    : "bg-transparent text-[#64748B] hover:bg-slate-50"
                }
                `}
                >
                {opt}
              </button>
            ))}
          </div>
        </div>

            <div className="w-full h-px border-t border-solid border-[#F1F5F9]" />

        {/* Memory Care Support */}
        <div className="flex items-center justify-between py-2">
          <div className="w-fit h-auto flex flex-col gap-1">
            <p className="text-base font-bold text-[#0F172A]">
              Memory Care Support
            </p>
            <p className="text-sm font-normal text-[#64748B]">
              Available specialized support for Alzheimer&apos;s and Dementia
            </p>
          </div>
          <button
            onClick={() => setMemoryCare(!memoryCare)}
            className={`relative inline-flex items-center w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none flex-shrink-0
            ${memoryCare ? "bg-[#09488B]" : "bg-gray-300"}`}
            role="switch"
            aria-checked={memoryCare}
          >
            <span
              className={`inline-block w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200
              ${memoryCare ? "translate-x-6" : "translate-x-0.5"}`}
            />
          </button>
        </div>

        {/* Gender Preference */}
        <div className="w-full h-auto flex flex-col gap-4">
          <p className="text-base font-bold text-[#0F172A]">
            Gender Preference
          </p>
          <div className="grid grid-cols-3 gap-3">
            {genderOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setGenderPreference(opt)}
                className={`py-3 rounded-xl text-sm font-semibold border-2 transition-colors duration-150 focus:outline-none
                ${
                  genderPreference === opt
                    ? "border-[#09488B] text-[#475569] bg-[#09488B0D]"
                    : "border-[#F1F5F9] text-[#475569] hover:border-slate-300"
                }
              `}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Add a Note */}
        <div className="border border-[#F1F5F9] rounded-xl overflow-hidden">
          <button
            onClick={() => setNoteOpen(!noteOpen)}
            className="w-full flex items-center justify-between px-4 py-3.5 bg-white hover:bg-slate-50 transition-colors duration-150 focus:outline-none"
          >
            <div className="flex items-center gap-2 text-slate-600">
              <AdditionalNoteIcon />
              <span className="text-base text-[#334155] font-semibold">Add a note (Optional)</span>
            </div>
            <ChevronDownIcon />
          </button>
          {noteOpen && (
            <div className="px-4 pb-4 bg-white">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Type your note here..."
                rows={3}
                className="w-full text-sm text-slate-700 border border-gray-200 rounded-lg p-3 resize-none focus:outline-none focus:ring-1 focus:ring-blue-400 placeholder-slate-400"
              />
            </div>
          )}
        </div>
      </div>
      <div className="w-full h-auto py-4 bg-[#FFFFFFCC] sticky bottom-0 left-0 px-10 border-t border-solid border-[#09488B1A] flex justify-between items-center">
        <div className="w-fit h-auto">
          <p className="font-medium text-xs text-[#64748B]">
            {facility?.lastUpdated
              ? `Last updated: ${new Date(facility.lastUpdated).toLocaleString()}`
              : 'Not yet saved'}
          </p>
        </div>
        <div className="w-fit h-auto flex justify-end items-center gap-3">
            <button onClick={handleCancel} className="w-fit h-auto px-6 py-3 rounded-lg flex justify-center items-center">
                <p className="font-semibold text-sm text-[#475569]">Cancel</p>
            </button>
            <button onClick={handleSave} disabled={isSaving || !facility}
              className="w-fit h-auto px-10 py-3 rounded-lg bg-[#09488B] flex justify-center items-center disabled:opacity-50">
                <p className="font-bold text-sm text-white uppercase">{isSaving ? 'Saving…' : 'Save Availability'}</p>
            </button>
        </div>
      </div>
    </div>
  );
};

export default Form;
