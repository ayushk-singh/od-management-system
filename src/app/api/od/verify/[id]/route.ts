import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getParamFromURL } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const id = getParamFromURL(req.url, "verify");

  if (!id) {
    return NextResponse.json(
      { valid: false, message: "Missing ID" },
      { status: 400 }
    );
  }

  // Fetch OD application with status
  const od = await prisma.oDApplication.findUnique({
    where: { id },
    select: {
      status: true,
      student: {
        select: { name: true, registerNo: true },
      },
      faculty: {
        select: { name: true },
      },
      hod: {
        select: { name: true },
      },
      dateFrom: true,
      dateTo: true,
      reason: true,
      location: true,
      createdAt: true,
    },
  });

  if (!od) {
    return NextResponse.json(
      { valid: false, message: "OD Application not found" },
      { status: 404 }
    );
  }
  if (!od.faculty) {
    return new NextResponse("Faculty not assigned to this OD", { status: 500 });
  }

  // Define valid statuses
  const validStatuses = ["APPROVED_BY_FACULTY", "APPROVED_BY_HOD"];

  const isValid = validStatuses.includes(od.status);

  return NextResponse.json({
    valid: isValid,
    status: od.status,
    odDetails: isValid
      ? {
          studentName: od.student.name,
          registerNo: od.student.registerNo,
          facultyName: od.faculty.name,
          hodName: od.hod?.name || null,
          dateFrom: od.dateFrom.toISOString(),
          dateTo: od.dateTo.toISOString(),
          reason: od.reason,
          location: od.location,
          createdAt: od.createdAt,
        }
      : null,
    message: isValid
      ? "OD Application is valid and approved."
      : "OD Application is not approved or invalid.",
  });
}
