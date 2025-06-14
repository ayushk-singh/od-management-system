import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const url = new URL(request.url);
  const q = url.searchParams.get("q") || "";

  // Find user in student, faculty, or hod tables
  const student = await prisma.student.findUnique({ where: { clerkId: userId } });
  const faculty = await prisma.faculty.findUnique({ where: { clerkId: userId } });
  const hod = await prisma.hOD.findUnique({ where: { clerkId: userId } });

  if (!student && !faculty && !hod) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Base search filter: OD ID or student registerNo contains q (case-insensitive)
  const baseFilter = {
    OR: [
      { id: { contains: q, mode: "insensitive" } },
      { student: { registerNo: { contains: q, mode: "insensitive" } } },
    ],
  };

  // Filter for student (so they see their own applications),
  // or for faculty and HOD (so they see their department's applications).
  let userFilter = {};

  if (student) {
    userFilter = { studentId: student.id };
  } else if (faculty) {
    userFilter = { student: { departmentId: faculty.departmentId } };
  } else if (hod) {
    userFilter = { student: { departmentId: hod.departmentId } };
  }

  try {
    const odList = await prisma.oDApplication.findMany({ 
      where: {
        AND: [baseFilter, userFilter],
      },
      orderBy: { createdAt: "desc" },
      include: {
        faculty: { select: { name: true } },
        student: { select: { registerNo: true, name: true } },
        hod: { select: { name: true } },
      },
    });

    return NextResponse.json({ odList });
  } catch (error) {
    console.error("Error fetching OD applications.", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
