import { Metadata } from 'next';
import AvailabilityRequestForm from '@/components/AvailabilityRequestForm';

export const metadata: Metadata = {
  title: 'Submit Availability Request — RAL Connect',
  description: 'Submit a placement availability request and get connected with RAL facilities across Arizona.',
};

export default function RequestPage() {
  return <AvailabilityRequestForm />;
}
