import React from "react";
import ManageApplications from "@/components/dashboard/faculty/manage-applications";
import { FacultyODStats } from "@/components/dashboard/faculty/faculty-od-stats";
import { Greeting } from "@/components/greeting";

function page() {
  return (
    <div>
      <Greeting/>
      <FacultyODStats />
      <div className="p-10">
      <h2 className="text-2xl font-bold mb-4">My Applications</h2>
      <ManageApplications />
      </div>
    </div>
  );
}

export default page;
