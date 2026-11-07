/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable new-cap */

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { fNumber } from 'src/utils/format-number';

// Function to generate PDF
export const generatePDF = (checkout) => {
  const doc = new jsPDF();

  // Extract data from checkout response
  const { 
    name, 
    email, 
    address, 
    mobile, 
    state, 
    pincode, 
    country,
    products,
    subtotal,
    total,
    discount,
    createdAt,
    id
  } = checkout;

  // Page dimensions
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;

  // Header with gradient effect (simulated)
  doc.setFillColor(255, 102, 0); // Orange color (#FF6600)
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  // Company Logo/Name in Header
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('INTECOMART', margin, 25);
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Industrial Products Pvt Ltd', margin, 32);

  // Document Title
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', pageWidth/2, 60, 'center');

  // Order Information Box
  const orderBoxY = 75;
  doc.setFillColor(248, 249, 250);
  doc.rect(margin, orderBoxY, pageWidth - 2*margin, 30, 'F');
  doc.setDrawColor(220, 220, 220);
  doc.rect(margin, orderBoxY, pageWidth - 2*margin, 30, 'S');

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Order Information', margin + 5, orderBoxY + 8);
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Order ID: ${id || 'N/A'}`, margin + 5, orderBoxY + 16);
  
  const orderDate = new Date(createdAt);
  const formattedDate = `${orderDate.getDate().toString().padStart(2, '0')}/${(orderDate.getMonth() + 1).toString().padStart(2, '0')}/${orderDate.getFullYear()}`;
  doc.text(`Date: ${formattedDate}`, margin + 5, orderBoxY + 24);

  // Customer and Shipping Information
  const customerY = orderBoxY + 40;
  
  // Customer Details Box
  doc.setFillColor(248, 249, 250);
  doc.rect(margin, customerY, (pageWidth - 2*margin)/2 - 5, 50, 'F');
  doc.setDrawColor(220, 220, 220);
  doc.rect(margin, customerY, (pageWidth - 2*margin)/2 - 5, 50, 'S');

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Bill To:', margin + 5, customerY + 8);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(name || 'N/A', margin + 5, customerY + 16);
  doc.text(email || 'N/A', margin + 5, customerY + 22);
  doc.text(mobile || 'N/A', margin + 5, customerY + 28);
  doc.text(address || 'N/A', margin + 5, customerY + 34);
  doc.text(`${state || ''}, ${pincode || ''}`, margin + 5, customerY + 40);
  doc.text(country || 'N/A', margin + 5, customerY + 46);

  // Shipping Details Box
  const shippingX = margin + (pageWidth - 2*margin)/2 + 5;
  doc.setFillColor(248, 249, 250);
  doc.rect(shippingX, customerY, (pageWidth - 2*margin)/2 - 5, 50, 'F');
  doc.setDrawColor(220, 220, 220);
  doc.rect(shippingX, customerY, (pageWidth - 2*margin)/2 - 5, 50, 'S');

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Ship To:', shippingX + 5, customerY + 8);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(name || 'N/A', shippingX + 5, customerY + 16);
  doc.text(address || 'N/A', shippingX + 5, customerY + 22);
  doc.text(`${state || ''}, ${pincode || ''}`, shippingX + 5, customerY + 28);
  doc.text(country || 'N/A', shippingX + 5, customerY + 34);

  // Products Table
  const tableY = customerY + 60;
  
  // Table Header
  const headers = [
    [
      'Sr. No.',
      'Product Name',
      'Quantity',
      'Unit Price',
      'Total Amount',
    ],
  ];

  // Product Data Rows
  const dataRows = products.map((product, index) => [
    index + 1,
    product.itemName,
    `${product.quantity || product.noOfPkg || 0} pcs`,
    `Rs. ${Number(product.sellingPrice).toLocaleString('en-IN')}`,
    `Rs. ${Number((product.quantity || product.noOfPkg || 0) * product.sellingPrice).toLocaleString('en-IN')}`,
  ]);

  // Adding Professional Table
  doc.autoTable({
    head: headers,
    body: dataRows,
    startY: tableY,
    theme: 'grid',
    headStyles: { 
      fillColor: [255, 102, 0], // Orange color (#FF6600)
      textColor: [255, 255, 255], 
      halign: 'center',
      fontStyle: 'bold'
    },
    bodyStyles: { 
      textColor: [0, 0, 0],
      fontSize: 9
    },
    columnStyles: {
      0: { cellWidth: 20, halign: 'center' },
      1: { cellWidth: 70 },
      2: { cellWidth: 25, halign: 'center' },
      3: { cellWidth: 30, halign: 'right' },
      4: { cellWidth: 35, halign: 'right' },
    },
    margin: { top: 5 },
    didDrawPage: (pageData) => {
      // Footer on Each Page
      const pageSize = doc.internal.pageSize.height;
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text('This is a Computer Generated Document', pageWidth/2, pageSize - 15, 'center');
      doc.text('Thank you for your business!', pageWidth/2, pageSize - 10, 'center');
    },
  });

  // Summary Section
  const finalY = doc.previousAutoTable.finalY + 15;
  
  // Summary Box
  const summaryBoxWidth = 80;
  const summaryBoxX = pageWidth - margin - summaryBoxWidth;
  
  doc.setFillColor(248, 249, 250);
  doc.rect(summaryBoxX, finalY, summaryBoxWidth, 60, 'F');
  doc.setDrawColor(220, 220, 220);
  doc.rect(summaryBoxX, finalY, summaryBoxWidth, 60, 'S');

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Order Summary', summaryBoxX + 5, finalY + 8);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Subtotal:`, summaryBoxX + 5, finalY + 20);
  doc.text(`Rs. ${Number(subtotal || 0).toLocaleString('en-IN')}`, summaryBoxX + summaryBoxWidth - 5, finalY + 20, 'right');
  
  if (discount && discount > 0) {
    doc.text(`Discount:`, summaryBoxX + 5, finalY + 28);
    doc.text(`- Rs. ${Number(discount).toLocaleString('en-IN')}`, summaryBoxX + summaryBoxWidth - 5, finalY + 28, 'right');
  }
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`Total:`, summaryBoxX + 5, finalY + 40);
  doc.text(`Rs. ${Number(total || 0).toLocaleString('en-IN')}`, summaryBoxX + summaryBoxWidth - 5, finalY + 40, 'right');

  // Payment Terms
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(128, 128, 128);
  doc.text('Payment Terms: Net 30 days', margin, finalY + 50);
  doc.text('Payment Method: Online/COD', margin, finalY + 55);

  // Company Footer
  doc.setFillColor(255, 102, 0); // Orange color (#FF6600)
  doc.rect(0, pageHeight - 30, pageWidth, 30, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('RG TECHNO INDUSTRIAL PRODUCTS PVT LTD', pageWidth/2, pageHeight - 20, 'center');
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('+91 9811068569 | intecomart.com | Uttar Pradesh, INDIA', pageWidth/2, pageHeight - 15, 'center');

  // Save PDF
  doc.save(`invoice_${id || 'order'}.pdf`);
};
