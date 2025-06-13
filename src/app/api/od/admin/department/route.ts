import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type CreateDepartmentBody = {
  name: string;
};

export async function GET() {
  try {
    const departments = await prisma.department.findMany({ 
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(departments);
  } catch (error) {
    console.error("Error fetching departments.", error);
    return NextResponse.json(
      { error: "Failed to fetch departments. Please try again." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { name } = (await req.json()) as CreateDepartmentBody;

    if (!name || name.trim().length < 3) {
      return NextResponse.json(
        { error: "Name must be at least 3 letters." },
        { status: 400 }
      );
    }

    const department = await prisma.department.create({ data: { name: name.trim() } });

    return NextResponse.json(department, { status: 201 });
  } catch (error) {
    console.error("Error creating department.", error);
    return NextResponse.json(
      { error: "Failed to create department. Please try again." },
      { status: 500 }
    );
  }
}

