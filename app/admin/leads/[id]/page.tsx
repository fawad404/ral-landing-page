import LeadDetailPage from '@/website/admin/leads/[id]/page';

interface Props { params: Promise<{ id: string }> }

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <LeadDetailPage id={id} />;
}
