import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const hod = await prisma.hOD.findUnique({
    where: { clerkId: userId },
    include: { department: true },
  });

  if (!hod) {
    return new Response(JSON.stringify({ error: "Not an HOD" }), {
      status: 403,
    });
  }

  const odList = await prisma.oDApplication.findMany({
    where: {
      hodId: hod.id,
      status: {
        in: ["APPROVED_BY_HOD", "REJECTED_BY_HOD"],
      },
    },
    include: {
      student: true,
      faculty: true,
    },
    orderBy: {
      hodReviewedAt: "desc",
    },
  });

  return Response.json({ odList });
}
