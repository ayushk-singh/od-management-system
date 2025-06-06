import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();

  const updated = await prisma.oDApplication.update({
    where: { id: params.id },
    data: {
      reason: body.reason,
      location: body.location,
      dateFrom: new Date(body.dateFrom),
      dateTo: new Date(body.dateTo),
    },
  });

  return NextResponse.json({ updated });
}

