import AdminInquiryDetailPage from '@/website/admin/inquiries/detail/page';

interface Props { params: Promise<{ id: string }> }

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <AdminInquiryDetailPage id={id} />;
}
