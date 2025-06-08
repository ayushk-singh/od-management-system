import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create department
  const dept = await prisma.department.create({
    data: {
      name: "BCA",
    },
  });

  // Create student
  const student = await prisma.student.create({
    data: {
      name: "Ayush",
      registerNo: "23BCA207",
      class: "III-BCA-C",
      clerkId: "user_2y52PLo6i7JXf2JIgVCxsXezzWh",
      departmentId: dept.id,
    },
  });

  // Create faculty
  const faculty = await prisma.faculty.create({
    data: {
      name: "Jayalakshmi",
      email: "faculty@oms.com",
      clerkId: "user_2y52RoeJVuXkhagE6n4qAf73ogx",
      departmentId: dept.id,
    },
  });

  // Create HOD
  await prisma.hOD.create({
    data: {
      name: "Dr. Verma",
      email: "hod@oms.com",
      clerkId: "user_2y52U9snZBM0Myq2t8bMvOneTwK",
      departmentId: dept.id,
    },
  });

  // Create 10 OD applications for Ayush and Jayalakshmi
    // Create 10 OD applications for Ayush and Jayalakshmi
  const odApplicationsData = [];

  const now = new Date();
  for (let i = 0; i < 10; i++) {
    const dateFrom = new Date(now);
    dateFrom.setDate(now.getDate() + i);

    const dateTo = new Date(dateFrom);
    dateTo.setDate(dateFrom.getDate() + 1);

    odApplicationsData.push({
      studentId: student.id,
      facultyId: faculty.id,
      location: `Location ${i + 1}`,
      dateFrom: dateFrom,
      dateTo: dateTo,
      totalDays: 1,
      reason: `OD Reason number ${i + 1}`,
    });
  }

  await prisma.oDApplication.createMany({
    data: odApplicationsData,
  });

  console.log("Seed completed.");
}


main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
