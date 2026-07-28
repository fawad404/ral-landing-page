import { Metadata } from 'next';
import { Suspense } from 'react';
import AvailabilityRespondPage from '@/components/AvailabilityRespondPage';

export const metadata: Metadata = {
  title: 'Respond to Availability Request — RAL Connect',
  description: 'Respond to a RAL availability request.',
};

export default function RespondPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#09488B] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <AvailabilityRespondPage />
    </Suspense>
  );
}
