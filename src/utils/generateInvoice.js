// Replace your current downloadInvoice with this:
const downloadInvoice = () => {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const left = 40;
  let y = 40;

  // Company Header
  doc.setFontSize(18);
  doc.text(company.name, left, y);
  doc.setFontSize(10);
  doc.text(company.addressLine1 + " • " + company.addressLine2, left, (y += 18));
  doc.text(`Phone: ${company.phone}  •  ${company.gst}`, left, (y += 14));

  // Order info (right side)
  doc.setFontSize(12);
  doc.text(`Invoice: ${orderId}`, 530, 40, { align: "right" });
  doc.text(`Date: ${createdAt.toLocaleString()}`, 530, 56, { align: "right" });

  y += 30;

  // Billing Info
  doc.setFontSize(12);
  doc.text("Bill To:", left, (y += 20));
  doc.setFontSize(10);
  const ship = order.shipping || {};
  doc.text(`${ship.firstName || ""} ${ship.lastName || ""}`, left, (y += 14));
  doc.text(ship.email || "", left, (y += 14));
  doc.text(ship.phone || "", left, (y += 14));
  const addr = ship.address
    ? `${ship.address}, ${ship.city || ""}, ${ship.state || ""} ${ship.zip || ""}`
    : "";
  doc.text(addr, left, (y += 14));

  // Table Header
  y += 30;
  doc.setFontSize(11);
  doc.setFont(undefined, "bold");
  doc.text("Product", left, y);
  doc.text("Mode", left + 220, y);
  doc.text("Qty", left + 300, y);
  doc.text("Price", left + 350, y);
  doc.text("Days", left + 420, y);
  doc.text("Line Total", left + 480, y);
  doc.setFont(undefined, "normal");
  doc.line(left, y + 4, 560, y + 4);

  // Table Rows
  items.forEach((it) => {
    y += 20;
    const isRent = (it.mode || "").toLowerCase() === "rent";
    const lineTotal = it.lineTotal ?? it.price * (it.quantity || 1);

    doc.text(it.name, left, y, { maxWidth: 200 });
    doc.text(it.mode || "Buy", left + 220, y);
    doc.text(String(it.quantity || 1), left + 300, y);
    doc.text(inr(it.price), left + 350, y);
    doc.text(isRent ? String(it.rentalDays || "-") : "-", left + 420, y);
    doc.text(inr(lineTotal), left + 480, y);
  });

  // Totals
  y += 40;
  doc.setFontSize(11);
  doc.text(`Subtotal: ${inr(subtotal)}`, left, y);
  doc.text(`Delivery: ${delivery === 0 ? "FREE" : inr(delivery)}`, left, (y += 16));
  doc.setFontSize(13);
  doc.text(`Grand Total: ${inr(grandTotal)}`, left, (y += 20));
  doc.setFontSize(10);
  doc.text(`Payment: ${order.paymentMethod || "N/A"}`, left, (y += 20));

  doc.save(`Invoice_${orderId}.pdf`);
};
