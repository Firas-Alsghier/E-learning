import PDFDocument from 'pdfkit';

// ─── Page dimensions (A4 Landscape in points at 72dpi) ─────────────────────
const W = 841.89;
const H = 595.28;
const CX = W / 2; // horizontal center

// ─── Color palette (matches the project's orange theme) ────────────────────
const ORANGE = '#FF782D';
const DARK = '#1a1a2e';
const MUTED = '#9CA3AF';
const BG = '#FFFDF7'; // warm cream
const ORG_LT = '#FFF3EC'; // light orange tint (used inside seal)
const BORDER = '#E5E7EB'; // light gray for dividers

export function generateCertificate(res, certificate, userName, courseTitle) {
  const doc = new PDFDocument({
    size: 'A4',
    layout: 'landscape',
    margin: 0,
    info: {
      Title: `Certificate of Completion — ${userName}`,
      Author: 'E-Learning Platform',
      Subject: courseTitle,
    },
  });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="certificate-${certificate.certificateNumber}.pdf"`);
  doc.pipe(res);

  // ───────────────────────────────────────────────────────────────────────────
  //  1. BACKGROUND
  // ───────────────────────────────────────────────────────────────────────────
  doc.rect(0, 0, W, H).fill(BG);

  // Subtle large watermark circles in the two far corners
  doc.save();
  doc.opacity(0.04);
  doc.circle(55, 55, 140).fill(ORANGE);
  doc.circle(W - 55, H - 55, 140).fill(ORANGE);
  doc.restore();

  // ───────────────────────────────────────────────────────────────────────────
  //  2. STRUCTURAL ACCENTS — top/bottom bands + left stripe
  // ───────────────────────────────────────────────────────────────────────────

  // Top orange band
  doc.rect(0, 0, W, 10).fill(ORANGE);
  // Bottom orange band
  doc.rect(0, H - 10, W, 10).fill(ORANGE);
  // Left dark vertical accent stripe
  doc.rect(0, 10, 7, H - 20).fill(DARK);

  // ───────────────────────────────────────────────────────────────────────────
  //  3. DOUBLE BORDER FRAME
  // ───────────────────────────────────────────────────────────────────────────

  // Outer border
  doc
    .rect(22, 22, W - 44, H - 44)
    .lineWidth(2)
    .strokeColor(ORANGE)
    .stroke();

  // Inner border
  doc
    .rect(30, 30, W - 60, H - 60)
    .lineWidth(0.5)
    .strokeColor(ORANGE)
    .stroke();

  // Corner diamond ornaments (rotated squares at each corner intersection)
  [
    [22, 22],
    [W - 22, 22],
    [22, H - 22],
    [W - 22, H - 22],
  ].forEach(([x, y]) => {
    doc.save();
    doc.translate(x, y).rotate(45);
    doc.rect(-6, -6, 12, 12).fill(ORANGE);
    doc.restore();
  });

  // ───────────────────────────────────────────────────────────────────────────
  //  4. PLATFORM BRANDING
  // ───────────────────────────────────────────────────────────────────────────
  doc.fillColor(ORANGE).font('Helvetica-Bold').fontSize(9).text('E - L E A R N I N G   P L A T F O R M', 0, 46, {
    align: 'center',
    width: W,
  });

  // Flanking lines with center dot
  doc
    .moveTo(CX - 95, 62)
    .lineTo(CX - 10, 62)
    .lineWidth(0.5)
    .strokeColor(ORANGE)
    .stroke();
  doc.circle(CX, 62, 2.5).fill(ORANGE);
  doc
    .moveTo(CX + 10, 62)
    .lineTo(CX + 95, 62)
    .lineWidth(0.5)
    .strokeColor(ORANGE)
    .stroke();

  // ───────────────────────────────────────────────────────────────────────────
  //  5. MAIN TITLE
  // ───────────────────────────────────────────────────────────────────────────
  doc.fillColor(DARK).font('Times-Bold').fontSize(36).text('Certificate of Completion', 0, 76, { align: 'center', width: W });

  // ───────────────────────────────────────────────────────────────────────────
  //  6. ORNAMENTAL DIVIDER — lines with dots and center diamond
  // ───────────────────────────────────────────────────────────────────────────
  const ornY = 128;

  // Left arm
  doc
    .moveTo(CX - 185, ornY)
    .lineTo(CX - 26, ornY)
    .lineWidth(1.2)
    .strokeColor(ORANGE)
    .stroke();
  doc.circle(CX - 110, ornY, 3.5).fill(ORANGE);

  // Center diamond (rotated square)
  doc.save().translate(CX, ornY).rotate(45);
  doc.rect(-7, -7, 14, 14).fill(ORANGE);
  doc.restore();

  // Right arm
  doc
    .moveTo(CX + 26, ornY)
    .lineTo(CX + 185, ornY)
    .lineWidth(1.2)
    .strokeColor(ORANGE)
    .stroke();
  doc.circle(CX + 110, ornY, 3.5).fill(ORANGE);

  // ───────────────────────────────────────────────────────────────────────────
  //  7. PRESENTED TO
  // ───────────────────────────────────────────────────────────────────────────
  doc.fillColor(MUTED).font('Helvetica').fontSize(13).text('This certificate is proudly presented to', 0, 148, {
    align: 'center',
    width: W,
  });

  // ───────────────────────────────────────────────────────────────────────────
  //  8. RECIPIENT NAME — the hero element
  // ───────────────────────────────────────────────────────────────────────────
  doc.fillColor(DARK).font('Times-BoldItalic').fontSize(44).text(userName, 0, 170, { align: 'center', width: W });

  // Elegant underline beneath the name
  doc
    .moveTo(CX - 165, 228)
    .lineTo(CX + 165, 228)
    .lineWidth(1)
    .strokeColor(DARK)
    .stroke();

  // ───────────────────────────────────────────────────────────────────────────
  //  9. FOR COMPLETING
  // ───────────────────────────────────────────────────────────────────────────
  doc.fillColor(MUTED).font('Helvetica').fontSize(13).text('for successfully completing the course', 0, 240, {
    align: 'center',
    width: W,
  });

  // ───────────────────────────────────────────────────────────────────────────
  //  10. COURSE TITLE — orange accent
  // ───────────────────────────────────────────────────────────────────────────
  doc
    .fillColor(ORANGE)
    .font('Helvetica-Bold')
    .fontSize(22)
    .text(courseTitle, 80, 266, { align: 'center', width: W - 160 });

  // ───────────────────────────────────────────────────────────────────────────
  //  11. BOTTOM SECTION — divider, signature, details, seal
  // ───────────────────────────────────────────────────────────────────────────
  const botDivY = H - 120; // ≈ 475

  // Full-width thin divider line
  doc
    .moveTo(44, botDivY)
    .lineTo(W - 44, botDivY)
    .lineWidth(0.5)
    .strokeColor(BORDER)
    .stroke();

  // ── LEFT COLUMN: Signature ─────────────────────────────────────────────────
  // Signature line
  doc
    .moveTo(65, H - 52)
    .lineTo(218, H - 52)
    .lineWidth(0.5)
    .strokeColor(MUTED)
    .stroke();
  // Label below line
  doc
    .fillColor(MUTED)
    .font('Helvetica')
    .fontSize(9)
    .text('Platform Director', 65, H - 45, { width: 153, align: 'center' });

  // ── CENTER COLUMN: Certificate ID + Issue Date (side by side) ──────────────
  const detY1 = botDivY + 16; // label row y
  const detY2 = botDivY + 30; // value row y

  // Left pair: Certificate Number
  doc
    .fillColor(MUTED)
    .font('Helvetica')
    .fontSize(8)
    .text('CERTIFICATE NUMBER', CX - 170, detY1, { characterSpacing: 0.6 });
  doc
    .fillColor(DARK)
    .font('Helvetica-Bold')
    .fontSize(10)
    .text(certificate.certificateNumber, CX - 170, detY2);

  // Right pair: Issue Date
  doc
    .fillColor(MUTED)
    .font('Helvetica')
    .fontSize(8)
    .text('DATE OF ISSUE', CX + 10, detY1, { characterSpacing: 0.6 });
  doc
    .fillColor(DARK)
    .font('Helvetica-Bold')
    .fontSize(10)
    .text(certificate.issuedAt.toDateString(), CX + 10, detY2);

  // ── RIGHT COLUMN: Circular official seal ───────────────────────────────────
  const sX = W - 98; // seal center X
  const sY = H - 64; // seal center Y

  // Outer ring
  doc.circle(sX, sY, 48).lineWidth(2.5).strokeColor(ORANGE).stroke();
  // Inner ring
  doc.circle(sX, sY, 41).lineWidth(0.8).strokeColor(ORANGE).stroke();
  // Fill inner area
  doc.circle(sX, sY, 40.5).fill(ORG_LT);

  // Seal: top text
  doc
    .fillColor(ORANGE)
    .font('Helvetica-Bold')
    .fontSize(7)
    .text('CERTIFICATE', sX - 40, sY - 22, { width: 80, align: 'center', characterSpacing: 1.5 });

  // Seal: two short horizontal lines flanking the center word
  doc
    .moveTo(sX - 20, sY - 9)
    .lineTo(sX + 20, sY - 9)
    .lineWidth(0.6)
    .strokeColor(ORANGE)
    .stroke();
  doc
    .moveTo(sX - 20, sY + 7)
    .lineTo(sX + 20, sY + 7)
    .lineWidth(0.6)
    .strokeColor(ORANGE)
    .stroke();

  // Seal: center word
  doc
    .fillColor(ORANGE)
    .font('Times-BoldItalic')
    .fontSize(11)
    .text('OFFICIAL', sX - 40, sY - 7, { width: 80, align: 'center' });

  // Seal: bottom text
  doc
    .fillColor(ORANGE)
    .font('Helvetica-Bold')
    .fontSize(7)
    .text('COMPLETION', sX - 40, sY + 11, { width: 80, align: 'center', characterSpacing: 1 });

  // ───────────────────────────────────────────────────────────────────────────
  doc.end();
}
