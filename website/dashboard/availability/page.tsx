import Header from "@/components/global/header";
import Form from "./form";


const AvailabilityComponent = () => {


  return (
    <div className="w-full h-full flex flex-col gap-10 relative">
      <div className="px-10 pt-10">
      <Header
        title="Update Availability"
        description="Keep your room availability current for accurate visibility."
        />
        </div>
      <Form />
    </div>
  );
};

export default AvailabilityComponent;
