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

export async function sendBatchReminders(registrations: Registration[]) {
  const days = daysUntilEvent();
  
  // Build subject based on days
  const subject =
    days > 1
      ? `⏳ ${days} days to CSCON 5.0`
      : days === 1
      ? `⏳ Tomorrow: CSCON 5.0`
      : days === 0
      ? `🎉 Today's the day — CSCON 5.0`
      : `CSCON 5.0 — thanks for coming`;

  // Prepare all emails
  const emailPromises = registrations.map(async (registration) => {
    const html = buildReminderHtml(registration, days);
    
    return resend.emails.send({
      from: FROM || "CSCON Team <noreply@csconoau.xyz>",
      to: registration.email,
      subject,
      html,
    });
  });

  // Execute all emails in parallel with error handling
  const results = await Promise.allSettled(emailPromises);
  
  // Count successes and failures
  const successful = results.filter(result => result.status === 'fulfilled').length;
  const failed = results.filter(result => result.status === 'rejected').length;
  
  return {
    total: registrations.length,
    success: successful,
    failed: failed,
    errors: results
      .filter(result => result.status === 'rejected')
      .map((result, index) => ({
        email: registrations[index].email,
        error: (result as PromiseRejectedResult).reason
      }))
  };
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
                          <div style="font-size:14px; color:#ffffff; font-weight:600; margin-top:4px;">September 3rd, 2026</div>
                        </td>
                        <td width="50%" style="padding-bottom:16px;">
                          <div style="font-size:10px; color:rgba(255,255,255,0.4); font-weight:700; letter-spacing:2px; text-transform:uppercase;">Venue</div>
                          <div style="font-size:14px; color:#ffffff; font-weight:600; margin-top:4px;">ACE Conference Hall, OAU</div>
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
                Save this email or take a screenshot of your code — you'll need it to check in at ACE Conference Hall.
                See you September 3rdth. Let's build, create, and scale.
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
                      <strong style="color:#ffffff;">ACE conference Hall, OAU</strong>. You're registered on the
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


export async function sendPostponementBatchWithRetry(
  registrations: Registration[], 
  maxRetries = 2
) {
  const results = {
    success: 0,
    failed: 0,
    errors: [] as { email: string; error: string }[],
  };

  const BATCH_SIZE = 50;
  
  for (let i = 0; i < registrations.length; i += BATCH_SIZE) {
    const batch = registrations.slice(i, i + BATCH_SIZE);
    
    const promises = batch.map(async (registration) => {
      let lastError = "";
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const html = buildPostponementHtml(registration);
          await resend.emails.send({
            from: FROM || "CSCON Team <noreply@csconoau.xyz>",
            to: registration.email,
            subject: "📅 CSCON 5.0 — Important Update on Event Date",
            html,
          });
          return { success: true, email: registration.email };
        } catch (error) {
          lastError = error instanceof Error ? error.message : "Unknown error";
          
          // Wait before retry (exponential backoff)
          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
          }
        }
      }
      
      return { 
        success: false, 
        email: registration.email, 
        error: lastError 
      };
    });

    const batchResults = await Promise.all(promises);
    
    batchResults.forEach((result) => {
      if (result.success) {
        results.success++;
      } else {
        results.failed++;
        results.errors.push({ 
          email: result.email, 
          error: result.error || "Failed after retries" 
        });
      }
    });

    if (i + BATCH_SIZE < registrations.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // Log summary
  console.log(`📊 Postponement email summary:
  ✅ Success: ${results.success}
  ❌ Failed: ${results.failed}
  ${results.errors.length > 0 ? `⚠️ Errors: ${results.errors.map(e => `${e.email}: ${e.error}`).join(', ')}` : ''}
  `);

  return results;
}

