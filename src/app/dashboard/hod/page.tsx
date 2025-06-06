import React from "react";
import { HODODStats } from "@/components/dashboard/hod/hod-od-stats";
import ManageApplicationsHOD from "@/components/dashboard/hod/manage-application";
import { Greeting } from "@/components/greeting";

function page() {
  return (
    <div>
      <Greeting/>
      <HODODStats />
      <div className="p-10">
        <ManageApplicationsHOD />
      </div>
    </div>
  );
}

export default page;
