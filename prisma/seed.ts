import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const dept = await prisma.department.create({
    data: {
      name: "BCA",
    },
  });


  await prisma.student.create({
    data: {
      name: "Ayush Singh",
      registerNo: "23BCA207",
      class: "III-BCA-C",
      clerkId: "user_2yBOklDpyn7VyqXdt8Tk2KsQB34",
      departmentId: dept.id,
    },
  });


  await prisma.faculty.create({
    data: {
      name: "Faculty Surname",
      email: "faculty@oms.com",
      clerkId: "user_2yBOqJhSEskVvld5WA5AO7OxBBc",
      departmentId: dept.id,
    },
  });

  await prisma.hOD.create({
    data: {
      name: "HOD surname",
      email: "hod@oms.com",
      clerkId: "user_2yBOnQcbtpol45MoWk21UI5Bx3x",
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