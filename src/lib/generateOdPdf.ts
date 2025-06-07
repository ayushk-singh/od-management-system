import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { readFile } from "fs/promises";
import path from "path";
import QRCode from "qrcode";

// Define a clear type for OD data
export interface ODData {
  id: string;
  createdAt: string;
  dateFrom: string;
  dateTo: string;
  totalDays: number;
  location: string;
  reason: string;
  status: string;
  student: {
    name: string;
    registerNo: string;
    department: {
      name: string;
    };
  };
  faculty: {
    name: string;
  };
}

// Helper to wrap long text manually
function wrapText(text: string, maxLineLength = 40): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    if ((currentLine + word).length <= maxLineLength) {
      currentLine += word + " ";
    } else {
      lines.push(currentLine.trim());
      currentLine = word + " ";
    }
  }
  if (currentLine.trim()) lines.push(currentLine.trim());
  return lines;
}

export async function generateODPDF(odData: ODData) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 11;

  // Header
  const headerBytes = await readFile(path.resolve("./public/pdf-header.png"));
  const headerImage = await pdfDoc.embedPng(headerBytes);
  page.drawImage(headerImage, {
    x: 0,
    y: height - 80,
    width,
    height: 80,
  });

  // Footer
  const footerBytes = await readFile(path.resolve("./public/pdf-footer.png"));
  const footerImage = await pdfDoc.embedPng(footerBytes);
  page.drawImage(footerImage, {
    x: 0,
    y: 0,
    width,
    height: 50,
  });

  // Title
  page.drawText("Online OD Applications", {
    x: width / 2 - 70,
    y: height - 120,
    size: 14,
    font,
    color: rgb(0, 0, 0),
  });

  // Date
  page.drawText(`Date: ${new Date(odData.createdAt).toDateString()}`, {
    x: 50,
    y: height - 140,
    size: fontSize,
    font,
  });

  // Application info box
  const boxTopY = height - 160;
  const boxHeight = 260;
  const boxX = 50;
  const boxWidth = 495;

  page.drawRectangle({
    x: boxX,
    y: boxTopY - boxHeight,
    width: boxWidth,
    height: boxHeight,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  });

  // Left column content
  let currentY = boxTopY - 20;
  const gap = 20;
  const leftColumnX = boxX + 10;

  const leftText = [
    ["OD ID", odData.id],
    ["Student Name", odData.student.name],
    ["Register No", odData.student.registerNo || "N/A"],
    ["Department", odData.student.department.name],
    ["Date From", new Date(odData.dateFrom).toDateString()],
    ["Date To", new Date(odData.dateTo).toDateString()],
    ["Total Days", String(odData.totalDays)],
    ["Location", odData.location],
    ["Applied To", odData.faculty.name],
  ];

  for (const [label, value] of leftText) {
    page.drawText(`${label}: ${value}`, {
      x: leftColumnX,
      y: currentY,
      size: fontSize,
      font,
    });
    currentY -= gap;
  }

  // Right column: Reason & Status
  const rightColumnX = boxX + 260;
  let rightY = boxTopY - 20;

  page.drawText("Reason:", {
    x: rightColumnX,
    y: rightY,
    size: fontSize,
    font,
  });
  rightY -= 20;

  const wrappedReason = wrapText(odData.reason);
  for (const line of wrappedReason) {
    page.drawText(line, {
      x: rightColumnX,
      y: rightY,
      size: fontSize,
      font,
    });
    rightY -= fontSize + 4;
  }

  rightY -= 20;
  page.drawText(`Current Status: ${odData.status}`, {
    x: rightColumnX,
    y: rightY,
    size: fontSize,
    font,
  });

  // QR Code
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const qrDataUrl = await QRCode.toDataURL(`${baseUrl}/verify/${odData.id}`);
  const qrImageBytes = Buffer.from(qrDataUrl.split(",")[1], "base64");
  const qrImage = await pdfDoc.embedPng(qrImageBytes);
  const qrDims = qrImage.scale(0.5);

  page.drawImage(qrImage, {
    x: width - 150,
    y: 200,
    width: qrDims.width,
    height: qrDims.height,
  });

  page.drawText("Scan to verify", {
    x: width - 150,
    y: 180,
    size: fontSize,
    font,
  });

  // Finalize and return PDF
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
