import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

interface CallRequestBody {
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  message: string;
  date?: string;
  timestamp: string;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CallRequestBody;
    const { firstName, lastName, email, phone, message, date, timestamp } = body;

    if (!firstName || !lastName || !phone || !message) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const logoTag = `<img src="${process.env.APP_URL || ""}/images/logo/logo.png" alt="Dekoratoriai" style="max-width:180px;height:auto;display:block;margin:0 auto;" />`;
    const formattedTime = new Date(timestamp).toLocaleString("lt-LT");

    const bg = "#0f1117";
    const card = "#1a1d27";
    const cardBorder = "#2a2d3a";
    const accent = "#14b8a6";
    const accentLight = "#5eead4";
    const textPrimary = "#f1f5f9";
    const textSecondary = "#94a3b8";
    const textMuted = "#64748b";

    const row = (label: string, value: string) => `
      <tr>
        <td style="padding:10px 16px;color:${accentLight};font-weight:600;font-size:13px;width:160px;vertical-align:top;">${label}</td>
        <td style="padding:10px 16px;color:${textPrimary};font-size:14px;vertical-align:top;">${value}</td>
      </tr>`;

    /* ============================================================
       ADMIN EMAIL
       ============================================================ */
    const adminHtml = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/></head>
<body style="margin:0;padding:0;background:${bg};font-family:'Segoe UI',Arial,sans-serif;color:${textPrimary};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;">
    <tr>
      <td style="background:${bg};padding:28px 0 12px;text-align:center;">
        ${logoTag}
      </td>
    </tr>
    <tr>
      <td style="padding:0;">
        <div style="height:3px;background:linear-gradient(90deg,transparent 0%,${accent} 30%,${accent} 70%,transparent 100%);border-radius:2px;"></div>
      </td>
    </tr>
    <tr>
      <td style="background:${card};border:1px solid ${cardBorder};border-top:none;border-radius:0 0 16px 16px;padding:32px 28px 28px;">
        <h1 style="margin:0 0 4px;font-size:22px;font-weight:300;color:${textPrimary};text-align:center;">Naujas skambučio prašymas</h1>
        <p style="margin:0 0 24px;font-size:13px;color:${textMuted};text-align:center;">Gauta ${formattedTime}</p>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${bg};border:1px solid ${cardBorder};border-radius:12px;overflow:hidden;margin-bottom:20px;">
          <tbody>
            ${row("Vardas", `${firstName} ${lastName}`)}
            ${row("Telefonas", phone)}
            ${row("El. paštas", email || "—")}
            ${date ? row("Pageidaujama data", date) : row("Pageidaujama data", "Nepasirinkta")}
          </tbody>
        </table>

        ${date ? `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:rgba(20,184,166,0.1);border:1px solid rgba(20,184,166,0.3);border-radius:12px;overflow:hidden;margin-bottom:20px;">
          <tr>
            <td style="padding:14px 18px;text-align:center;">
              <span style="font-size:13px;color:${accentLight};font-weight:600;">📅 Pageidaujamas skambučio laikas: </span>
              <span style="font-size:15px;color:${textPrimary};font-weight:400;">${date}</span>
            </td>
          </tr>
        </table>` : ''}

