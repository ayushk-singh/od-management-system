import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 
import { auth } from "@clerk/nextjs/server"; 

export async function GET(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const approved = await prisma.oDApplication.count({
      where: {
        faculty: { clerkId: userId },
        status: "APPROVED_BY_FACULTY",
      },
    });

    const rejected = await prisma.oDApplication.count({
      where: {
        faculty: { clerkId: userId },
        status: "REJECTED_BY_FACULTY",
      },
    });

    const forwarded = await prisma.oDApplication.count({
      where: {
        faculty: { clerkId: userId },
        status: "FORWARDED_TO_HOD",
      },
    });

    const pending = await prisma.oDApplication.count({
      where: {
        faculty: { clerkId: userId },
        status: "PENDING",
      },
    });

    return NextResponse.json({
      approved,
      rejected,
      forwarded,
      pending,
    });
  } catch (err) {
    console.error("Failed to fetch faculty stats", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
