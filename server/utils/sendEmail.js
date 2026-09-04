let nodemailer;
try {
  nodemailer = (await import("nodemailer")).default;
} catch (e) {
  // Nodemailer not installed yet; email utility falls back to console logging
}

// ── Create Transporter (SMTP or Mock) ─────────────────────────────────────────
const getTransporter = () => {
  if (!nodemailer) return null;
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
  const host = process.env.SMTP_HOST || (user && user.includes("@gmail.com") ? "smtp.gmail.com" : null);
  const port = Number(process.env.SMTP_PORT) || 465;
  const secure = process.env.SMTP_SECURE !== undefined ? process.env.SMTP_SECURE === "true" : port === 465;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });
  }
  return null;
};

/**
 * Sends an email using Nodemailer if SMTP is configured,
 * otherwise logs the complete formatted email to the console.
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  const from = process.env.SMTP_FROM || process.env.EMAIL_FROM || process.env.SMTP_USER || '"GasGo Lanka" <no-reply@gasgo.lk>';
  const transporter = getTransporter();

  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from,
        to,
        subject,
        text,
        html,
      });
      console.log(`✅ [EMAIL SENT via SMTP] to: ${to} (Message ID: ${info.messageId})`);
      return { success: true, messageId: info.messageId };
    } catch (err) {
      console.error(`❌ [EMAIL SMTP ERROR] to: ${to}:`, err.message);
    }
  }

  // Development / fallback preview
  console.log(`
╔══════════════════════════════════════════════════════════════════════╗
║  📧 EMAIL NOTIFICATION DISPATCHED                                    ║
╠══════════════════════════════════════════════════════════════════════╣
║ To:      ${to.padEnd(59)} ║
║ Subject: ${subject.padEnd(59)} ║
╠══════════════════════════════════════════════════════════════════════╣
${text.split("\n").map(line => `║ ${line.padEnd(68)} ║`).join("\n")}
╚══════════════════════════════════════════════════════════════════════╝
  `);
  return { success: true, mock: true };
};

// ── 1. Customer Order Confirmation Email Template ────────────────────────────
export function orderConfirmationEmail({ token, shopName, shopAddress, shopPhone, items, totalAmount, status, customerName }) {
  const itemRowsHtml = items
    .map(
      (i) => `
      <tr>
        <td style="padding: 10px 12px; border-bottom: 1px solid #2a3756; color: #ffffff; font-weight: 600;">
          ${i.cylinderSize} <span style="color: #f5a623;">${i.gasType}</span>
        </td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #2a3756; color: #a0aec0; text-align: center;">
          ${i.quantity}
        </td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #2a3756; color: #ffffff; text-align: right; font-weight: 600;">
          Rs. ${(i.price * i.quantity).toLocaleString('en-LK')}
        </td>
      </tr>`
    )
    .join("");

  const itemLinesText = items
    .map((i) => `  • ${i.cylinderSize} ${i.gasType} × ${i.quantity} = Rs. ${(i.price * i.quantity).toLocaleString('en-LK')}`)
    .join("\n");

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #080e1c; color: #eef2ff; margin: 0; padding: 20px; }
      .card { max-width: 580px; margin: 0 auto; background: #0f1829; border: 1px solid #25334d; border-radius: 12px; padding: 32px; }
      .logo { font-size: 24px; font-weight: 900; color: #f2752e; text-align: center; margin-bottom: 8px; }
      .tagline { font-size: 13px; color: #a0aec0; text-align: center; margin-bottom: 24px; }
      .token-box { background: rgba(232, 93, 26, 0.12); border: 2px solid #e85d1a; border-radius: 10px; padding: 20px; text-align: center; margin: 24px 0; }
      .token-label { font-size: 12px; text-transform: uppercase; color: #f5a623; font-weight: 700; letter-spacing: 1px; }
      .token-code { font-size: 28px; font-weight: 900; color: #ffffff; margin-top: 6px; letter-spacing: 2px; }
      .notice { background: rgba(245, 166, 35, 0.1); border-left: 4px solid #f5a623; padding: 12px 16px; border-radius: 4px; font-size: 13px; color: #e2e8f0; margin-bottom: 24px; line-height: 1.4; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
      th { text-align: left; padding: 10px 12px; color: #a0aec0; font-size: 12px; text-transform: uppercase; border-bottom: 1px solid #2a3756; }
      .total-row td { padding: 14px 12px 6px; font-size: 16px; font-weight: 800; color: #ffffff; border-top: 2px solid #2a3756; }
      .shop-box { background: #162035; border-radius: 8px; padding: 16px; font-size: 13px; color: #cbd5e0; margin-top: 24px; }
      .footer { text-align: center; font-size: 12px; color: #718096; margin-top: 32px; }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="logo">GasGo Lanka 🇱🇰</div>
      <div class="tagline">Order. Get Your Token. Get Your Gas.</div>

      <h2 style="color: #ffffff; margin-top: 0;">Order Confirmed! 🎉</h2>
      <p style="color: #cbd5e0; line-height: 1.5;">
        Hi <strong>${customerName}</strong>, your gas cylinder order has been confirmed.
      </p>

      <div class="token-box">
        <div class="token-label">Pickup Token Number</div>
        <div class="token-code">${token}</div>
      </div>

      <div class="notice">
        💡 <strong>Pickup Notice:</strong> Present this token code at the counter when you visit the shop to collect your gas cylinder(s).
      </div>

      <table>
        <thead>
          <tr>
            <th>Cylinder</th>
            <th style="text-align: center;">Qty</th>
            <th style="text-align: right;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${itemRowsHtml}
          <tr class="total-row">
            <td colspan="2">Total Amount</td>
            <td style="text-align: right; color: #f2752e;">Rs. ${Number(totalAmount).toLocaleString('en-LK')}</td>
          </tr>
        </tbody>
      </table>

      <div class="shop-box">
        <strong style="color: #ffffff; font-size: 14px;">🏪 ${shopName}</strong><br/>
        ${shopAddress ? `📍 ${shopAddress}<br/>` : ''}
        ${shopPhone ? `📞 ${shopPhone}<br/>` : ''}
        <span style="color: #22c55e;">Status: ${status.toUpperCase()}</span>
      </div>

      <div class="footer">
        © ${new Date().getFullYear()} GasGo Lanka (Pvt) Ltd. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;

  const text = `
Hello ${customerName},

Your GasGo cylinder order has been placed successfully!

═══════════════════════════════════════
YOUR PICKUP TOKEN: ${token}
═══════════════════════════════════════

Show this token code at the shop counter to collect your cylinder.

Pickup Shop: ${shopName}
${shopAddress ? `Address: ${shopAddress}` : ''}
${shopPhone ? `Phone: ${shopPhone}` : ''}

Order Items:
${itemLinesText}

Total Amount: Rs. ${Number(totalAmount).toLocaleString('en-LK')}
Status: ${status.toUpperCase()}

Thank you for choosing GasGo Lanka!
  `.trim();

  return {
    subject: `GasGo Order Confirmation - Token #${token}`,
    html,
    text,
  };
}

// ── 2. Shop Owner New Order Alert Email Template ─────────────────────────────
export function newOrderAlertEmail({ token, customerName, customerEmail, customerPhone, items, totalAmount, shopName }) {
  const itemRowsHtml = items
    .map(
      (i) => `
      <tr>
        <td style="padding: 10px 12px; border-bottom: 1px solid #2a3756; color: #ffffff; font-weight: 600;">
          ${i.cylinderSize} <span style="color: #f5a623;">${i.gasType}</span>
        </td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #2a3756; color: #a0aec0; text-align: center;">
          ${i.quantity}
        </td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #2a3756; color: #ffffff; text-align: right; font-weight: 600;">
          Rs. ${(i.price * i.quantity).toLocaleString('en-LK')}
        </td>
      </tr>`
    )
    .join("");

  const itemLinesText = items
    .map((i) => `  • ${i.cylinderSize} ${i.gasType} × ${i.quantity} = Rs. ${(i.price * i.quantity).toLocaleString('en-LK')}`)
    .join("\n");

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #080e1c; color: #eef2ff; margin: 0; padding: 20px; }
      .card { max-width: 580px; margin: 0 auto; background: #0f1829; border: 1px solid #25334d; border-radius: 12px; padding: 32px; }
      .logo { font-size: 24px; font-weight: 900; color: #f2752e; text-align: center; margin-bottom: 8px; }
      .token-box { background: rgba(34, 197, 94, 0.12); border: 2px solid #22c55e; border-radius: 10px; padding: 18px; text-align: center; margin: 20px 0; }
      .token-label { font-size: 12px; text-transform: uppercase; color: #22c55e; font-weight: 700; letter-spacing: 1px; }
      .token-code { font-size: 26px; font-weight: 900; color: #ffffff; margin-top: 4px; letter-spacing: 2px; }
      .cust-box { background: #162035; border-radius: 8px; padding: 16px; font-size: 13px; color: #cbd5e0; margin-bottom: 20px; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
      th { text-align: left; padding: 10px 12px; color: #a0aec0; font-size: 12px; text-transform: uppercase; border-bottom: 1px solid #2a3756; }
      .total-row td { padding: 14px 12px 6px; font-size: 16px; font-weight: 800; color: #ffffff; border-top: 2px solid #2a3756; }
      .footer { text-align: center; font-size: 12px; color: #718096; margin-top: 28px; }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="logo">GasGo Merchant 🏪</div>

      <h2 style="color: #ffffff; margin-top: 0;">New Cylinder Order Received!</h2>
      <p style="color: #cbd5e0; line-height: 1.5;">
        A new customer order has been placed for <strong>${shopName || 'your shop'}</strong>.
      </p>

      <div class="token-box">
        <div class="token-label">Customer Pickup Token</div>
        <div class="token-code">${token}</div>
      </div>

      <div class="cust-box">
        <strong style="color: #ffffff;">Customer Details:</strong><br/>
        👤 Name: ${customerName}<br/>
        ✉️ Email: ${customerEmail}<br/>
        ${customerPhone ? `📞 Phone: ${customerPhone}<br/>` : ''}
      </div>

      <table>
        <thead>
          <tr>
            <th>Cylinder</th>
            <th style="text-align: center;">Qty</th>
            <th style="text-align: right;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${itemRowsHtml}
          <tr class="total-row">
            <td colspan="2">Order Value</td>
            <td style="text-align: right; color: #22c55e;">Rs. ${Number(totalAmount).toLocaleString('en-LK')}</td>
          </tr>
        </tbody>
      </table>

      <p style="color: #a0aec0; font-size: 13px;">
        Please prepare the cylinders and mark the order as <strong>Ready</strong> on your GasGo Merchant Dashboard.
      </p>

      <div class="footer">
        GasGo Lanka Merchant Notification System
      </div>
    </div>
  </body>
  </html>
  `;

  const text = `
NEW GASGO ORDER RECEIVED!

Shop: ${shopName || 'Your Shop'}
Customer Token: ${token}

Customer Info:
• Name: ${customerName}
• Email: ${customerEmail}
• Phone: ${customerPhone || 'N/A'}

Ordered Items:
${itemLinesText}

Total Order Value: Rs. ${Number(totalAmount).toLocaleString('en-LK')}

Please log in to your Merchant Dashboard to prepare and advance this order.
  `.trim();

  return {
    subject: `🔔 New Order Received - Token #${token}`,
    html,
    text,
  };
}
