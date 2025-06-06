import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const hod = await prisma.hOD.findUnique({
    where: { clerkId: userId },
  });

  if (!hod) return new Response("Not an HOD", { status: 403 });

  const { action } = await req.json();

  const updateData: any = {
    hodId: hod.id,
    hodReviewedAt: new Date(),
  };

  if (action === "APPROVE") {
    updateData.status = "APPROVED_BY_HOD";
  } else if (action === "REJECT") {
    updateData.status = "REJECTED_BY_HOD";
  } else {
    return new Response("Invalid action", { status: 400 });
  }

  const updated = await prisma.oDApplication.update({
    where: { id: params.id },
    data: updateData,
  });

  return Response.json({ updated });
}
