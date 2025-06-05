// /app/api/od/[id]/route.ts
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const student = await prisma.student.findUnique({
    where: { clerkId: userId },
  });

  if (!student) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }

  const od = await prisma.oDApplication.findUnique({
    where: { id: params.id },
  });

  if (!od || od.studentId !== student.id) {
    return NextResponse.json({ error: "OD not found or not yours" }, { status: 403 });
  }

  if (od.status !== "PENDING") {
    return NextResponse.json(
      { error: "Only PENDING applications can be deleted" },
      { status: 400 }
    );
  }

  await prisma.oDApplication.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ success: true });
}
