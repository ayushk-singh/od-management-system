import { prisma } from "@/lib/prisma";
import { getFacultyByClerkId } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { getParamFromURL } from "@/lib/utils";

export async function POST(req: NextRequest) {

  const id = getParamFromURL(req.url, "faculty-action")

  if (!id) {
    return NextResponse.json({ error: "Missing OD ID in path" }, { status: 400 });
  }

  const { action } = await req.json();

  const faculty = await getFacultyByClerkId();
  if (!faculty) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const od = await prisma.oDApplication.findUnique({ where: { id } });
  if (!od || od.facultyId !== faculty.id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const updates: Prisma.ODApplicationUpdateInput = {
    facultyReviewedAt: new Date(),
    updatedAt: new Date(),
  };

  switch (action) {
    case "APPROVE":
      updates.status = "APPROVED_BY_FACULTY";
      break;
    case "REJECT":
      updates.status = "REJECTED_BY_FACULTY";
      break;
    case "FORWARD":
      updates.status = "FORWARDED_TO_HOD";
      break;
    default:
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  await prisma.oDApplication.update({
    where: { id },
    data: updates,
  });

  return NextResponse.json({ success: true });
}