function buildPostponementHtml(reg: Registration): string {
  const firstName = reg.fullName.split(" ")[0];
  const track = TRACK_COLORS[reg.track];

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>CSCON 5.0 — Event Postponement</title>
</head>
<body style="margin:0; padding:0; background-color:#050505; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#050505; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 480px;">

          <!-- Preheader -->
          <tr>
            <td style="color:#ffaa00; font-size:11px; font-weight:700; letter-spacing:3px; text-transform:uppercase; padding-bottom:14px; text-align:center;">
              Important Update — ${escapeHtml(firstName)}
            </td>
          </tr>

          <!-- Postponement card -->
          <tr>
            <td style="background:#0c0c0c; border:1px solid rgba(255,170,0,0.3); border-radius:20px; overflow:hidden;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">

                <!-- Header strip -->
                <tr>
                  <td style="padding:32px 28px 16px 28px;" align="center">
                    <div style="font-size:48px; margin-bottom:8px;">📅</div>
                    <div style="font-size:22px; font-weight:900; color:#ffaa00; letter-spacing:-0.02em;">Event Postponed</div>
                    <div style="font-size:12px; color:rgba(255,255,255,0.4); font-weight:700; letter-spacing:2px; text-transform:uppercase; margin-top:6px;">
                      CSCON 5.0
                    </div>
                  </td>
                </tr>

                <!-- Perforation -->
                <tr>
                  <td style="padding:0 28px;">
                    <div style="border-top:1px dashed rgba(255,255,255,0.15);"></div>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:24px 28px 4px 28px;">
                    <p style="font-size:15px; color:rgba(255,255,255,0.75); line-height:1.7; margin:0;">
                      Dear ${escapeHtml(firstName)},
                    </p>
                    <p style="font-size:15px; color:rgba(255,255,255,0.65); line-height:1.7; margin:16px 0 0 0;">
                      We hope this message finds you well. We're writing to inform you that <strong style="color:#ffffff;">CSCON 5.0</strong> 
                      has been <span style="color:#ffaa00; font-weight:700;">postponed</span> due to circumstances beyond our control.
                    </p>
                    <p style="font-size:15px; color:rgba(255,255,255,0.65); line-height:1.7; margin:12px 0 0 0;">
                      We understand this is sudden, and we sincerely apologize for any inconvenience this may cause. 
                      Please know that this decision was not made lightly — it was a situation out of our hands.
                    </p>
                  </td>
                </tr>

                <!-- What this means box -->
                <tr>
                  <td style="padding:20px 28px 0 28px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,170,0,0.06); border-radius:10px; border:1px solid rgba(255,170,0,0.15);">
                      <tr>
                        <td style="padding:16px 20px;">
                          <div style="font-size:10px; color:#ffaa00; font-weight:700; letter-spacing:2px; text-transform:uppercase; margin-bottom:8px;">What This Means For You</div>
                          <div style="font-size:13px; color:rgba(255,255,255,0.7); line-height:1.8;">
                            ✅ Your registration remains <strong style="color:#39FF14;">fully valid</strong><br />
                            ✅ Your access code <strong style="color:#39FF14;">remains active</strong> and usable on the new date<br />
                            ✅ Your track allocation <strong style="color:#39FF14;">is unchanged</strong> (<span style="color:${track.accent};">${escapeHtml(reg.track)}</span>)<br />
                            ✅ We'll notify you immediately once the <strong style="color:#ffffff;">new date</strong> is confirmed
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Access code reminder -->
                <tr>
                  <td style="padding:20px 28px 0 28px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:rgba(57,255,20,0.04); border-radius:10px; border:1px solid rgba(57,255,20,0.12);">
                      <tr>
                        <td style="padding:14px 20px;" align="center">
                          <div style="font-size:10px; color:rgba(255,255,255,0.4); font-weight:700; letter-spacing:2px; text-transform:uppercase; margin-bottom:6px;">Your Access Code (Still Active)</div>
                          <div style="font-family: 'Courier New', monospace; font-size:20px; font-weight:800; letter-spacing:4px; color:#39FF14;">
                            ${escapeHtml(reg.accessCode)}
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Perforation -->
                <tr>
                  <td style="padding:20px 28px 0 28px;">
                    <div style="border-top:1px dashed rgba(255,255,255,0.15);"></div>
                  </td>
                </tr>

                <!-- Footer note -->
                <tr>
                  <td style="padding:22px 28px 28px 28px;">
                    <p style="font-size:13px; color:rgba(255,255,255,0.5); line-height:1.6; margin:0;">
                      We're working hard to confirm a new date as soon as possible. You'll hear from us with the updated details shortly.
                    </p>
                    <p style="font-size:13px; color:rgba(255,255,255,0.4); line-height:1.6; margin:12px 0 0 0;">
                      Thank you for your understanding and patience during this time. We can't wait to see you at CSCON 5.0!
                    </p>
                    <div style="margin-top:18px; padding-top:18px; border-top:1px solid rgba(255,255,255,0.06); text-align:center;">
                      <a href="mailto:cscon@nacos-oau.org" style="color:#39FF14; text-decoration:none; font-size:13px; font-weight:600;">
                        📧 Questions? Reach out to us
                      </a>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 12px 0 12px; text-align:center;">
              <p style="font-size:11px; color:rgba(255,255,255,0.2); margin-top:4px;">
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