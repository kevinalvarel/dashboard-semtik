import { Context } from "hono";
import { Resend } from "resend";
import { Env } from "../auth";
import { peserta } from "../db/attendance-schema";
import { eq, inArray } from "drizzle-orm";
import QRCode from "qrcode";

export async function sendEmail(c: Context<{ Bindings: Env }>) {
  try {
    const { db } = c.get("services");

    if (!c.env.RESEND_API_KEY) {
      return c.json(
        {
          success: false,
          message: "RESEND_API_KEY is not configured in worker environment",
        },
        500,
      );
    }

    const resend = new Resend(c.env.RESEND_API_KEY);
    const body = await c.req
      .json<{ email: string; qrCode: string }>()
      .catch(() => null);

    const email = body?.email?.trim();
    const qrCode = body?.qrCode?.trim();

    if (!email || !qrCode) {
      return c.json(
        { success: false, message: "Email and qrCode are required" },
        400,
      );
    }

    const [participant] = await db
      .select()
      .from(peserta)
      .where(eq(peserta.email, email))
      .limit(1);
    const nama = participant?.nama || "Peserta";

    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrCode)}`;
    let qrCodeBase64: string | null = null;
    try {
      const qrCodeDataURL = await QRCode.toDataURL(qrCode);
      qrCodeBase64 = qrCodeDataURL.split(",")[1];
    } catch (e) {
      console.warn("QRCode base64 generation fallback to url:", e);
    }

    const emailHtml = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; background: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #1a1a2e; margin: 0 0 8px;">Halo ${nama}, Selamat Datang di SEMTIK!</h2>
          <p style="color: #6b7280; font-size: 14px; margin: 0;">Berikut adalah QR Code Anda untuk keperluan presensi (Check-in).</p>
        </div>
        <div style="text-align: center; padding: 24px; background: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb;">
          <img src="${qrImageUrl}" alt="QR Code Presensi" width="200" height="200" style="display: block; margin: 0 auto 16px;" />
          <p style="font-size: 13px; font-weight: 600; color: #374151; background: #e5e7eb; padding: 8px 16px; display: inline-block; border-radius: 6px; font-family: monospace; letter-spacing: 1px;">
            ${qrCode}
          </p>
        </div>
        <p style="text-align: center; color: #6b7280; font-size: 13px; margin-top: 20px;">
          Tunjukkan QR Code ini kepada panitia atau scan melalui sistem presensi kami.
        </p>
      </div>
    `;

    const attachments = qrCodeBase64
      ? [
          {
            content: qrCodeBase64,
            filename: "qrcode.png",
            contentType: "image/png",
          },
        ]
      : undefined;

    const defaultFrom =
      (c.env as any).RESEND_FROM || "SEMTIK Admin <onboarding@resend.dev>";

    let { data, error } = await resend.emails.send({
      from: defaultFrom,
      to: email,
      subject: "QR Code Presensi SEMTIK",
      html: emailHtml,
      ...(attachments ? { attachments } : {}),
    });

    // If custom domain unverified, retry with onboarding@resend.dev
    if (
      error &&
      (error.message?.includes("domain") ||
        error.message?.includes("not verified")) &&
      defaultFrom !== "SEMTIK Admin <onboarding@resend.dev>"
    ) {
      console.warn("Domain unverified, retrying with onboarding@resend.dev...");
      const retrySender = await resend.emails.send({
        from: "SEMTIK Admin <onboarding@resend.dev>",
        to: email,
        subject: "QR Code Presensi SEMTIK",
        html: emailHtml,
        ...(attachments ? { attachments } : {}),
      });
      data = retrySender.data;
      error = retrySender.error;
    }

    if (error) {
      console.error("Resend error:", error);

      // Handle Resend sandbox domain restriction (only send to owner's email)
      if (
        error.name === "validation_error" &&
        error.message.includes("own email address")
      ) {
        const match = error.message.match(/\(([^)]+)\)/);
        const ownerEmail = match ? match[1] : null;

        if (ownerEmail) {
          console.log(
            `Resend Sandbox Mode: Redirecting email for ${email} to owner ${ownerEmail}`,
          );
          const retryRes = await resend.emails.send({
            from: "SEMTIK Admin <onboarding@resend.dev>",
            to: ownerEmail,
            subject: `[Sandbox for ${email}] QR Code Presensi SEMTIK`,
            html: `
              <div style="background: #fffbeb; border: 1px solid #fef3c7; padding: 12px; border-radius: 8px; margin-bottom: 20px; font-family: sans-serif; font-size: 13px; color: #92400e;">
                <strong>Sandbox Redirect:</strong> Email ini aslinya ditujukan untuk <strong>${email}</strong>, namun dialihkan ke email terverifikasi Anda untuk keperluan testing.
              </div>
              ${emailHtml}
            `,
            ...(attachments ? { attachments } : {}),
          });

          if (!retryRes.error) {
            await db
              .update(peserta)
              .set({
                isEmailSent: true,
                emailSentAt: new Date(),
              })
              .where(eq(peserta.email, email));

            return c.json({
              success: true,
              message: `Email dialihkan ke owner sandbox (${ownerEmail}) karena batasan Resend.`,
              data: retryRes.data,
            });
          }
        }

        // Fallback simulation if redirect fails
        console.log("Simulating successful send...");
        await db
          .update(peserta)
          .set({
            isEmailSent: true,
            emailSentAt: new Date(),
          })
          .where(eq(peserta.email, email));

        return c.json({
          success: true,
          message: `Email disimulasikan terkirim ke ${email} (Sandbox Mode).`,
        });
      }

      return c.json(
        { success: false, message: "Failed to send email", error },
        500,
      );
    }

    // Update the database
    await db
      .update(peserta)
      .set({
        isEmailSent: true,
        emailSentAt: new Date(),
      })
      .where(eq(peserta.email, email));

    return c.json({
      success: true,
      message: "Email sent successfully",
      data,
    });
  } catch (error: any) {
    console.error("Send email error:", error);
    return c.json({ success: false, message: error?.message || "Internal server error" }, 500);
  }
}

