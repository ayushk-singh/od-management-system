import React from "react";
import { ApplyOd } from "@/components/dashboard/student/apply-od";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export default async function Page() {
  const { userId } = await auth(); 

  if (!userId) {
    return <div>Please login to apply for OD</div>;
  }

  const student = await prisma.student.findUnique({
    where: { clerkId: userId },
    select: { departmentId: true },
  });

  if (!student) {
    return <div>Student profile not found</div>;
  }

  const faculties = await prisma.faculty.findMany({
    where: { departmentId: student.departmentId },
    select: { id: true, name: true },
  });

  return (
    <div className="p-10">
      <ApplyOd faculties={faculties} />
    </div>
  );
}
