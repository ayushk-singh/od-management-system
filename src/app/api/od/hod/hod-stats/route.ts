import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 
import { auth } from "@clerk/nextjs/server"; 

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const approved = await prisma.oDApplication.count({
      where: {
        hod: { clerkId: userId },
        status: "APPROVED_BY_HOD",
      },
    });

    const rejected = await prisma.oDApplication.count({
      where: {
        hod: { clerkId: userId },
        status: "REJECTED_BY_HOD",
      },
    });

    const pending = await prisma.oDApplication.count({
      where: {
        hod: { clerkId: userId },
        status: "FORWARDED_TO_HOD",
      },
    });

    return NextResponse.json({
      approved,
      rejected,
      pending,
    });
  } catch (err) {
    console.error("Failed to fetch faculty stats", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
