import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { getParamFromURL } from "@/lib/utils";

export async function PUT(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const hod = await prisma.hOD.findUnique({
    where: { clerkId: userId },
  });

  if (!hod) return new Response("Not an HOD", { status: 403 });

  const id = getParamFromURL(req.url, "hod-action");

  if (!id) {
    return new Response("Invalid OD ID", { status: 400 });
  }

  const { action } = await req.json();

  const updateData: Prisma.ODApplicationUpdateInput = {
    hod: {
      connect: { id: hod.id },
    },
    hodReviewedAt: new Date(),
  };

  switch (action) {
    case "APPROVE":
      updateData.status = "APPROVED_BY_HOD";
      break;
    case "REJECT":
      updateData.status = "REJECTED_BY_HOD";
      break;
    default:
      return new Response("Invalid action", { status: 400 });
  }

  const updated = await prisma.oDApplication.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json({ updated });
}
