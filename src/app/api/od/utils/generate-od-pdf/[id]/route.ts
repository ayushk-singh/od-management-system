import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateODPDF } from "@/lib/generateOdPdf";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  const od = await prisma.oDApplication.findUnique({
    where: { id },
    include: {
      student: {
        include: {
          department: true,
        },
      },
      faculty: true,
      hod: true,
    },
  });

  if (!od) {
    return new NextResponse("OD not found", { status: 404 });
  }

  const pdfBytes = await generateODPDF(od);

  return new NextResponse(pdfBytes, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline",
    },
  });
}