        <div style="background:${bg};border:1px solid ${cardBorder};border-left:3px solid ${accent};border-radius:10px;padding:16px 18px;margin-bottom:8px;">
          <p style="margin:0 0 6px;font-size:12px;color:${accentLight};font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Žinutė</p>
          <p style="margin:0;font-size:14px;color:${textPrimary};line-height:1.6;">${message}</p>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding:24px 0 8px;text-align:center;">
        <p style="margin:0;font-size:12px;color:${textMuted};">Interjero ir Fasado Dekoratoriai · Alytus, Lietuva</p>
        <p style="margin:4px 0 0;font-size:12px;color:${textMuted};">+370 671 77164 · info@dekoratoriai.lt</p>
      </td>
    </tr>
  </table>
</body>
</html>`;

    /* ============================================================
       CUSTOMER EMAIL (only if email provided)
       ============================================================ */
    const customerHtml = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/></head>
<body style="margin:0;padding:0;background:${bg};font-family:'Segoe UI',Arial,sans-serif;color:${textPrimary};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;">
    <tr>
      <td style="background:${bg};padding:28px 0 12px;text-align:center;">
        ${logoTag}
      </td>
    </tr>
    <tr>
      <td style="padding:0;">
        <div style="height:3px;background:linear-gradient(90deg,transparent 0%,${accent} 30%,${accent} 70%,transparent 100%);border-radius:2px;"></div>
      </td>
    </tr>
    <tr>
      <td style="background:${card};border:1px solid ${cardBorder};border-top:none;border-radius:0 0 16px 16px;padding:32px 28px 28px;">
        <h1 style="margin:0 0 6px;font-size:22px;font-weight:300;color:${textPrimary};text-align:center;">Ačiū, ${firstName}!</h1>
        <p style="margin:0 0 24px;font-size:14px;color:${textSecondary};text-align:center;">Jūsų skambučio prašymas yra užregistruotas.</p>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:rgba(20,184,166,0.1);border:1px solid rgba(20,184,166,0.3);border-radius:12px;overflow:hidden;margin-bottom:24px;">
          <tr>
            <td style="padding:20px;text-align:center;">
              <p style="margin:0 0 6px;font-size:30px;">📞</p>
              <p style="margin:0 0 4px;font-size:14px;color:${accentLight};font-weight:600;">Paskambinsime jums</p>
              <p style="margin:0;font-size:15px;color:${textPrimary};">${date || 'Artimiausiu metu'}</p>
            </td>
          </tr>
        </table>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${bg};border:1px solid ${cardBorder};border-radius:12px;overflow:hidden;margin-bottom:20px;">
          <tbody>
            ${row("Jūsų vardas", `${firstName} ${lastName}`)}
            ${row("Telefonas", phone)}
            ${date ? row("Pasirinktas laikas", date) : ''}
          </tbody>
        </table>

        <div style="background:${bg};border:1px solid ${cardBorder};border-left:3px solid ${accent};border-radius:10px;padding:16px 18px;margin-bottom:24px;">
          <p style="margin:0 0 6px;font-size:12px;color:${accentLight};font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Jūsų žinutė</p>
          <p style="margin:0;font-size:14px;color:${textPrimary};line-height:1.6;">${message}</p>
        </div>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${bg};border:1px solid ${cardBorder};border-radius:12px;overflow:hidden;">
          <tr>
            <td style="padding:16px 18px;">
              <p style="margin:0 0 10px;font-size:13px;color:${accentLight};font-weight:600;">Mūsų kontaktai</p>
              <p style="margin:0 0 4px;font-size:13px;color:${textSecondary};">📞&nbsp; +370 671 77164</p>
              <p style="margin:0 0 4px;font-size:13px;color:${textSecondary};">✉️&nbsp; info@dekoratoriai.lt</p>
              <p style="margin:0;font-size:13px;color:${textSecondary};">📍&nbsp; Alytus, Lietuva</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:24px 0 8px;text-align:center;">
        <p style="margin:0;font-size:12px;color:${textMuted};">Su pagarba,</p>
        <p style="margin:4px 0 0;font-size:12px;color:${textMuted};font-weight:600;">Interjero ir Fasado Dekoratoriai</p>
      </td>
    </tr>
  </table>
</body>
</html>`;

    /* ============================================================
       SEND
       ============================================================ */
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: `📞 Skambutis – ${firstName} ${lastName}`,
      html: adminHtml,
    });

    if (email) {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Jūsų skambučio prašymas užregistruotas",
        html: customerHtml,
      });
    }

    return NextResponse.json({ success: true, message: "Emails sent successfully" });

  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to send emails",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}