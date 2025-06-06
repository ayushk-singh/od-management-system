import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    // Get logged-in user id from Clerk
    const { userId } = await auth();

    if (!userId)
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );

    const body = await request.json();

    const { dateFrom, dateTo, location, reason, facultyId, totalDays } = body;

    if (
      !dateFrom ||
      !dateTo ||
      !location ||
      !reason ||
      !facultyId ||
      !totalDays
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find the student using the logged-in clerkId
    const student = await prisma.student.findUnique({
      where: { clerkId: userId },
      include: {
        department: true,
      },
    });

    if (!student) {
      return NextResponse.json(
        { success: false, error: "Student profile not found" },
        { status: 404 }
      );
    }

    // Find faculty by id with department
    const faculty = await prisma.faculty.findUnique({
      where: { id: facultyId },
      include: {
        department: true,
      },
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

    // Find HOD for that department
    const hod = await prisma.hOD.findUnique({
      where: { departmentId: student.departmentId },
    });

    // Create OD Application
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
