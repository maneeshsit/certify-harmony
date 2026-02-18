import jsPDF from 'jspdf';
import { Society, RATING_LEVELS, ASSESSMENT_CATEGORIES } from './types';

export const generateSocietyReport = (society: Society, logoDataUrl?: string) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Watermark
  if (logoDataUrl) {
    doc.setGState(new (doc as any).GState({ opacity: 0.08 }));
    doc.addImage(logoDataUrl, 'PNG', pageWidth / 2 - 40, pageHeight / 2 - 40, 80, 80);
    doc.setGState(new (doc as any).GState({ opacity: 1 }));
  }

  // Header
  doc.setFillColor(30, 55, 90);
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('CHS Rate - Society Assessment Report', pageWidth / 2, 18, { align: 'center' });
  doc.setFontSize(10);
  doc.text('Cooperative Housing Society Facility Rating System', pageWidth / 2, 28, { align: 'center' });
  doc.setFontSize(8);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, pageWidth / 2, 35, { align: 'center' });

  // Society info
  doc.setTextColor(30, 55, 90);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(society.name, 14, 55);

  doc.setTextColor(80, 80, 80);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Address: ${society.address}, ${society.city}`, 14, 63);
  doc.text(`Total Units: ${society.totalUnits} | Year Built: ${society.yearBuilt}`, 14, 70);
  doc.text(`Last Assessed: ${society.lastAssessed}`, 14, 77);

  // Rating Level Box
  const level = RATING_LEVELS.find(r => r.level === society.overallLevel);
  const levelColors: Record<number, [number, number, number]> = {
    1: [220, 80, 80], 2: [230, 140, 50], 3: [220, 190, 40],
    4: [60, 120, 200], 5: [50, 160, 100],
  };
  const lc = levelColors[society.overallLevel] || [100, 100, 100];

  doc.setFillColor(lc[0], lc[1], lc[2]);
  doc.roundedRect(14, 83, pageWidth - 28, 22, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`Overall Rating: Level ${society.overallLevel} - ${level?.name || ''}`, pageWidth / 2, 95, { align: 'center' });
  doc.setFontSize(9);
  doc.text(`LEED Score: ${society.leedScore}/100`, pageWidth / 2, 102, { align: 'center' });

  // Assessment Scores
  doc.setTextColor(30, 55, 90);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Assessment Scores', 14, 120);

  let y = 128;
  doc.setFontSize(9);
  ASSESSMENT_CATEGORIES.forEach(cat => {
    const score = society.scores[cat.key as keyof typeof society.scores];
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text(cat.label, 14, y);
    doc.setFont('helvetica', 'bold');
    const sc = levelColors[score] || [100, 100, 100];
    doc.setTextColor(sc[0], sc[1], sc[2]);
    doc.text(`${score}/5`, 120, y);

    // Score bar
    doc.setFillColor(230, 230, 230);
    doc.roundedRect(130, y - 3, 60, 4, 1, 1, 'F');
    doc.setFillColor(sc[0], sc[1], sc[2]);
    doc.roundedRect(130, y - 3, (score / 5) * 60, 4, 1, 1, 'F');

    y += 8;
  });

  // Compliance Section
  y += 5;
  doc.setTextColor(30, 55, 90);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Compliance Certificates', 14, y);
  y += 8;

  doc.setFontSize(8);
  society.compliance.forEach(cert => {
    if (y > pageHeight - 30) {
      doc.addPage();
      y = 20;
      if (logoDataUrl) {
        doc.setGState(new (doc as any).GState({ opacity: 0.08 }));
        doc.addImage(logoDataUrl, 'PNG', pageWidth / 2 - 40, pageHeight / 2 - 40, 80, 80);
        doc.setGState(new (doc as any).GState({ opacity: 1 }));
      }
    }
    const statusColors: Record<string, [number, number, number]> = {
      valid: [50, 160, 100], expired: [220, 80, 80], pending: [220, 190, 40], not_applicable: [150, 150, 150],
    };
    const stc = statusColors[cert.status] || [100, 100, 100];

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text(`${cert.mandatory ? '●' : '○'} ${cert.name}`, 14, y);
    doc.setTextColor(stc[0], stc[1], stc[2]);
    doc.setFont('helvetica', 'bold');
    doc.text(cert.status.toUpperCase(), 160, y);
    y += 6;
  });

  // Footer
  doc.setFillColor(30, 55, 90);
  doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.text('CHS Rate - Cooperative Housing Society Facility Rating System | Confidential', pageWidth / 2, pageHeight - 7, { align: 'center' });

  doc.save(`${society.name.replace(/\s+/g, '_')}_Report.pdf`);
};

export const generateComplianceCertificate = (society: Society, certName: string, logoDataUrl?: string) => {
  const doc = new jsPDF('landscape');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Border
  doc.setDrawColor(30, 55, 90);
  doc.setLineWidth(3);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
  doc.setLineWidth(1);
  doc.rect(14, 14, pageWidth - 28, pageHeight - 28);

  // Watermark
  if (logoDataUrl) {
    doc.setGState(new (doc as any).GState({ opacity: 0.06 }));
    doc.addImage(logoDataUrl, 'PNG', pageWidth / 2 - 35, pageHeight / 2 - 25, 70, 70);
    doc.setGState(new (doc as any).GState({ opacity: 1 }));
  }

  // Title
  doc.setTextColor(30, 55, 90);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('CERTIFICATE OF COMPLIANCE', pageWidth / 2, 45, { align: 'center' });

  // Decorative line
  doc.setDrawColor(50, 160, 100);
  doc.setLineWidth(2);
  doc.line(pageWidth / 2 - 60, 52, pageWidth / 2 + 60, 52);

  // Content
  doc.setTextColor(80, 80, 80);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('This is to certify that', pageWidth / 2, 70, { align: 'center' });

  doc.setTextColor(30, 55, 90);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(society.name, pageWidth / 2, 85, { align: 'center' });

  doc.setTextColor(80, 80, 80);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`${society.address}, ${society.city}`, pageWidth / 2, 95, { align: 'center' });

  doc.text('has been assessed and found compliant with', pageWidth / 2, 110, { align: 'center' });

  doc.setTextColor(50, 160, 100);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(certName, pageWidth / 2, 125, { align: 'center' });

  doc.setTextColor(80, 80, 80);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Certificate Date: ${new Date().toLocaleDateString('en-IN')}`, pageWidth / 2, 145, { align: 'center' });
  doc.text(`Rating Level: ${society.overallLevel} - ${RATING_LEVELS.find(r => r.level === society.overallLevel)?.name}`, pageWidth / 2, 153, { align: 'center' });

  // Signatures
  doc.setDrawColor(100, 100, 100);
  doc.line(50, 175, 130, 175);
  doc.line(pageWidth - 130, 175, pageWidth - 50, 175);
  doc.setFontSize(9);
  doc.text('Authorized Signatory', 90, 182, { align: 'center' });
  doc.text('CHS Rate Inspector', pageWidth - 90, 182, { align: 'center' });

  doc.save(`${certName.replace(/\s+/g, '_')}_${society.name.replace(/\s+/g, '_')}.pdf`);
};
