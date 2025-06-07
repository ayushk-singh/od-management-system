import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getParamFromURL } from "@/lib/utils";

export async function PUT(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const student = await prisma.student.findUnique({
    where: { clerkId: userId },
  });
  if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });

  const id = getParamFromURL(req.url, "update-od")

  if (!id) {
    return NextResponse.json({ error: "Invalid OD ID" }, { status: 400 });
  }

  const odApplication = await prisma.oDApplication.findUnique({
    where: { id },
  });
  if (!odApplication) return NextResponse.json({ error: "OD Application not found" }, { status: 404 });

  if (odApplication.studentId !== student.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();

  const updated = await prisma.oDApplication.update({
    where: { id },
    data: {
      reason: body.reason,
      location: body.location,
      dateFrom: new Date(body.dateFrom),
      dateTo: new Date(body.dateTo),
    },
  });

  return NextResponse.json({ updated });
}
