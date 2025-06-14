import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const [students, faculties, hods] = await Promise.all([
      prisma.student.findMany({ include: { department: true } }),
      prisma.faculty.findMany({ include: { department: true } }),
      prisma.hOD.findMany({ include: { department: true } }),
    ]);

    // Combine into a unified array with role field
    const users = [
      ...students.map((s) => ({
        id: s.id,
        clerkId: s.clerkId,
        name: s.name,
        email: null,
        registerNo: s.registerNo,
        class: s.class,
        department: s.department?.name,
        role: "Student",
      })),
      ...faculties.map((f) => ({
        id: f.id,
        clerkId: f.clerkId,
        name: f.name,
        email: f.email,
        registerNo: null,
        class: null,
        department: f.department?.name,
        role: "Faculty",
      })),
      ...hods.map((h) => ({
        id: h.id,
        clerkId: h.clerkId,
        name: h.name,
        email: h.email,
        registerNo: null,
        class: null,
        department: h.department?.name,
        role: "HOD",
      })),
    ];

    return NextResponse.json({ users });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
