import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

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
    return new Response(JSON.stringify({ error: "Not an HOD" }), { status: 403 });
  }

  const odList = await prisma.oDApplication.findMany({
    where: {
      status: "FORWARDED_TO_HOD",
      student: {
        departmentId: hod.departmentId,
      },
    },
    include: {
      student: true,
      faculty: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return Response.json({ odList });
}
