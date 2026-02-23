import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

function formatPrice(price: number) {
  return `€${price.toFixed(2)}`;
}

function buildItemsHtml(cart: any[]) {
  return cart
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;">${item.title}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;">${formatPrice(item.price * item.quantity)}</td>
      </tr>`
    )
    .join("");
}

function buildItemsText(cart: any[]) {
  return cart
    .map(
      (item) =>
        `- ${item.title} x${item.quantity}: ${formatPrice(item.price * item.quantity)}`
    )
    .join("\n");
}

export async function POST(req: NextRequest) {
  // Use your actual env var names from .env.local
  const EMAIL_HOST = process.env.SMTP_HOST;
  const EMAIL_PORT = Number(process.env.SMTP_PORT ?? 587);
  const EMAIL_USER = process.env.SMTP_USER;
  const EMAIL_PASS = process.env.SMTP_PASSWORD;
  const EMAIL_FROM = process.env.EMAIL_FROM;
  const STORE_EMAIL = process.env.ADMIN_EMAIL; // dekoratoriailt@gmail.com

  if (!EMAIL_HOST || !EMAIL_USER || !EMAIL_PASS || !EMAIL_FROM || !STORE_EMAIL) {
    const missing = [
      !EMAIL_HOST && "SMTP_HOST",
      !EMAIL_USER && "SMTP_USER",
      !EMAIL_PASS && "SMTP_PASSWORD",
      !EMAIL_FROM && "EMAIL_FROM",
      !STORE_EMAIL && "ADMIN_EMAIL",
    ]
      .filter(Boolean)
      .join(", ");

    console.error(`Missing email env vars: ${missing}`);
    return NextResponse.json(
      { error: `Server misconfiguration: missing ${missing}` },
      { status: 500 }
    );
  }

  const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: EMAIL_PORT === 465,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  try {
    const { orderNumber, customerDetails, addressState, cart, cartTotal } =
      await req.json();

    const addressLine = [
      addressState.line_1,
      addressState.line_2,
      addressState.city,
      addressState.postal_code,
      addressState.country,
    ]
      .filter(Boolean)
      .join(", ");

    const itemsHtml = buildItemsHtml(cart);
    const itemsText = buildItemsText(cart);

    // -------------------------------------------------------------------------
    // 1. EMAIL TO CUSTOMER
    // -------------------------------------------------------------------------
    const customerHtml = `
<!DOCTYPE html>
<html lang="lt">
<head><meta charset="UTF-8" /><title>Užsakymo patvirtinimas</title></head>
<body style="font-family:Arial,sans-serif;background:#f9f9f9;margin:0;padding:0;">
  <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
    <div style="background:#0f172a;padding:32px 40px;">
      <h1 style="color:#fff;margin:0;font-size:24px;font-weight:300;">Užsakymas gautas</h1>
      <p style="color:#94a3b8;margin:8px 0 0;">Užsakymo numeris: <strong style="color:#fff;">${orderNumber}</strong></p>
    </div>
    <div style="padding:32px 40px;">
      <p style="color:#374151;">Sveiki, <strong>${customerDetails.name}</strong>!</p>
      <p style="color:#374151;">Dėkojame už užsakymą. Netrukus susisieksime su jumis dėl apmokėjimo ir pristatymo detalių.</p>
      <h2 style="font-size:16px;font-weight:600;color:#111;margin-top:28px;">Užsakytos prekės</h2>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="background:#f3f4f6;">
            <th style="padding:8px 12px;text-align:left;font-size:13px;color:#6b7280;">Prekė</th>
            <th style="padding:8px 12px;text-align:center;font-size:13px;color:#6b7280;">Kiekis</th>
            <th style="padding:8px 12px;text-align:right;font-size:13px;color:#6b7280;">Suma</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>
      <div style="margin-top:16px;text-align:right;">
        <span style="font-size:18px;font-weight:700;color:#111;">Viso: ${formatPrice(cartTotal)}</span>
      </div>
      <h2 style="font-size:16px;font-weight:600;color:#111;margin-top:28px;">Pristatymo adresas</h2>
      <p style="color:#374151;margin:0;">${addressLine}</p>
      <p style="color:#6b7280;font-size:13px;margin-top:32px;">
        Jei turite klausimų, rašykite mums atsakydami į šį el. laišką.
      </p>
    </div>
    <div style="background:#f3f4f6;padding:16px 40px;text-align:center;">
      <p style="color:#9ca3af;font-size:12px;margin:0;">© ${new Date().getFullYear()} Lietuvos Gipsas. Visos teisės saugomos.</p>
    </div>
  </div>
</body>
</html>`;

    await transporter.sendMail({
      from: EMAIL_FROM,
      to: customerDetails.email,
      subject: `Užsakymo patvirtinimas – ${orderNumber}`,
      html: customerHtml,
      text: `Sveiki, ${customerDetails.name}!\n\nDėkojame už užsakymą ${orderNumber}.\n\n${itemsText}\n\nViso: ${formatPrice(cartTotal)}\n\nPristatymo adresas: ${addressLine}\n\nNetrukus susisieksime dėl apmokėjimo ir pristatymo.`,
    });

    // -------------------------------------------------------------------------
    // 2. EMAIL TO STORE
    // -------------------------------------------------------------------------
    const storeHtml = `
<!DOCTYPE html>
<html lang="lt">
<head><meta charset="UTF-8" /><title>Naujas užsakymas</title></head>
<body style="font-family:Arial,sans-serif;background:#f9f9f9;margin:0;padding:0;">
  <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
    <div style="background:#0f172a;padding:32px 40px;">
      <h1 style="color:#fff;margin:0;font-size:24px;font-weight:300;">🛒 Naujas užsakymas</h1>
      <p style="color:#94a3b8;margin:8px 0 0;">Užsakymo numeris: <strong style="color:#fff;">${orderNumber}</strong></p>
    </div>
    <div style="padding:32px 40px;">
      <h2 style="font-size:16px;font-weight:600;color:#111;margin-top:0;">Kliento duomenys</h2>
      <table style="width:100%;">
        <tr><td style="color:#6b7280;padding:4px 0;width:140px;">Vardas:</td><td style="color:#111;">${customerDetails.name}</td></tr>
        <tr><td style="color:#6b7280;padding:4px 0;">El. paštas:</td><td><a href="mailto:${customerDetails.email}" style="color:#2563eb;">${customerDetails.email}</a></td></tr>
        <tr><td style="color:#6b7280;padding:4px 0;">Telefonas:</td><td style="color:#111;">${customerDetails.phone || "—"}</td></tr>
        <tr><td style="color:#6b7280;padding:4px 0;">Adresas:</td><td style="color:#111;">${addressLine}</td></tr>
      </table>
      <h2 style="font-size:16px;font-weight:600;color:#111;margin-top:28px;">Užsakytos prekės</h2>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="background:#f3f4f6;">
            <th style="padding:8px 12px;text-align:left;font-size:13px;color:#6b7280;">Prekė</th>
            <th style="padding:8px 12px;text-align:center;font-size:13px;color:#6b7280;">Kiekis</th>
            <th style="padding:8px 12px;text-align:right;font-size:13px;color:#6b7280;">Suma</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>
      <div style="margin-top:16px;text-align:right;">
        <span style="font-size:20px;font-weight:700;color:#111;">Viso: ${formatPrice(cartTotal)}</span>
      </div>
    </div>
    <div style="background:#f3f4f6;padding:16px 40px;text-align:center;">
      <p style="color:#9ca3af;font-size:12px;margin:0;">Užsakymas gautas ${new Date().toLocaleString("lt-LT")}</p>
    </div>
  </div>
</body>
</html>`;

    await transporter.sendMail({
      from: EMAIL_FROM,
      to: STORE_EMAIL,
      subject: `[Naujas užsakymas] ${orderNumber} – ${customerDetails.name}`,
      html: storeHtml,
      text: `Naujas užsakymas ${orderNumber}\n\nKlientas: ${customerDetails.name}\nEl. paštas: ${customerDetails.email}\nTelefonas: ${customerDetails.phone || "—"}\nAdresas: ${addressLine}\n\n${itemsText}\n\nViso: ${formatPrice(cartTotal)}`,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("send-order-email error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}