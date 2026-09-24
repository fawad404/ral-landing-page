'use client';
import Link from "next/link";
import React from "react";
import { APP_ROUTES } from "@/api/endpoints";
import { useMyFacilities } from "@/hooks/useFacilities";

// First-run guide for new owners (Patrick's review 2026-09-24): the three steps
// that matter before anything else. Hidden once the listing is live and set up.
const SetupSteps = () => {
  const { data: facilities } = useMyFacilities();
  const facility = facilities?.[0];
  if (!facility) return null;

  const detailsDone = facility.capacity > 0 && !!facility.address?.city;
  const live = facility.status === "approved" && facility.isVisible;
  if (detailsDone && live) return null;

  const requestsText =
    facility.status === "approved"
      ? live
        ? "Your listing is live. Placement requests arrive by email. Click Interested to share your contact details with the requester."
        : "Your listing is approved but hidden, so you won't get placement requests. Contact support to turn it back on."
      : facility.status === "rejected"
        ? "Your listing wasn't approved. Contact support and we'll explain what's needed."
        : "Once the RAL Connect team approves your listing, placement requests arrive by email. Click Interested in the email to respond.";

  const steps = [
    {
      title: "Add your facility details and total beds",
      text: "Facility name, city and total beds are needed for review. Everything else is optional.",
      href: APP_ROUTES.DASHBOARD_PROFILE,
      cta: "Open Facility Profile",
      done: detailsDone,
    },
    {
      title: "Set your available beds",
      text: detailsDone
        ? "Enter how many beds are open. Update it whenever a bed opens or fills."
        : "Available after step 1, because it's counted against your total beds.",
      href: APP_ROUTES.DASHBOARD_AVAILABILITY,
      cta: "Update Availability",
      done: false,
    },
    {
      title: "Watch for placement requests",
      text: requestsText,
      done: live,
    },
  ];

  return (
    <div className="w-full bg-white border border-solid border-[#E2E8F0] rounded-2xl shadow-[0px_1px_2px_0px_#0000000D] p-6 flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <p className="text-lg font-bold text-[#0F172A]">Welcome to RAL Connect. Get set up in 3 steps.</p>
        <p className="text-sm text-[#64748B]">Your account is approved. These steps get your home ready for placement requests.</p>
      </div>
      <ol className="grid grid-cols-3 gap-4">
        {steps.map((s, i) => (
          <li key={s.title} className="rounded-xl border border-solid border-[#E2E8F0] bg-[#F8FAFC] p-5 flex flex-col gap-2">
            <span
              className={`size-7 rounded-full flex items-center justify-center text-sm font-bold ${
                s.done ? "bg-[#10B981] text-white" : "bg-[#09488B] text-white"
              }`}
            >
              {s.done ? "✓" : i + 1}
            </span>
            <p className="text-sm font-bold text-[#0F172A]">{s.title}</p>
            <p className="text-xs text-[#64748B] leading-relaxed flex-1">{s.text}</p>
            {s.href && (
              <Link href={s.href} className="text-sm font-semibold text-[#09488B] hover:underline w-fit">
                {s.cta} →
              </Link>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default SetupSteps;
