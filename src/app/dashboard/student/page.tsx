import React from "react";
import { StudentODStats } from "@/components/dashboard/student/student-od-stats";
import { Greeting } from "@/components/greeting";
import MyApplications from "@/components/dashboard/student/my-applications";

function page() {
  return (
    <div>
      <Greeting />
      <StudentODStats />
      <div className="p-10">
      <h2 className="text-2xl font-bold mb-4">My Applications</h2>
      <MyApplications />
      </div>
    </div>
  );
}

export default page;
