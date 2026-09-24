"use client";
import { ContactButtonIcon, SearchIcon, StarIcon } from "@/assets";
import Header from "@/components/global/header";
import React, { useState } from "react";
import { useVisiblePartners, usePartnerCategories } from "@/hooks/usePartners";
import type { Partner } from "@/types/partner.types";

const VendorCard = ({ partner }: { partner: Partner }) => (
  <div className="bg-white rounded-xl border border-solid border-[#E2E8F0] overflow-hidden flex flex-col">
    {/* Image / Logo placeholder */}
    <div className="w-full h-40 bg-linear-to-br from-[#EFF6FF] to-[#DBEAFE] flex items-center justify-center relative">
      {partner.logoUrl ? (
        <img src={partner.logoUrl} alt={partner.name} className="w-16 h-16 object-contain rounded-lg" />
      ) : (
        <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm">🤝</div>
      )}
    </div>
    {/* Content */}
    <div className="p-5 pb-4 flex flex-col gap-1 flex-1">
      <p className="text-[10px] font-bold uppercase tracking-widest text-[#09488B]">
        {partner.category}
      </p>
      <p className="text-lg font-bold text-[#0F172A]">{partner.name}</p>
      {partner.description && (
        <p className="text-xs text-[#64748B] line-clamp-2 mt-0.5">{partner.description}</p>
      )}
    </div>
    {/* Footer */}
    <div className="p-5 pt-4 flex items-center justify-between">
      <span className="text-xs font-normal text-[#64748B]">
        {partner.contactInfo?.website ?? partner.contactInfo?.address ?? ''}
      </span>
      {partner.contactInfo?.phone || partner.contactInfo?.email ? (
        <a
          href={partner.contactInfo.phone ? `tel:${partner.contactInfo.phone}` : `mailto:${partner.contactInfo.email}`}
          className="flex items-center gap-2 bg-[#09488B] text-white text-xs font-semibold px-5 py-2 rounded-lg hover:bg-[#083d77] transition-colors"
        >
          <ContactButtonIcon />
          Contact
        </a>
      ) : (
        <button className="flex items-center gap-2 bg-[#09488B] text-white text-xs font-semibold px-5 py-2 rounded-lg hover:bg-[#083d77] transition-colors">
          <ContactButtonIcon />
          Contact
        </button>
      )}
    </div>
  </div>
);

const SupportNetworkComponent = () => {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const { data: partners = [], isLoading, isError } = useVisiblePartners();
  const { data: categories = [] } = usePartnerCategories();

  // Only offer categories that have a listed provider (a hidden vendor's
  // category would otherwise show a filter with nothing behind it).
  const filterOptions = ["All", ...categories.filter((c) => partners.some((p) => p.category === c))];

  const filtered = partners.filter((p) => {
    const matchesFilter = activeFilter === "All" || p.category === activeFilter;
    const matchesSearch =
      search.trim() === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      (p.description ?? "").toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="w-full h-full flex flex-col gap-8 p-10">
      <Header
        title="Support Network"
        description="Vendors, contractors and care support providers listed on RAL Connect."
      />
      <p className="-mt-4 max-w-3xl text-sm text-[#64748B]">
        The RAL Connect team reviews each listing before it appears here. That review isn&apos;t an endorsement, so check
        licenses, insurance and references before you hire.
      </p>

      {/* Search */}
      <div className="relative w-full">
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <SearchIcon />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by vendor name, service category, or specialty area..."
          className="w-full pl-12 pr-4 py-4.5 rounded-xl border border-solid border-[#E2E8F0] bg-white text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#09488B33] focus:border-[#09488B] transition-colors placeholder-[#94A3B8] shadow-[0px_1px_2px_0px_#0000000D]"
        />
      </div>

      {/* Quick Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wide">Quick Filters:</span>
        {filterOptions.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-1.5 rounded-full text-xs transition-colors duration-150 focus:outline-none capitalize ${
              activeFilter === filter
                ? "bg-[#09488B] text-white font-bold"
                : "bg-[#ffffff] text-[#475569] hover:bg-[#E2E8F0] font-semibold border border-solid border-[#E2E8F0]"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Vendor Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="w-8 h-8 border-4 border-[#09488B] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : isError ? (
        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4">
          <p className="text-sm font-semibold text-red-700">Failed to load support network. Please try again later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-5">
          {filtered.map((partner) => (
            <VendorCard key={partner._id} partner={partner} />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-3 py-20 flex flex-col items-center gap-3">
              {partners.length === 0 ? (
                <>
                  <p className="text-base font-semibold text-[#475569]">No providers are listed yet</p>
                  <p className="text-sm text-[#94A3B8] max-w-md text-center">
                    We&apos;re adding Arizona vendors and service providers. Looking for someone specific?{" "}
                    <a href="mailto:info@ralconnect.com?subject=Support%20Network%20request" className="font-semibold text-[#09488B] hover:underline">Tell us</a>{" "}
                    and we&apos;ll try to help.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-base font-semibold text-[#94A3B8]">No providers match your search</p>
                  <p className="text-sm text-[#CBD5E1]">Try a different search or filter.</p>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SupportNetworkComponent;
