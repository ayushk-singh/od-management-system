// lib/auth.ts
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getFacultyByClerkId() {
  const { userId } = await auth(); 

  if (!userId) return null;

  // find faculty in DB using clerkId
  const faculty = await prisma.faculty.findUnique({
    where: { clerkId: userId },
  });

  return faculty;
}
