"use client";
import React, { useEffect, useState } from "react";
import CustomSelect from "@/components/global/CustomSelect";
import { useMyFacilities, useUpdateFacility } from "@/hooks/useFacilities";

const licenseTypes = [
  "Assisted Living Center",
  "Residential Care Home",
  "Memory Care Facility",
  "Skilled Nursing Facility",
  "Independent Living",
];

const Overview = () => {
  const { data: facilities, isLoading } = useMyFacilities();
  const facility = facilities?.[0];
  const update = useUpdateFacility(facility?._id ?? '');

  const [facilityName, setFacilityName] = useState("");
  const [city, setCity] = useState("");
  const [licenseType, setLicenseType] = useState("Assisted Living Center");
  const [capacity, setCapacity] = useState("");
  const [adminName, setAdminName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (facility) {
      setFacilityName(facility.name ?? "");
      setCity(facility.address?.city ?? "");
      setCapacity(String(facility.capacity ?? ""));
      setAdminName(facility.adminName ?? "");
      setLicenseType(facility.licenseType ?? "Assisted Living Center");
      setPhone(facility.phone ?? "");
      setEmail(facility.email ?? "");
    }
  }, [facility]);

  const handleSave = () => {
    if (!facility) return;
    update.mutate({
      name: facilityName,
      capacity: Number(capacity) || undefined,
      adminName: adminName || undefined,
      licenseType: licenseType || undefined,
      phone: phone || undefined,
      email: email || undefined,
      address: {
        ...facility.address,
        city: city || undefined,
      },
    });
  };

  const handleDiscard = () => {
    if (!facility) return;
    setFacilityName(facility.name ?? "");
    setCity(facility.address?.city ?? "");
    setCapacity(String(facility.capacity ?? ""));
    setAdminName(facility.adminName ?? "");
    setLicenseType(facility.licenseType ?? "Assisted Living Center");
    setPhone(facility.phone ?? "");
    setEmail(facility.email ?? "");
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-32">
      <div className="w-8 h-8 border-4 border-[#09488B] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!facility) return (
    <div className="mx-10 mt-4">
      <div className="bg-[#09488B0D] border border-[#09488B1A] rounded-xl px-5 py-4">
        <p className="text-sm font-semibold text-[#09488B]">No facility registered yet. Your facility profile will appear here once created.</p>
      </div>
    </div>
  );

  return (
    <div className="w-full grow">
      <div className="mx-10 mb-10 flex flex-col gap-6">
        {/* Main Form Card */}
        <div className="bg-white rounded-xl shadow-[0px_1px_2px_0px_#0000000D] border border-solid border-[#E2E8F0] p-8 flex flex-col gap-6">

          {/* Row 1: Facility Name + City */}
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#334155]">
                Facility Name
              </label>
              <input
                type="text"
                value={facilityName}
                onChange={(e) => setFacilityName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-solid border-[#E2E8F0] text-sm font-normal text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#09488B33] focus:border-[#09488B] transition-colors placeholder-[#94A3B8]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#334155]">
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-solid border-[#E2E8F0] text-sm font-normal text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#09488B33] focus:border-[#09488B] transition-colors placeholder-[#94A3B8]"
              />
            </div>
          </div>

          {/* Row 2: License Type + Capacity */}
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#334155]">
                License Type
              </label>
              <CustomSelect
                value={licenseType}
                onChange={setLicenseType}
                options={licenseTypes.map((t) => ({ value: t, label: t }))}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#334155]">
                Capacity
              </label>
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-solid border-[#E2E8F0] text-sm font-normal text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#09488B33] focus:border-[#09488B] transition-colors placeholder-[#94A3B8]"
              />
            </div>
          </div>

          {/* Row 3: Admin Name + Phone */}
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#334155]">
                Admin Name
              </label>
              <input
                type="text"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                placeholder="Facility administrator name"
                className="w-full px-4 py-3 rounded-lg border border-solid border-[#E2E8F0] text-sm font-normal text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#09488B33] focus:border-[#09488B] transition-colors placeholder-[#94A3B8]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#334155]">
                Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-solid border-[#E2E8F0] text-sm font-normal text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#09488B33] focus:border-[#09488B] transition-colors placeholder-[#94A3B8]"
              />
            </div>
          </div>

          {/* Row 4: Email Address */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#334155]">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-solid border-[#E2E8F0] text-sm font-normal text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#09488B33] focus:border-[#09488B] transition-colors placeholder-[#94A3B8]"
            />
          </div>

          {/* Location */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-[#334155]">
              Location
            </label>
            <div className="w-full h-48 rounded-xl overflow-hidden border border-solid border-[#E2E8F0] bg-[#E8EEF2] relative flex items-center justify-center">
              {/* Map grid lines background */}
              <div className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage: `
                    linear-gradient(#B8C9D9 1px, transparent 1px),
                    linear-gradient(90deg, #B8C9D9 1px, transparent 1px)
                  `,
                  backgroundSize: "40px 40px",
                }}
              />
              {/* Map pin + label */}
              <div className="relative flex flex-col items-center gap-2">
                <div className="w-10 h-10 bg-[#09488B] rounded-full flex items-center justify-center shadow-lg">
                  <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 0C5.87827 0 3.84344 0.842855 2.34315 2.34315C0.842855 3.84344 0 5.87827 0 8C0 13.25 8 20 8 20C8 20 16 13.25 16 8C16 5.87827 15.1571 3.84344 13.6569 2.34315C12.1566 0.842855 10.1217 0 8 0ZM8 11C7.20435 11 6.44129 10.6839 5.87868 10.1213C5.31607 9.55871 5 8.79565 5 8C5 7.20435 5.31607 6.44129 5.87868 5.87868C6.44129 5.31607 7.20435 5 8 5C8.79565 5 9.55871 5.31607 10.1213 5.87868C10.6839 6.44129 11 7.20435 11 8C11 8.79565 10.6839 9.55871 10.1213 10.1213C9.55871 10.6839 8.79565 11 8 11Z" fill="white" />
                  </svg>
                </div>
                <div className="bg-white px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.95 16.35L4.4 12.8L5.85 11.35L7.95 13.45L12.15 9.25L13.6 10.7L7.95 16.35ZM10 20C7.68333 19.4167 5.77083 18.0875 4.2625 16.0125C2.75417 13.9375 2 11.6333 2 9.1V3L10 0L18 3V9.1C18 11.6333 17.2458 13.9375 15.7375 16.0125C14.2292 18.0875 12.3167 19.4167 10 20Z" fill="#10B981" />
                  </svg>
                  <span className="text-xs font-semibold text-[#0F172A]">Map location verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
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

export default Overview;
