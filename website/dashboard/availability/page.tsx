import Header from "@/components/global/header";
import Form from "./form";


const AvailabilityComponent = () => {


  return (
    <div className="w-full h-full flex flex-col gap-10 relative">
      <div className="px-10 pt-10 flex flex-col gap-6">
      <Header
        title="Update Availability"
        description="Keep your open beds current so we can match you with placement requests."
        />
        {/* Same wording as the public owner page ("Keep Your Beds Current"). */}
        <div className="max-w-[672px] bg-[#F8FAFC] border border-solid border-[#E2E8F0] rounded-xl px-5 py-4 flex flex-col gap-1.5 text-sm text-[#475569]">
          <p><strong className="text-[#0F172A]">When to update:</strong> whenever a bed opens or fills, and check it at least once a week.</p>
          <p><strong className="text-[#0F172A]">Who sees it:</strong> only the RAL Connect team. We use it to match placement inquiries to your home. It isn&apos;t shown publicly.</p>
          <p><strong className="text-[#0F172A]">Placement requests:</strong> every approved home gets request emails. Click Interested in the email to share your contact details with the requester.</p>
        </div>
        </div>
      <Form />
    </div>
  );
};

export default AvailabilityComponent;
