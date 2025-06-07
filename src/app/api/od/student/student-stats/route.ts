import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { statsCache } from "@/lib/cache";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cacheKey = `student-stats-${userId}`;
  const cached = statsCache.get(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  try {
    const [total, approved, rejected, pending] = await Promise.all([
      prisma.oDApplication.count({
        where: {
          student: { clerkId: userId },
        },
      }),
      prisma.oDApplication.count({
        where: {
          student: { clerkId: userId },
          status: {
            in: ["APPROVED_BY_FACULTY", "APPROVED_BY_HOD"],
          },
        },
      }),
      prisma.oDApplication.count({
        where: {
          student: { clerkId: userId },
          status: {
            in: ["REJECTED_BY_FACULTY", "REJECTED_BY_HOD"],
          },
        },
      }),
      prisma.oDApplication.count({
        where: {
          student: { clerkId: userId },
          status: {
            in: ["PENDING", "FORWARDED_TO_HOD"],
          },
        },
      }),
    ]);

    const result = { total, approved, rejected, pending };
    statsCache.set(cacheKey, result);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching student OD stats", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
