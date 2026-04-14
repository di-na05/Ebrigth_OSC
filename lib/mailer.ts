import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true, // port 465 = SSL
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendClockInEmail(to: string, name: string, time: string): Promise<void> {
  await transporter.sendMail({
    from: `"Ebright Attendance" <${process.env.SMTP_USER}>`,
    to,
    subject: `✅ Clock-In Recorded — ${name}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px;">
        <div style="background:#1d4ed8;border-radius:8px;padding:16px 24px;margin-bottom:24px;">
          <h1 style="color:white;margin:0;font-size:20px;">Ebright Attendance</h1>
        </div>
        <p style="font-size:16px;color:#111827;">Hi <strong>${name}</strong>,</p>
        <p style="font-size:15px;color:#374151;">
          Your <strong style="color:#16a34a;">clock-in</strong> has been recorded.
        </p>
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin:20px 0;">
          <p style="margin:0;font-size:14px;color:#15803d;">
            🕐 <strong>Time:</strong> ${time}
          </p>
        </div>
        <p style="font-size:13px;color:#9ca3af;margin-top:24px;">
          This is an automated message from the Ebright HR System. Please do not reply.
        </p>
      </div>
    `,
  });
}

export async function sendClockOutEmail(to: string, name: string, time: string): Promise<void> {
  await transporter.sendMail({
    from: `"Ebright Attendance" <${process.env.SMTP_USER}>`,
    to,
    subject: `🔴 Clock-Out Recorded — ${name}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px;">
        <div style="background:#1d4ed8;border-radius:8px;padding:16px 24px;margin-bottom:24px;">
          <h1 style="color:white;margin:0;font-size:20px;">Ebright Attendance</h1>
        </div>
        <p style="font-size:16px;color:#111827;">Hi <strong>${name}</strong>,</p>
        <p style="font-size:15px;color:#374151;">
          Your <strong style="color:#dc2626;">clock-out</strong> has been recorded.
        </p>
        <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:16px;margin:20px 0;">
          <p style="margin:0;font-size:14px;color:#b91c1c;">
            🕐 <strong>Time:</strong> ${time}
          </p>
        </div>
        <p style="font-size:13px;color:#9ca3af;margin-top:24px;">
          This is an automated message from the Ebright HR System. Please do not reply.
        </p>
      </div>
    `,
  });
}
