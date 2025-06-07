import { createClerkClient } from "@clerk/backend";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import fs from "fs";
import csv from "csv-parser";

dotenv.config();

const prisma = new PrismaClient();
const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

async function createUser(user) {
  // Split full name into first and last name
  const [firstName, ...lastNameParts] = user.name.trim().split(" ");
  const lastName = lastNameParts.join(" ") || undefined;

  try {
    // 1. Create Clerk User using clerkClient
    const clerkUser = await clerkClient.users.createUser({
      emailAddress: user.email,
      password: user.password,
      firstName,
      lastName,
    });

    const clerkId = clerkUser.id;

    // 2. Get or create department
    let department = await prisma.department.findUnique({
      where: { name: user.departmentName },
    });

    if (!department) {
      department = await prisma.department.create({
        data: { name: user.departmentName },
      });
    }

    const deptId = department.id;

    // 3. Create record in Prisma based on role
    if (user.role === "student") {
      if (!user.registerNo || !user.class) throw new Error("Student missing fields: registerNo or class");
      await prisma.student.create({
        data: {
          clerkId,
          name: user.name,
          registerNo: user.registerNo,
          class: user.class,
          departmentId: deptId,
        },
      });
    } else if (user.role === "faculty") {
      await prisma.faculty.create({
        data: {
          clerkId,
          name: user.name,
          email: user.email,
          departmentId: deptId,
        },
      });
    } else if (user.role === "hod") {
      await prisma.hOD.create({
        data: {
          clerkId,
          name: user.name,
          email: user.email,
          departmentId: deptId,
        },
      });
    } else {
      throw new Error(`Unknown role: ${user.role}`);
    }

    console.log(`✅ ${user.role} '${user.name}' created successfully.`);
  } catch (err) {
    // Detailed error logging
    if (err.response && err.response.body) {
      console.error(`❌ Clerk error for ${user.email}:`, err.response.body);
    } else {
      console.error(`❌ Failed to create ${user.name} (${user.email}):`, err.message || err);
    }
  }
}

function runFromCSV(csvPath) {
  const users = [];

  fs.createReadStream(csvPath)
    .pipe(csv())
    .on("data", (row) => {
      users.push({
        name: row.name,
        email: row.email,
        password: row.password,
        registerNo: row.registerNo || undefined,
        class: row.class || undefined,
        departmentName: row.departmentName,
        role: row.role,
      });
    })
    .on("end", async () => {
      console.log(`🚀 Starting user creation for ${users.length} users...`);
      for (const user of users) {
        await createUser(user);
      }
      await prisma.$disconnect();
      console.log("🎉 All users processed.");
    })
    .on("error", (error) => {
      console.error("❌ Failed to read CSV file:", error);
    });
}

// Replace with your CSV path relative to script location
runFromCSV("src/scripts/data.csv");
