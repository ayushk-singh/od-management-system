import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { readFile } from "fs/promises";
import path from "path";
import QRCode from "qrcode";

export async function generateODPDF(odData: any) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 11;

  // === Header (full-width banner) ===
  const headerBytes = await readFile(path.resolve("./public/pdf-header.png"));
  const headerImage = await pdfDoc.embedPng(headerBytes);
  page.drawImage(headerImage, {
    x: 0,
    y: height - 80,
    width: width,
    height: 80,
  });

  // === Footer (full-width) ===
  const footerBytes = await readFile(path.resolve("./public/pdf-footer.png"));
  const footerImage = await pdfDoc.embedPng(footerBytes);
  page.drawImage(footerImage, {
    x: 0,
    y: 0,
    width: width,
    height: 50,
  });

  // === Title ===
  page.drawText("Online OD Applications", {
    x: width / 2 - 70,
    y: height - 120,
    size: 14,
    font,
    color: rgb(0, 0, 0),
  });

  // === Date ===
  const createdAtDate = new Date(odData.createdAt).toDateString();
  page.drawText(`Date: ${createdAtDate}`, {
    x: 50,
    y: height - 140,
    size: fontSize,
    font,
  });

  // === Merged Box ===
  const boxTopY = height - 160;
  const boxHeight = 260;
  const boxX = 50;
  const boxWidth = 495; // Width to cover both previous boxes

  page.drawRectangle({
    x: boxX,
    y: boxTopY - boxHeight,
    width: boxWidth,
    height: boxHeight,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  });

  // === Left Column: Application Details ===
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

  // === Right Column: Reason & Status ===
  const rightColumnX = boxX + 260; // Start right side content ~260px from left
  let rightY = boxTopY - 20;

  // Reason label
  page.drawText("Reason:", {
    x: rightColumnX,
    y: rightY,
    size: fontSize,
    font,
  });
  rightY -= 20;

  // Reason text, wrapped with maxWidth
  page.drawText(odData.reason, {
    x: rightColumnX,
    y: rightY,
    size: fontSize,
    font,
    maxWidth: 215,
  });

  // Adjust y to place status below reason text, leave ~100px space (adjust as needed)
  rightY -= 120;

  // Status text
  page.drawText(`Current Status: ${odData.status}`, {
    x: rightColumnX,
    y: rightY,
    size: fontSize,
    font,
  });

  // === QR Code ===
  const qrDataUrl = await QRCode.toDataURL(
    `https://yourdomain.com/verify/${odData.id}`
  );
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

  // === Return PDF Buffer ===
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
