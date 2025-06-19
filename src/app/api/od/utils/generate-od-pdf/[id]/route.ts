import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateODPDF } from "@/lib/generateOdPdf";
import { getParamFromURL } from "@/lib/utils";
import type { ODData } from "@/lib/generateOdPdf";

export async function GET(req: NextRequest) {
  const id = getParamFromURL(req.url, "generate-od-pdf");

  if (!id) {
    return new NextResponse("Invalid or missing ID", { status: 400 });
  }

  const od = await prisma.oDApplication.findUnique({
    where: { id },
    include: {
      student: {
        include: {
          department: true,
        },
      },
      faculty: true,
      hod: true,
    },
  });

  if (!od) {
    return new NextResponse("OD not found", { status: 404 });
  }
  if (!od.faculty) {
    return new NextResponse("Faculty not assigned to this OD or deleted kindly contact admin", { status: 500 });
  }

  const odDataForPdf: ODData = {
    id: od.id,
    createdAt: od.createdAt.toISOString(),
    dateFrom: od.dateFrom.toISOString(),
    dateTo: od.dateTo.toISOString(),
    totalDays: od.totalDays,
    location: od.location,
    reason: od.reason,
    status: od.status,
    student: {
      name: od.student.name,
      registerNo: od.student.registerNo,
      department: {
        name: od.student.department.name,
      },
    },
    faculty: {
      name: od.faculty.name,
    },
  };

  const pdfBytes = await generateODPDF(odDataForPdf);

  return new NextResponse(pdfBytes, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline",
    },
  });
}
