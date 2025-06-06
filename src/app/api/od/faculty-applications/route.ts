// app/api/od/manage-applications/route.ts
import { NextResponse } from "next/server";
import { getFacultyByClerkId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const faculty = await getFacultyByClerkId();

  if (!faculty) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const odList = await prisma.oDApplication.findMany({
    where: {
      facultyId: faculty.id,
      status: "PENDING",
    },
    include: {
      student: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json({ odList });
}
