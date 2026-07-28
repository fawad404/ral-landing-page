"use client";
import React, { useEffect, useState } from "react";
import { useMyFacilities, useUpdateFacility } from "@/hooks/useFacilities";

const Contact = () => {
  const { data: facilities, isLoading } = useMyFacilities();
  const facility = facilities?.[0];
  const update = useUpdateFacility(facility?._id ?? '');

  const [primaryPhone, setPrimaryPhone] = useState("");
  const [secondaryPhone, setSecondaryPhone] = useState("");
  const [fax, setFax] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [linkedin, setLinkedin] = useState("");

  useEffect(() => {
    if (facility) {
      setPrimaryPhone(facility.phone ?? "");
      setSecondaryPhone(facility.secondaryPhone ?? "");
      setFax(facility.fax ?? "");
      setWebsite(facility.website ?? "");
      setAddress(facility.address?.street ?? "");
      setState(facility.address?.state ?? "");
      setZip(facility.address?.zipCode ?? "");
      setFacebook(facility.socialMedia?.facebook ?? "");
      setInstagram(facility.socialMedia?.instagram ?? "");
      setLinkedin(facility.socialMedia?.linkedin ?? "");
    }
  }, [facility]);

  const handleSave = () => {
    if (!facility) return;
    update.mutate({
      phone: primaryPhone || undefined,
      secondaryPhone: secondaryPhone || undefined,
      fax: fax || undefined,
      website: website || undefined,
      address: {
        ...facility.address,
        street: address || undefined,
        state: state || undefined,
        zipCode: zip || undefined,
      },
      socialMedia: {
        facebook: facebook || undefined,
        instagram: instagram || undefined,
        linkedin: linkedin || undefined,
      },
    });
  };

  const handleDiscard = () => {
    if (!facility) return;
    setPrimaryPhone(facility.phone ?? "");
    setSecondaryPhone(facility.secondaryPhone ?? "");
    setFax(facility.fax ?? "");
    setWebsite(facility.website ?? "");
    setAddress(facility.address?.street ?? "");
    setState(facility.address?.state ?? "");
    setZip(facility.address?.zipCode ?? "");
    setFacebook(facility.socialMedia?.facebook ?? "");
    setInstagram(facility.socialMedia?.instagram ?? "");
    setLinkedin(facility.socialMedia?.linkedin ?? "");
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-32">
      <div className="w-8 h-8 border-4 border-[#09488B] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!facility) return (
    <div className="mx-10 mt-4">
      <div className="bg-[#09488B0D] border border-[#09488B1A] rounded-xl px-5 py-4">
        <p className="text-sm font-semibold text-[#09488B]">No facility registered yet. Contact details will appear here once your facility is created.</p>
      </div>
    </div>
  );

  return (
    <div className="w-full grow">
      <div className="mx-10 mb-10 flex flex-col gap-6">

        {/* Phone & Online Contact */}
        <div className="bg-white rounded-xl border border-solid border-[#E2E8F0] p-6 flex flex-col gap-6">
          <p className="text-sm font-bold text-[#94A3B8] uppercase tracking-wide">Phone & Online Contact</p>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#0F172A]">Primary Phone</label>
              <input
                type="tel"
                value={primaryPhone}
                onChange={(e) => setPrimaryPhone(e.target.value)}
                placeholder="(000) 000-0000"
                className="w-full px-4 py-3 rounded-lg border border-solid border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#09488B33] focus:border-[#09488B] transition-colors placeholder-[#94A3B8]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#0F172A]">Secondary Phone <span className="text-[#94A3B8] font-normal">(Optional)</span></label>
              <input
                type="tel"
                value={secondaryPhone}
                onChange={(e) => setSecondaryPhone(e.target.value)}
                placeholder="(000) 000-0000"
                className="w-full px-4 py-3 rounded-lg border border-solid border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#09488B33] focus:border-[#09488B] transition-colors placeholder-[#94A3B8]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#0F172A]">Fax <span className="text-[#94A3B8] font-normal">(Optional)</span></label>
              <input
                type="tel"
                value={fax}
                onChange={(e) => setFax(e.target.value)}
                placeholder="(000) 000-0000"
                className="w-full px-4 py-3 rounded-lg border border-solid border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#09488B33] focus:border-[#09488B] transition-colors placeholder-[#94A3B8]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#0F172A]">Website <span className="text-[#94A3B8] font-normal">(Optional)</span></label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="www.yourfacility.com"
                className="w-full px-4 py-3 rounded-lg border border-solid border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#09488B33] focus:border-[#09488B] transition-colors placeholder-[#94A3B8]"
              />
            </div>
          </div>
        </div>

        {/* Physical Address */}
        <div className="bg-white rounded-xl border border-solid border-[#E2E8F0] p-6 flex flex-col gap-6">
          <p className="text-sm font-bold text-[#94A3B8] uppercase tracking-wide">Physical Address</p>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#0F172A]">Street Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Main Street"
              className="w-full px-4 py-3 rounded-lg border border-solid border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#09488B33] focus:border-[#09488B] transition-colors placeholder-[#94A3B8]"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#0F172A]">State</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="State"
                className="w-full px-4 py-3 rounded-lg border border-solid border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#09488B33] focus:border-[#09488B] transition-colors placeholder-[#94A3B8]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#0F172A]">ZIP Code</label>
              <input
                type="text"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                placeholder="00000"
                className="w-full px-4 py-3 rounded-lg border border-solid border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#09488B33] focus:border-[#09488B] transition-colors placeholder-[#94A3B8]"
              />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white rounded-xl border border-solid border-[#E2E8F0] p-6 flex flex-col gap-6">
          <div>
            <p className="text-sm font-bold text-[#94A3B8] uppercase tracking-wide">Social Media</p>
            <p className="text-xs text-[#64748B] mt-1">Optional — helps prospective residents find and follow your facility online.</p>
          </div>

          <div className="flex flex-col gap-5">
            {/* Facebook */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#0F172A] flex items-center gap-2">
                <span className="w-5 h-5 flex items-center justify-center">
                  <svg width="10" height="18" viewBox="0 0 10 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 1H6.5C5.4 1 4 2.1 4 3.5V6H1V9H4V17H7V9H9.5L10 6H7V3.5C7 3.2 7.3 3 7.5 3H9V1Z" fill="#1877F2" stroke="#1877F2" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                Facebook
              </label>
              <input
                type="text"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                placeholder="https://facebook.com/yourfacility"
                className="w-full px-4 py-3 rounded-lg border border-solid border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#09488B33] focus:border-[#09488B] transition-colors placeholder-[#94A3B8]"
              />
            </div>

            {/* Instagram */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#0F172A] flex items-center gap-2">
                <span className="w-5 h-5 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="1" y="1" width="16" height="16" rx="4" stroke="#E1306C" strokeWidth="1.5" />
                    <circle cx="9" cy="9" r="3.5" stroke="#E1306C" strokeWidth="1.5" />
                    <circle cx="13.5" cy="4.5" r="0.75" fill="#E1306C" />
                  </svg>
                </span>
                Instagram
              </label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="https://instagram.com/yourfacility"
                className="w-full px-4 py-3 rounded-lg border border-solid border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#09488B33] focus:border-[#09488B] transition-colors placeholder-[#94A3B8]"
              />
            </div>

            {/* LinkedIn */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#0F172A] flex items-center gap-2">
                <span className="w-5 h-5 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="1" y="1" width="16" height="16" rx="3" stroke="#0A66C2" strokeWidth="1.5" />
                    <path d="M5 7.5V13M5 5V5.5M8.5 13V10C8.5 8.9 9.4 8 10.5 8C11.6 8 12.5 8.9 12.5 10V13M8.5 7.5V13" stroke="#0A66C2" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </span>
                LinkedIn
              </label>
              <input
                type="text"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/company/yourfacility"
                className="w-full px-4 py-3 rounded-lg border border-solid border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#09488B33] focus:border-[#09488B] transition-colors placeholder-[#94A3B8]"
              />
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

export default Contact;
