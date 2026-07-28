import Header from "@/components/global/header";
import React from "react";
import Stats from "./stats";
import OtherPages from "./otherPages";
import ActivityLogs from "./activityLogs";

const DashboardComponent = () => {
  return (
    <div className="w-full h-full p-10 flex flex-col gap-10">
      <Header
        title="dashboard"
        description="Facility snapshot and quick actions."
      />
      <Stats />
      <OtherPages />
      <ActivityLogs />
    </div>
  );
};

export default DashboardComponent;
