import { ChevronPagesIcon } from '@/assets'
import Link from 'next/link'
import React from 'react'
import { APP_ROUTES } from '@/api/endpoints'

const OtherPages = () => {
  const details = [
    {
      title: "Compliance Center",
      description: "Tasks, incidents & credentials",
      goto: APP_ROUTES.DASHBOARD_COMPLIANCE,
    },
    {
      title: "Edit Facility Profile",
      description: "Keep your data current",
      goto: APP_ROUTES.DASHBOARD_PROFILE,
    },
    {
      title: "Log an Incident",
      description: "Document incidents quickly",
      goto: `${APP_ROUTES.DASHBOARD_COMPLIANCE}?tab=incidents`,
    },
    {
      title: "Staff Credentials",
      description: "Track expirations & alerts",
      goto: `${APP_ROUTES.DASHBOARD_COMPLIANCE}?tab=credentials`,
    },
    {
      title: "Support Network",
      description: "Find verified vendors & partners",
      goto: APP_ROUTES.DASHBOARD_SUPPORT,
    },
    {
      title: "Deal Room",
      description: "Browse & post facility listings",
      goto: APP_ROUTES.DASHBOARD_DEAL,
    },
    {
      title: "Caregiver Directory",
      description: "Find caregivers in your area",
      goto: APP_ROUTES.DASHBOARD_CAREGIVERS,
    },
    // ── Placement-phase quick actions — re-enable when placement engine launches ──
    // { title: "Update Availability", description: "Manage room counts",    goto: APP_ROUTES.DASHBOARD_AVAILABILITY },
    // { title: "Create Social Post",  description: "Boost your presence",   goto: APP_ROUTES.DASHBOARD_SOCIAL },
    // ─────────────────────────────────────────────────────────────────────────────
  ]

  return (
    <div className='w-full h-auto flex flex-wrap gap-4'>
      {details.map((v, i) => (
        <Link
          key={i}
          href={v.goto}
          className='w-[222px] h-auto p-5 rounded-xl border border-solid border-[#E2E8F0] flex justify-between items-center hover:border-[#09488B] hover:bg-[#09488B08] transition-colors'
        >
          <div className='w-fit h-auto flex flex-col'>
            <p className='text-base font-bold text-[#0F172A]'>{v.title}</p>
            <p className='text-xs font-normal text-[#64748B]'>{v.description}</p>
          </div>
          <div className='w-fit h-auto flex items-center justify-end'>
            <ChevronPagesIcon />
          </div>
        </Link>
      ))}
    </div>
  )
}

export default OtherPages
