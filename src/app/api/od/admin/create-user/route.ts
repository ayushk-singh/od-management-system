// src/app/api/od/admin/create-user/route.ts
import { clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export async function POST(req: Request) {
  try {
    const {
      email,
      password = "temp@123",
      firstName,
      lastName,
      name, // optional legacy combined name
      role,
      departmentId,
      registerNo,
      className,
    } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (role === "hod") {
      if (!departmentId) {
        return new Response(
          JSON.stringify({ error: "DepartmentId is required for HOD." }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      const existing = await prisma.hOD.findUnique({ where: { departmentId } });
      if (existing) {
        return new Response(
          JSON.stringify({ error: "A department already has a HOD." }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // 1️⃣ Create user in Clerk with full name
    const client = await clerkClient();

    const user = await client.users.createUser({ 
      emailAddress: [email],
      password,
      skipPasswordChecks: true,
      firstName,
      lastName,
      publicMetadata: { role },
    });

    const clerkId = user.id;

    // 2️⃣ Store in your own DB
    if (role === "student") {
      if (!registerNo || !className || !departmentId) {
        return new Response(
          JSON.stringify({ error: "Missing fields for Student." }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      await prisma.student.create({ data: { clerkId, name: name ?? `${firstName} ${lastName}`, registerNo, class: className, departmentId } });
    } else if (role === "faculty") {
      if (!departmentId) {
        return new Response(
          JSON.stringify({ error: "DepartmentId is required for Faculty." }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      await prisma.faculty.create({ data: { clerkId, name: name ?? `${firstName} ${lastName}`, email, departmentId } });
    } else if (role === "hod") {
      if (!departmentId) {
        return new Response(
          JSON.stringify({ error: "DepartmentId is required for HOD." }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      await prisma.hOD.create({ data: { clerkId, name: name ?? `${firstName} ${lastName}`, email, departmentId } });
    }

    return new Response(
      JSON.stringify({ message: "User created successfully.", user }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Clerk createUser error.", err);

    if (err instanceof PrismaClientKnownRequestError) {
      return new Response(
        JSON.stringify({ error: "Prisma Error.", details: err.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    } else if (err instanceof Error) {
      return new Response(
        JSON.stringify({ error: "Error creating user.", details: err.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    } else {
      return new Response(
        JSON.stringify({ error: "Unknown Error.", details: String(err) }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
}
