// app/api/od/hod/hod-stats/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 
import { auth } from "@clerk/nextjs/server"; 
import { statsCache } from "@/lib/cache";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cacheKey = `hod-stats-${userId}`;
  const cached = statsCache.get(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  try {
    const [approved, rejected, pending] = await Promise.all([
      prisma.oDApplication.count({
        where: {
          hod: { clerkId: userId },
          status: "APPROVED_BY_HOD",
        },
      }),
      prisma.oDApplication.count({
        where: {
          hod: { clerkId: userId },
          status: "REJECTED_BY_HOD",
        },
      }),
      prisma.oDApplication.count({
        where: {
          hod: { clerkId: userId },
          status: "FORWARDED_TO_HOD",
        },
      }),
    ]);

    const result = { approved, rejected, pending };
    statsCache.set(cacheKey, result);

    return NextResponse.json(result);
  } catch (err) {
    console.error("Failed to fetch HOD stats", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
