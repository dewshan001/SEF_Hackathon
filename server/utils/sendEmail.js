// Email utility — logs to console in development (mock).
// Replace with real Nodemailer integration when SMTP credentials are available.

export const sendEmail = ({ to, subject, html, text }) => {
  const body = text || html?.replace(/<[^>]*>/g, "") || "";
  console.log(
    `\n📧 [EMAIL] → ${to}\n   Subject: ${subject}\n   ${body}\n`
  );
};

// ── Email templates ──────────────────────────────────────────────────────────

export function orderConfirmationEmail({ token, shopName, items, totalAmount, status, customerName }) {
  const itemLines = items
    .map((i) => `  • ${i.cylinderSize} ${i.gasType} × ${i.quantity} = Rs. ${(i.price * i.quantity).toLocaleString()}`)
    .join("\n");

  return {
    subject: `GasGo Order Confirmation - ${token}`,
    text: `
Hello ${customerName},

Your GasGo order has been placed successfully!

Token Number: ${token}
Shop: ${shopName}

Items:
${itemLines}

Total Amount: Rs. ${totalAmount.toLocaleString()}
Status: ${status.toUpperCase()}

Please keep your token number handy when collecting your gas cylinders.

Thank you for using GasGo!
    `.trim(),
  };
}

export function newOrderAlertEmail({ token, customerName, customerEmail, items, totalAmount }) {
  const itemLines = items
    .map((i) => `  • ${i.cylinderSize} ${i.gasType} × ${i.quantity}`)
    .join("\n");

  return {
    subject: `New GasGo Order - ${token}`,
    text: `
You have a new cylinder order!

Token: ${token}
Customer: ${customerName}
Customer Email: ${customerEmail}

Items:
${itemLines}

Total Amount: Rs. ${totalAmount.toLocaleString()}

Please log in to your GasGo dashboard to manage this order.
    `.trim(),
  };
}
