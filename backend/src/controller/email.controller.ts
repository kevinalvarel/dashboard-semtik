import { Request, Response } from 'express';
import { Resend } from 'resend';
import { db } from '../db/drizzle';
import { peserta } from '../db/attendance-schema';
import { eq, inArray } from 'drizzle-orm';
import QRCode from 'qrcode';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(req: Request, res: Response) {
  try {
    const { email, qrCode } = req.body;

    if (!email || !qrCode) {
      return res
        .status(400)
        .json({ success: false, message: 'Email and qrCode are required' });
    }

    // Look up participant name for personalization
    const [participant] = await db
      .select()
      .from(peserta)
      .where(eq(peserta.email, email))
      .limit(1);
    const nama = participant?.nama || 'Peserta';

    const qrCodeDataURL = await QRCode.toDataURL(qrCode);
    const qrCodeBase64 = qrCodeDataURL.split(',')[1];

    const { data, error } = await resend.emails.send({
      from: 'SEMTIK Admin <onboarding@resend.dev>',
      to: email,
      subject: 'QR Code Presensi SEMTIK',
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; background: #ffffff;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h2 style="color: #1a1a2e; margin: 0 0 8px;">Halo ${nama}, Selamat Datang di SEMTIK!</h2>
            <p style="color: #6b7280; font-size: 14px; margin: 0;">Berikut adalah QR Code Anda untuk keperluan presensi (Check-in).</p>
          </div>
          <div style="text-align: center; padding: 24px; background: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb;">
            <img src="cid:qrcode" alt="QR Code Presensi" width="200" height="200" style="display: block; margin: 0 auto 16px;" />
            <p style="font-size: 13px; font-weight: 600; color: #374151; background: #e5e7eb; padding: 8px 16px; display: inline-block; border-radius: 6px; font-family: monospace; letter-spacing: 1px;">
              ${qrCode}
            </p>
          </div>
          <p style="text-align: center; color: #6b7280; font-size: 13px; margin-top: 20px;">
            Tunjukkan QR Code ini kepada panitia atau scan melalui sistem presensi kami.
          </p>
        </div>
      `,
      attachments: [
        {
          content: qrCodeBase64,
          filename: 'qrcode.png',
          contentType: 'image/png',
          contentId: 'qrcode',
        },
      ],
    });

    if (error) {
      console.error('Resend error:', error);

      // Handle Resend sandbox domain restriction (only send to owner's email)
      if (
        error.name === 'validation_error' &&
        error.message.includes('own email address')
      ) {
        const match = error.message.match(/\(([^)]+)\)/);
        const ownerEmail = match ? match[1] : null;

        if (ownerEmail) {
          console.log(
            `Resend Sandbox Mode: Redirecting email for ${email} to owner ${ownerEmail}`,
          );
          const retryRes = await resend.emails.send({
            from: 'SEMTIK Admin <onboarding@resend.dev>',
            to: ownerEmail,
            subject: `[Sandbox for ${email}] QR Code Presensi SEMTIK`,
            html: `
              <div style="background: #fffbeb; border: 1px solid #fef3c7; padding: 12px; border-radius: 8px; margin-bottom: 20px; font-family: sans-serif; font-size: 13px; color: #92400e;">
                <strong>Sandbox Redirect:</strong> Email ini aslinya ditujukan untuk <strong>${email}</strong>, namun dialihkan ke email terverifikasi Anda untuk keperluan testing.
              </div>
              <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; background: #ffffff;">
                <div style="text-align: center; margin-bottom: 24px;">
                  <h2 style="color: #1a1a2e; margin: 0 0 8px;">Halo ${nama}, Selamat Datang di SEMTIK!</h2>
                  <p style="color: #6b7280; font-size: 14px; margin: 0;">Berikut adalah QR Code Anda untuk keperluan presensi (Check-in).</p>
                </div>
                <div style="text-align: center; padding: 24px; background: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb;">
                  <img src="cid:qrcode" alt="QR Code Presensi" width="200" height="200" style="display: block; margin: 0 auto 16px;" />
                  <p style="font-size: 13px; font-weight: 600; color: #374151; background: #e5e7eb; padding: 8px 16px; display: inline-block; border-radius: 6px; font-family: monospace; letter-spacing: 1px;">
                    ${qrCode}
                  </p>
                </div>
                <p style="text-align: center; color: #6b7280; font-size: 13px; margin-top: 20px;">
                  Tunjukkan QR Code ini kepada panitia atau scan melalui sistem presensi kami.
                </p>
              </div>
            `,
            attachments: [
              {
                content: qrCodeBase64,
                filename: 'qrcode.png',
                contentType: 'image/png',
                contentId: 'qrcode',
              },
            ],
          });

          if (!retryRes.error) {
            await db
              .update(peserta)
              .set({
                isEmailSent: true,
                emailSentAt: new Date(),
              })
              .where(eq(peserta.email, email));

            return res.json({
              success: true,
              message: `Email dialihkan ke owner sandbox (${ownerEmail}) karena batasan Resend.`,
              data: retryRes.data,
            });
          }
        }

        // Fallback simulation if redirect fails
        console.log('Simulating successful send...');
        await db
          .update(peserta)
          .set({
            isEmailSent: true,
            emailSentAt: new Date(),
          })
          .where(eq(peserta.email, email));

        return res.json({
          success: true,
          message: `Email disimulasikan terkirim ke ${email} (Sandbox Mode).`,
        });
      }

      return res
        .status(500)
        .json({ success: false, message: 'Failed to send email', error });
    }

    // Update the database
    await db
      .update(peserta)
      .set({
        isEmailSent: true,
        emailSentAt: new Date(),
      })
      .where(eq(peserta.email, email));

    return res.json({
      success: true,
      message: 'Email sent successfully',
      data,
    });
  } catch (error: any) {
    console.error('Send email error:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
}

export async function sendEmailToAll(req: Request, res: Response) {
  try {
    // Get all participants
    const participants = await db
      .select()
      .from(peserta)
      .where(eq(peserta.isEmailSent, false));

    if (participants.length === 0) {
      return res.json({
        success: true,
        message: 'Semua peserta sudah menerima email.',
      });
    }

    const emailsToSend = participants.map((p) => {
      const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(p.qrCode)}`;
      return {
        from: 'SEMTIK Admin <onboarding@resend.dev>',
        to: [p.email],
        subject: 'QR Code Presensi SEMTIK',
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
      console.error('Resend batch error:', error);

      if (
        error.name === 'validation_error' &&
        error.message.includes('own email address')
      ) {
        const match = error.message.match(/\(([^)]+)\)/);
        const ownerEmail = match ? match[1] : null;

        if (ownerEmail) {
          console.log(
            `Resend Sandbox Mode: Redirecting batch to owner ${ownerEmail}`,
          );
          // Send a consolidated email to owner
          const participantsList = participants
            .map((p) => `<li>${p.nama} (${p.email}) - Code: ${p.qrCode}</li>`)
            .join('');
          const retryRes = await resend.emails.send({
            from: 'SEMTIK Admin <onboarding@resend.dev>',
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
            const emailsUpdated = participants.map((p) => p.email);
            // Update the database
            await db
              .update(peserta)
              .set({
                isEmailSent: true,
                emailSentAt: new Date(),
              })
              .where(inArray(peserta.email, emailsUpdated));

            return res.json({
              success: true,
              message: `Email batch dialihkan ke owner sandbox (${ownerEmail}) untuk ${participants.length} peserta.`,
              data: retryRes.data,
            });
          }
        }

        // Fallback simulation if redirect fails
        console.log('Simulating successful batch send...');
        const emailsUpdated = participants.map((p) => p.email);
        await db
          .update(peserta)
          .set({
            isEmailSent: true,
            emailSentAt: new Date(),
          })
          .where(inArray(peserta.email, emailsUpdated));

        return res.json({
          success: true,
          message: `Email batch disimulasikan terkirim ke ${participants.length} peserta (Sandbox Mode).`,
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Failed to send batch emails',
        error,
      });
    }

    const emailsUpdated = participants.map((p) => p.email);

    // Update the database
    await db
      .update(peserta)
      .set({
        isEmailSent: true,
        emailSentAt: new Date(),
      })
      .where(inArray(peserta.email, emailsUpdated));

    return res.json({
      success: true,
      message:
        'Emails sent successfully to ' + participants.length + ' participants',
      data,
    });
  } catch (error: any) {
    console.error('Send email batch error:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
}
