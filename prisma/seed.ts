import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const dept = await prisma.department.create({
    data: {
      name: "BBA",
    },
  });


  // await prisma.faculty.create({
  //   data: {
  //     name: "Prof. other",
  //     email: "faculty1@oms.com",
  //     clerkId: "user_2y52RoeJVuXkhaE6n4qAf73ogx",
  //     departmentId: "cmbjn8s250000jt0v2v4mnm3j",
  //   },
  // });

  await prisma.hOD.create({
    data: {
      name: "Dr. Sharma",
      email: "bbahod@oms.com",
      clerkId: "user_2y7n7piLxFCDVLgCRFzNSKKLop1",
      departmentId: dept.id,
    },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
