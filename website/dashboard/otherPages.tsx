import { ChevronPagesIcon } from '@/assets'
import Link from 'next/link'
import React from 'react'
import { APP_ROUTES } from '@/api/endpoints'

type Action = { title: string; description: string; goto: string }

// The placement essentials come first; everything else sits under
// "Explore more" so a new owner doesn't read it as required setup.
const PRIMARY: Action[] = [
  { title: "Facility Profile", description: "Details and total beds", goto: APP_ROUTES.DASHBOARD_PROFILE },
  { title: "Update Availability", description: "Change your open bed count", goto: APP_ROUTES.DASHBOARD_AVAILABILITY },
  { title: "Arizona Updates", description: "Regulatory and industry news", goto: APP_ROUTES.DASHBOARD_UPDATES },
]

const MORE: Action[] = [
  { title: "Compliance Center", description: "Tasks, incidents & credentials", goto: APP_ROUTES.DASHBOARD_COMPLIANCE },
  { title: "Log an Incident", description: "Document incidents quickly", goto: `${APP_ROUTES.DASHBOARD_COMPLIANCE}?tab=incidents` },
  { title: "Staff Credentials", description: "Track expirations & alerts", goto: `${APP_ROUTES.DASHBOARD_COMPLIANCE}?tab=credentials` },
  { title: "Support Network", description: "Vendors & service providers", goto: APP_ROUTES.DASHBOARD_SUPPORT },
  { title: "Deal Room", description: "Owner-to-owner listings", goto: APP_ROUTES.DASHBOARD_DEAL },
  { title: "Caregiver Directory", description: "Find caregivers in your area", goto: APP_ROUTES.DASHBOARD_CAREGIVERS },
  // ── Placement-phase quick actions — re-enable when placement engine launches ──
  // { title: "Create Social Post",  description: "Boost your presence",   goto: APP_ROUTES.DASHBOARD_SOCIAL },
  // ─────────────────────────────────────────────────────────────────────────────
]

const ActionCard = ({ v, primary }: { v: Action; primary?: boolean }) => (
  <Link
    href={v.goto}
    className={`w-[222px] h-auto p-5 rounded-xl border border-solid flex justify-between items-center hover:border-[#09488B] hover:bg-[#09488B08] transition-colors ${
      primary ? 'border-[#09488B40] bg-white shadow-[0px_1px_2px_0px_#0000000D]' : 'border-[#E2E8F0]'
    }`}
  >
    <div className='w-fit h-auto flex flex-col'>
      <p className='text-base font-bold text-[#0F172A]'>{v.title}</p>
      <p className='text-xs font-normal text-[#64748B]'>{v.description}</p>
    </div>
    <div className='w-fit h-auto flex items-center justify-end'>
      <ChevronPagesIcon />
    </div>
  </Link>
)

const OtherPages = () => {
  return (
    <div className='w-full h-auto flex flex-col gap-6'>
      <div className='flex flex-col gap-3'>
        <p className='text-xs font-bold uppercase tracking-wider text-[#94A3B8]'>Main tools</p>
        <div className='flex flex-wrap gap-4'>
          {PRIMARY.map((v) => <ActionCard key={v.title} v={v} primary />)}
        </div>
      </div>
      <div className='flex flex-col gap-3'>
        <p className='text-xs font-bold uppercase tracking-wider text-[#94A3B8]'>
          Explore more <span className='normal-case font-normal tracking-normal'>(optional, use when you need them)</span>
        </p>
        <div className='flex flex-wrap gap-4'>
          {MORE.map((v) => <ActionCard key={v.title} v={v} />)}
        </div>
      </div>
    </div>
  )
}

export default OtherPages
