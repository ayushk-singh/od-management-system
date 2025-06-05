import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
//   const dept = await prisma.department.create({
//     data: {
//       name: "BCA",
//     },
//   });

//   await prisma.student.create({
//     data: {
//       name: "Ayush",
//       registerNo: "23BCA207",
//       class: "III-BCA-C",
//       clerkId: "user_2y52PLo6i7JXf2JIgVCxsXezzWh",
//       departmentId: dept.id,
//     },
//   });

  await prisma.faculty.create({
    data: {
      name: "Prof. other",
      email: "faculty1@oms.com",
      clerkId: "user_2y52RoeJVuXkhaE6n4qAf73ogx",
      departmentId: "cmbjn8s250000jt0v2v4mnm3j",
    },
  });

//   await prisma.hOD.create({
//     data: {
//       name: "Dr. Verma",
//       email: "hod@oms.com",
//       clerkId: "user_2y52U9snZBM0Myq2t8bMvOneTwK",
//       departmentId: dept.id,
//     },
//   });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