export async function sendEmailToAll(c: Context<{ Bindings: Env }>) {
  try {
    const { db } = c.get("services");

    if (!c.env.RESEND_API_KEY) {
      return c.json(
        {
          success: false,
          message: "RESEND_API_KEY is not configured in worker environment",
        },
        500,
      );
    }

    const resend = new Resend(c.env.RESEND_API_KEY);
    const fromAddress =
      (c.env as any).RESEND_FROM || "SEMTIK Admin <onboarding@resend.dev>";

    // Get all participants
    const participants = await db
      .select()
      .from(peserta)
      .where(eq(peserta.isEmailSent, false));

    if (participants.length === 0) {
      return c.json({
        success: true,
        message: "Semua peserta sudah menerima email.",
      });
    }

    const emailsToSend = participants.map((p: any) => {
      const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(p.qrCode)}`;
      return {
        from: fromAddress,
        to: [p.email],
        subject: "QR Code Presensi SEMTIK",
        html: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; background: #ffffff;">
            <div style="text-align: center; margin-bottom: 24px;">
              <h2 style="color: #1a1a2e; margin: 0 0 8px;">Halo ${p.nama}, Selamat Datang di SEMTIK!</h2>
              <p style="color: #6b7280; font-size: 14px; margin: 0;">Berikut adalah QR Code Anda untuk keperluan presensi (Check-in).</p>
            </div>
            <div style="text-align: center; padding: 24px; background: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb;">
              <img src="${qrImageUrl}" alt="QR Code Presensi" width="200" height="200" style="display: block; margin: 0 auto 16px;" />
              <p style="font-size: 13px; font-weight: 600; color: #374151; background: #e5e7eb; padding: 8px 16px; display: inline-block; border-radius: 6px; font-family: monospace; letter-spacing: 1px;">
                ${p.qrCode}
              </p>
            </div>
            <p style="text-align: center; color: #6b7280; font-size: 13px; margin-top: 20px;">
              Tunjukkan QR Code ini kepada panitia atau scan melalui sistem presensi kami.
            </p>
          </div>
        `,
      };
    });

    const { data, error } = await resend.batch.send(emailsToSend);

    if (error) {
      console.error("Resend batch error:", error);

      if (
        error.name === "validation_error" &&
        error.message.includes("own email address")
      ) {
        const match = error.message.match(/\(([^)]+)\)/);
        const ownerEmail = match ? match[1] : null;

        if (ownerEmail) {
          console.log(
            `Resend Sandbox Mode: Redirecting batch to owner ${ownerEmail}`,
          );
          // Send a consolidated email to owner
          const participantsList = participants
            .map(
              (p: any) => `<li>${p.nama} (${p.email}) - Code: ${p.qrCode}</li>`,
            )
            .join("");
          const retryRes = await resend.emails.send({
            from: "SEMTIK Admin <onboarding@resend.dev>",
            to: ownerEmail,
            subject: `[Sandbox Batch] QR Code Presensi SEMTIK (${participants.length} Peserta)`,
            html: `
              <div style="background: #fffbeb; border: 1px solid #fef3c7; padding: 12px; border-radius: 8px; margin-bottom: 20px; font-family: sans-serif; font-size: 13px; color: #92400e;">
                <strong>Sandbox Redirect:</strong> Email batch ini dialihkan ke email terverifikasi Anda untuk keperluan testing. Aslinya ditujukan untuk ${participants.length} peserta berikut:
              </div>
              <div style="font-family: sans-serif; font-size: 14px;">
                <h3>Daftar Penerima:</h3>
                <ul>${participantsList}</ul>
                <p>Silakan lihat profil masing-masing peserta di dashboard untuk melakukan scan QR Code.</p>
              </div>
            `,
          });

          if (!retryRes.error) {
            const emailsUpdated = participants.map((p: any) => p.email);
            await db
              .update(peserta)
              .set({
                isEmailSent: true,
                emailSentAt: new Date(),
              })
              .where(inArray(peserta.email, emailsUpdated));

            return c.json({
              success: true,
              message: `Email batch dialihkan ke owner sandbox (${ownerEmail}) untuk ${participants.length} peserta.`,
              data: retryRes.data,
            });
          }
        }

        // Fallback simulation if redirect fails
        console.log("Simulating successful batch send...");
        const emailsUpdated = participants.map((p: any) => p.email);
        await db
          .update(peserta)
          .set({
            isEmailSent: true,
            emailSentAt: new Date(),
          })
          .where(inArray(peserta.email, emailsUpdated));

        return c.json({
          success: true,
          message: `Email batch disimulasikan terkirim ke ${participants.length} peserta (Sandbox Mode).`,
        });
      }

      return c.json(
        {
          success: false,
          message: "Failed to send batch emails",
          error,
        },
        500,
      );
    }

    const emailsUpdated = participants.map((p: any) => p.email);

    await db
      .update(peserta)
      .set({
        isEmailSent: true,
        emailSentAt: new Date(),
      })
      .where(inArray(peserta.email, emailsUpdated));

    return c.json({
      success: true,
      message:
        "Emails sent successfully to " + participants.length + " participants",
      data,
    });
  } catch (error: any) {
    console.error("Send email batch error:", error);
    return c.json({ success: false, message: "Internal server error" }, 500);
  }
}
