// app/api/od/faculty-history/route.ts
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
      status: {
        not: "PENDING",
      },
    },
    include: {
      student: true,
    },
    orderBy: {
      facultyReviewedAt: "desc",
    },
  });

  return NextResponse.json({ odList });
}
