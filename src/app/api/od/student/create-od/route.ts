// /app/api/od/create/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// In-memory rate limiter (userId -> { count, timestamp })
const userRateLimitMap = new Map<
  string,
  { count: number; lastRequestTime: number }
>();

const RATE_LIMIT = 5; // max requests
const WINDOW_MS = 60 * 1000; // 1 minute

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // ⏱ Rate Limiting Logic
    const now = Date.now();
    const userData = userRateLimitMap.get(userId);

    if (!userData || now - userData.lastRequestTime > WINDOW_MS) {
      // Reset if new user or outside window
      userRateLimitMap.set(userId, { count: 1, lastRequestTime: now });
    } else {
      // Inside window, increment count
      userData.count++;
      userData.lastRequestTime = now;

      if (userData.count > RATE_LIMIT) {
        return NextResponse.json(
          { success: false, error: "Too many requests. Try again later." },
          { status: 429 }
        );
      }
    }

    // Parse body
    const body = await request.json();
    const { dateFrom, dateTo, location, reason, facultyId, totalDays } = body;

    if (!dateFrom || !dateTo || !location || !reason || !facultyId || !totalDays) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find student
    const student = await prisma.student.findUnique({
      where: { clerkId: userId },
      include: { department: true },
    });

    if (!student) {
      return NextResponse.json(
        { success: false, error: "Student profile not found" },
        { status: 404 }
      );
    }

    // Find faculty
    const faculty = await prisma.faculty.findUnique({
      where: { id: facultyId },
      include: { department: true },
    });

    if (!faculty) {
      return NextResponse.json(
        { success: false, error: "Faculty not found" },
        { status: 404 }
      );
    }

    if (student.departmentId !== faculty.departmentId) {
      return NextResponse.json(
        {
          success: false,
          error: "Faculty is not from your department",
        },
        { status: 403 }
      );
    }

    // Find HOD
    const hod = await prisma.hOD.findUnique({
      where: { departmentId: student.departmentId },
    });

    // Create OD application
    const odApplication = await prisma.oDApplication.create({
      data: {
        dateFrom: new Date(dateFrom),
        dateTo: new Date(dateTo),
        location,
        reason,
        totalDays,
        status: "PENDING",
        studentId: student.id,
        facultyId: faculty.id,
        hodId: hod?.id,
      },
    });

    return NextResponse.json({ success: true, odApplication });
  } catch (error) {
    console.error("Error applying OD:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
