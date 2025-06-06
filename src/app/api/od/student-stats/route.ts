import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const total = await prisma.oDApplication.count({
      where: {
        student: { clerkId: userId },
      },
    });

    const approved = await prisma.oDApplication.count({
      where: {
        student: { clerkId: userId },
        status: {
          in: ["APPROVED_BY_FACULTY", "APPROVED_BY_HOD"],
        },
      },
    });

    const rejected = await prisma.oDApplication.count({
      where: {
        student: { clerkId: userId },
        status: {
          in: ["REJECTED_BY_FACULTY", "REJECTED_BY_HOD"],
        },
      },
    });

    const pending = await prisma.oDApplication.count({
      where: {
        student: { clerkId: userId },
        status: {
          in: ["PENDING", "FORWARDED_TO_HOD"],
        },
      },
    });

    return NextResponse.json({ total, approved, rejected, pending });
  } catch (error) {
    console.error("Error fetching student OD stats", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
