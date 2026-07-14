import { Resend } from "resend";
import type { Registration } from "@/app/types/registration";
import { TRACK_COLORS } from "@/app/types/registration";
import { daysUntilEvent, EVENT_DATE_LABEL } from "@/app/lib/event";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.RESEND_FROM_EMAIL!;

export async function sendAccessCard(registration: Registration) {
  const html = buildAccessCardHtml(registration);

  return resend.emails.send({
    from: FROM || "CSCON Team <noreply@csconoau.xyz>",
    to: registration.email,
    subject: "🎟️ Your CSCON 5.0 Access Card is here",
    html,
  });
}

export async function sendReminder(registration: Registration) {
  const days = daysUntilEvent();
  const html = buildReminderHtml(registration, days);
  const subject =
    days > 1
      ? `⏳ ${days} days to CSCON 5.0`
      : days === 1
      ? `⏳ Tomorrow: CSCON 5.0`
      : days === 0
      ? `🎉 Today's the day — CSCON 5.0`
      : `CSCON 5.0 — thanks for coming`;

  return resend.emails.send({
    from: FROM || "CSCON Team <noreply@csconoau.xyz>",
    to: registration.email,
    subject,
    html,
  });
}

function buildAccessCardHtml(reg: Registration): string {
  const track = TRACK_COLORS[reg.track];
  const firstName = reg.fullName.split(" ")[0];

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>CSCON 5.0 Access Card</title>
</head>
<body style="margin:0; padding:0; background-color:#050505; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#050505; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 480px;">

          <!-- Preheader -->
          <tr>
            <td style="color:#39FF14; font-size:11px; font-weight:700; letter-spacing:3px; text-transform:uppercase; padding-bottom:14px; text-align:center;">
              You're in, ${escapeHtml(firstName)}
            </td>
          </tr>

          <!-- Ticket card -->
          <tr>
            <td style="background:#0c0c0c; border:1px solid rgba(57,255,20,0.25); border-radius:20px; overflow:hidden;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">

                <!-- Header strip -->
                <tr>
                  <td style="padding:28px 28px 20px 28px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          <div style="font-size:12px; font-weight:800; letter-spacing:2px; color:#39FF14; text-transform:uppercase;">Access Card</div>
                          <div style="font-size:26px; font-weight:900; color:#ffffff; letter-spacing:-0.02em; margin-top:4px;">CS<span style="color:#39FF14;">CON</span> 5.0</div>
                        </td>
                        <td align="right" style="vertical-align:top;">
                          <div style="display:inline-block; background:${track.accent}; color:#000000; font-size:11px; font-weight:800; letter-spacing:1px; text-transform:uppercase; padding:6px 12px; border-radius:6px;">
                            ${escapeHtml(reg.track)} Track
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Perforation -->
                <tr>
                  <td style="padding:0 28px;">
                    <div style="border-top:1px dashed rgba(255,255,255,0.2);"></div>
                  </td>
                </tr>

                <!-- Attendee -->
                <tr>
                  <td style="padding:24px 28px 4px 28px;">
                    <div style="font-size:10px; color:rgba(255,255,255,0.4); font-weight:700; letter-spacing:2px; text-transform:uppercase;">Attendee</div>
                    <div style="font-size:22px; font-weight:800; color:#ffffff; margin-top:6px;">${escapeHtml(reg.fullName)}</div>
                    <div style="font-size:13px; color:rgba(255,255,255,0.5); margin-top:2px;">${escapeHtml(reg.role)} · ${escapeHtml(reg.institution)}</div>
                  </td>
                </tr>

                <!-- Details grid -->
                <tr>
                  <td style="padding:20px 28px 4px 28px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="50%" style="padding-bottom:16px;">
                          <div style="font-size:10px; color:rgba(255,255,255,0.4); font-weight:700; letter-spacing:2px; text-transform:uppercase;">Date</div>
                          <div style="font-size:14px; color:#ffffff; font-weight:600; margin-top:4px;">July 21, 2026</div>
                        </td>
                        <td width="50%" style="padding-bottom:16px;">
                          <div style="font-size:10px; color:rgba(255,255,255,0.4); font-weight:700; letter-spacing:2px; text-transform:uppercase;">Venue</div>
                          <div style="font-size:14px; color:#ffffff; font-weight:600; margin-top:4px;">Trust Hall, OAU</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Perforation -->
                <tr>
                  <td style="padding:0 28px;">
                    <div style="border-top:1px dashed rgba(255,255,255,0.2);"></div>
                  </td>
                </tr>

                <!-- Access code -->
                <tr>
                  <td style="padding:22px 28px 28px 28px;" align="center">
                    <div style="font-size:10px; color:rgba(255,255,255,0.4); font-weight:700; letter-spacing:2px; text-transform:uppercase; margin-bottom:10px;">Access Code · Show at check-in</div>
                    <div style="display:inline-block; background:rgba(57,255,20,0.08); border:1px solid rgba(57,255,20,0.35); border-radius:10px; padding:14px 22px;">
                      <span style="font-family: 'Courier New', monospace; font-size:22px; font-weight:800; letter-spacing:4px; color:#39FF14;">${escapeHtml(reg.accessCode)}</span>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer note -->
          <tr>
            <td style="padding:24px 12px 0 12px; text-align:center;">
              <p style="font-size:13px; color:rgba(255,255,255,0.45); line-height:1.6; margin:0;">
                Save this email or take a screenshot of your code — you'll need it to check in at Trust Hall.
                See you July 21th. Let's build, create, and scale.
              </p>
              <p style="font-size:11px; color:rgba(255,255,255,0.25); margin-top:20px;">
                NACOS OAU · CSCON 5.0 · Ile-Ife, Nigeria
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

function buildReminderHtml(reg: Registration, days: number): string {
  const track = TRACK_COLORS[reg.track];
  const firstName = reg.fullName.split(" ")[0];

  const countdownLabel =
    days > 1 ? `${days} days to go` : days === 1 ? "Tomorrow" : days === 0 ? "Today" : "It's been a blast";

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>CSCON 5.0 Reminder</title>
</head>
<body style="margin:0; padding:0; background-color:#050505; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#050505; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 480px;">

          <!-- Preheader -->
          <tr>
            <td style="color:#39FF14; font-size:11px; font-weight:700; letter-spacing:3px; text-transform:uppercase; padding-bottom:14px; text-align:center;">
              Reminder for ${escapeHtml(firstName)}
            </td>
          </tr>

          <!-- Countdown card -->
          <tr>
            <td style="background:#0c0c0c; border:1px solid rgba(57,255,20,0.25); border-radius:20px; overflow:hidden;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">

                <tr>
                  <td style="padding:32px 28px 8px 28px;" align="center">
                    <div style="font-size:12px; font-weight:800; letter-spacing:2px; color:rgba(255,255,255,0.4); text-transform:uppercase;">CSCON 5.0</div>
                    <div style="font-size:44px; font-weight:900; color:#39FF14; letter-spacing:-0.02em; margin-top:10px; line-height:1;">
                      ${days >= 0 ? days : "🎉"}
                    </div>
                    <div style="font-size:14px; font-weight:700; color:#ffffff; letter-spacing:1px; text-transform:uppercase; margin-top:6px;">
                      ${escapeHtml(countdownLabel)}
                    </div>
                  </td>
                </tr>

                <tr>
                  <td style="padding:20px 28px 0 28px;">
                    <div style="border-top:1px dashed rgba(255,255,255,0.2);"></div>
                  </td>
                </tr>

                <tr>
                  <td style="padding:24px 28px 4px 28px;" align="center">
                    <p style="font-size:14px; color:rgba(255,255,255,0.65); line-height:1.7; margin:0;">
                      Hey ${escapeHtml(firstName)} — CSCON 5.0 lands on <strong style="color:#ffffff;">${EVENT_DATE_LABEL}</strong> at
                      <strong style="color:#ffffff;">Trust Hall, OAU</strong>. You're registered on the
                      <span style="color:${track.accent}; font-weight:700;">${escapeHtml(reg.track)} track</span> — get ready to build, create, and scale.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:20px 28px 0 28px;">
                    <div style="border-top:1px dashed rgba(255,255,255,0.2);"></div>
                  </td>
                </tr>

                <tr>
                  <td style="padding:22px 28px 28px 28px;" align="center">
                    <div style="font-size:10px; color:rgba(255,255,255,0.4); font-weight:700; letter-spacing:2px; text-transform:uppercase; margin-bottom:10px;">Your Access Code</div>
                    <div style="display:inline-block; background:rgba(57,255,20,0.08); border:1px solid rgba(57,255,20,0.35); border-radius:10px; padding:12px 20px;">
                      <span style="font-family: 'Courier New', monospace; font-size:18px; font-weight:800; letter-spacing:3px; color:#39FF14;">${escapeHtml(reg.accessCode)}</span>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 12px 0 12px; text-align:center;">
              <p style="font-size:11px; color:rgba(255,255,255,0.25); margin-top:4px;">
                NACOS OAU · CSCON 5.0 · Ile-Ife, Nigeria
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}