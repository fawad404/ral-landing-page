import AdminIntelligenceHubDetailPage from '@/website/admin/intelligence-hub/detail/page';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <AdminIntelligenceHubDetailPage id={id} />;
}
