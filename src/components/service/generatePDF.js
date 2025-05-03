import jsPDF from 'jspdf';

export const generatePDF = (report) => {
    if (!report) return;
    
    const doc = new jsPDF();
    
    // Define colors and styles
    const primaryColor = [41, 82, 163]; // Medisys blue
    
    // Add header with Medisys branding
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 25, 'F');
    
    // Add Medisys logo/text
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text("MEDISYS", 20, 15);
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text("Healthcare Documentation System", 70, 15);
    
    // Add report title
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text(`MEDICAL REPORT`, 105, 35, { align: 'center' });
    
    // Add patient info section
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(240, 240, 240);
    doc.rect(10, 40, 190, 25, 'FD');
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`Patient Name: `, 15, 50);
    doc.setFont(undefined, 'normal');
    doc.text(`${report.patientName}`, 50, 50);
    
    doc.setFont(undefined, 'bold');
    doc.text(`Date: `, 15, 58);
    doc.setFont(undefined, 'normal');
    doc.text(`${new Date(report.reportDate).toLocaleDateString()}`, 50, 58);
    
    doc.setFont(undefined, 'bold');
    doc.text(`Template: `, 120, 50);
    doc.setFont(undefined, 'normal');
    doc.text(`${report.templateTitle}`, 155, 50);

    // Add separator
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(0.5);
    doc.line(10, 70, 200, 70);
    
    // Add report content header
    doc.setFillColor(245, 245, 245);
    doc.rect(10, 75, 190, 8, 'F');
    doc.setFont(undefined, 'bold');
    doc.setFontSize(11);
    doc.text("REPORT DETAILS", 105, 81, { align: 'center' });
    
    let y = 90;
    
    // Add fields with better formatting
    report.fields.forEach((field) => {
      if (field.label && field.value) {
        if (y > 270) {
          doc.addPage();
          
          // Add header to new page
          doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
          doc.rect(0, 0, 210, 15, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(12);
          doc.text("MEDISYS", 20, 10);
          doc.text(`${report.patientName} - Medical Report (Continued)`, 105, 10, { align: 'center' });
          
          doc.setTextColor(0, 0, 0);
          y = 30;
        }
        
        // For section headers (typically shorter labels with no value)
        if (field.value.length < 2 && field.label.toUpperCase() === field.label) {
          y += 5;
          doc.setFont(undefined, 'bold');
          doc.setFontSize(12);
          doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
          doc.text(`${field.label}`, 15, y);
          doc.setLineWidth(0.3);
          doc.line(15, y + 2, 195, y + 2);
          doc.setTextColor(0, 0, 0);
          y += 10;
        } else {
          // Regular fields
          doc.setFontSize(11);
          doc.setFont(undefined, 'bold');
          doc.text(`${field.label}:`, 15, y);
          
          // Handle multi-line text for longer values
          if (field.value.length > 70) {
            doc.setFont(undefined, 'normal');
            const splitText = doc.splitTextToSize(field.value, 125);
            doc.text(splitText, 75, y);
            y += (splitText.length * 6) + 2;
          } else {
            doc.setFont(undefined, 'normal');
            doc.text(`${field.value}`, 75, y);
            y += 8;
          }
        }
      }
    });
    
    // Add signature area
    y += 15;
    if (y > 250) {
      doc.addPage();
      y = 30;
    }
    
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
    doc.line(15, y + 20, 85, y + 20);
    doc.line(125, y + 20, 195, y + 20);
    
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    doc.text("Physician's Signature", 15, y + 25);
    doc.text("Date", 125, y + 25);
    
    // Add footer with Medisys branding on each page
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      
      // Footer line
      doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setLineWidth(0.5);
      doc.line(10, 280, 200, 280);
      
      // Footer text
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text("Medisys Healthcare Documentation System", 105, 286, { align: 'center' });
      doc.text("Confidential Medical Record", 40, 286);
      doc.text(`Page ${i} of ${pageCount}`, 170, 286);
    }
    
    doc.save(`MEDISYS_${report.patientName}_report_${new Date().toISOString().split('T')[0]}.pdf`);
  };