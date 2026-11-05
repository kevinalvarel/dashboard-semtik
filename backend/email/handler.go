package email

import (
	"context"
	"fmt"
	"html"
	"log"
	"net/http"
	"net/url"
	"regexp"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"semtik.id/backend/model"
)

const (
	onboardingFrom = "SEMTIK Admin <onboarding@resend.dev>"
	emailSubject   = "QR Code Presensi SEMTIK"
)

type Handler struct {
	db     *gorm.DB
	client *Client
}

func NewHandler(db *gorm.DB, client *Client) *Handler {
	return &Handler{db: db, client: client}
}

func (h *Handler) Send(c *gin.Context) {
	if h.client.APIKey == "" {
		fail(c, http.StatusInternalServerError, "RESEND_API_KEY is not configured in worker environment")
		return
	}

	var body struct {
		Email  string `json:"email"`
		QRCode string `json:"qrCode"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		fail(c, http.StatusBadRequest, "Invalid request body")
		return
	}

	to := strings.TrimSpace(body.Email)
	qrCode := strings.TrimSpace(body.QRCode)
	if to == "" || qrCode == "" {
		fail(c, http.StatusBadRequest, "Email and qrCode are required")
		return
	}

	var peserta model.Peserta
	if err := h.db.Where("email = ?", to).First(&peserta).Error; err != nil && err != gorm.ErrRecordNotFound {
		fail(c, http.StatusInternalServerError, "Internal server error")
		return
	}
	nama := peserta.Nama
	if nama == "" {
		nama = "Peserta"
	}

	mail := Email{
		From:    h.client.From,
		To:      []string{to},
		Subject: emailSubject,
		HTML:    qrEmailHTML(nama, qrCode),
	}

	result, apiErr := h.sendSingle(c.Request.Context(), mail)
	if apiErr == nil {
		h.markSent([]string{to})
		c.JSON(http.StatusOK, gin.H{"success": true, "message": "Email sent successfully", "data": result})
		return
	}

	if isSandboxError(apiErr) {
		owner := sandboxOwner(apiErr.Message)
		if owner != "" {
			retryResult, retryErr := h.client.Send(c.Request.Context(), Email{
				From:    onboardingFrom,
				To:      []string{owner},
				Subject: fmt.Sprintf("[Sandbox for %s] %s", to, emailSubject),
				HTML:    sandboxBannerHTML(to) + mail.HTML,
			})
			if retryErr == nil {
				h.markSent([]string{to})
				c.JSON(http.StatusOK, gin.H{
					"success": true,
					"message": fmt.Sprintf("Email dialihkan ke owner sandbox (%s) karena batasan Resend.", owner),
					"data":    retryResult,
				})
				return
			}
		}

		h.markSent([]string{to})
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"message": fmt.Sprintf("Email disimulasikan terkirim ke %s (Sandbox Mode).", to),
		})
		return
	}

	c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to send email", "error": apiErr})
}

func (h *Handler) SendAll(c *gin.Context) {
	if h.client.APIKey == "" {
		fail(c, http.StatusInternalServerError, "RESEND_API_KEY is not configured in worker environment")
		return
	}

	var participants []model.Peserta
	if err := h.db.Where("is_email_sent = ?", false).Find(&participants).Error; err != nil {
		fail(c, http.StatusInternalServerError, "Internal server error")
		return
	}
	if len(participants) == 0 {
		c.JSON(http.StatusOK, gin.H{"success": true, "message": "Semua peserta sudah menerima email."})
		return
	}

	mails := make([]Email, len(participants))
	emails := make([]string, len(participants))
	for i, p := range participants {
		mails[i] = Email{
			From:    h.client.From,
			To:      []string{p.Email},
			Subject: emailSubject,
			HTML:    qrEmailHTML(p.Nama, p.QRCode),
		}
		emails[i] = p.Email
	}

	result, apiErr := h.sendBatch(c.Request.Context(), mails)
	if apiErr == nil {
		h.markSent(emails)
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"message": fmt.Sprintf("Emails sent successfully to %d participants", len(participants)),
			"data":    result,
		})
		return
	}

	if isSandboxError(apiErr) {
		owner := sandboxOwner(apiErr.Message)
		if owner != "" {
			retryResult, retryErr := h.client.Send(c.Request.Context(), Email{
				From:    onboardingFrom,
				To:      []string{owner},
				Subject: fmt.Sprintf("[Sandbox Batch] %s (%d Peserta)", emailSubject, len(participants)),
				HTML:    batchSandboxHTML(participants),
			})
			if retryErr == nil {
				h.markSent(emails)
				c.JSON(http.StatusOK, gin.H{
					"success": true,
					"message": fmt.Sprintf("Email batch dialihkan ke owner sandbox (%s) untuk %d peserta.", owner, len(participants)),
					"data":    retryResult,
				})
				return
			}
		}

		h.markSent(emails)
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"message": fmt.Sprintf("Email batch disimulasikan terkirim ke %d peserta (Sandbox Mode).", len(participants)),
		})
		return
	}

	c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to send batch emails", "error": apiErr})
}

func (h *Handler) sendSingle(ctx context.Context, mail Email) (*Result, *APIError) {
	result, apiErr := h.client.Send(ctx, mail)
	if apiErr != nil && isDomainError(apiErr) && mail.From != onboardingFrom {
		retry := mail
		retry.From = onboardingFrom
		return h.client.Send(ctx, retry)
	}
	return result, apiErr
}

func (h *Handler) sendBatch(ctx context.Context, mails []Email) (*BatchResult, *APIError) {
	result, apiErr := h.client.SendBatch(ctx, mails)
	if apiErr != nil && isDomainError(apiErr) && len(mails) > 0 && mails[0].From != onboardingFrom {
		retry := make([]Email, len(mails))
		copy(retry, mails)
		for i := range retry {
			retry[i].From = onboardingFrom
		}
		return h.client.SendBatch(ctx, retry)
	}
	return result, apiErr
}

func (h *Handler) markSent(emails []string) {
	if len(emails) == 0 {
		return
	}
	now := time.Now()
	if err := h.db.Model(&model.Peserta{}).
		Where("email IN ?", emails).
		Updates(map[string]any{"is_email_sent": true, "email_sent_at": now}).Error; err != nil {
		log.Printf("email: failed to update sent status: %v", err)
	}
}

func isDomainError(apiErr *APIError) bool {
	message := strings.ToLower(apiErr.Message)
	return strings.Contains(message, "domain") || strings.Contains(message, "not verified")
}

func isSandboxError(apiErr *APIError) bool {
	return apiErr.Name == "validation_error" && strings.Contains(apiErr.Message, "own email address")
}

var ownerPattern = regexp.MustCompile(`\(([^)]+)\)`)

func sandboxOwner(message string) string {
	match := ownerPattern.FindStringSubmatch(message)
	if len(match) < 2 {
		return ""
	}
	owner := strings.TrimSpace(match[1])
	if !strings.Contains(owner, "@") {
		return ""
	}
	return owner
}

func qrImageURL(qrCode string) string {
	return "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=" + url.QueryEscape(qrCode)
}

func qrEmailHTML(nama, qrCode string) string {
	imageURL := qrImageURL(qrCode)
	nama = html.EscapeString(nama)
	qrCode = html.EscapeString(qrCode)
	return fmt.Sprintf(`
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; background: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #1a1a2e; margin: 0 0 8px;">Halo %s, Selamat Datang di SEMTIK!</h2>
          <p style="color: #6b7280; font-size: 14px; margin: 0;">Berikut adalah QR Code Anda untuk keperluan presensi (Check-in).</p>
        </div>
        <div style="text-align: center; padding: 24px; background: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb;">
          <img src="%s" alt="QR Code Presensi" width="200" height="200" style="display: block; margin: 0 auto 16px;" />
          <p style="font-size: 13px; font-weight: 600; color: #374151; background: #e5e7eb; padding: 8px 16px; display: inline-block; border-radius: 6px; font-family: monospace; letter-spacing: 1px;">
            %s
          </p>
        </div>
        <p style="text-align: center; color: #6b7280; font-size: 13px; margin-top: 20px;">
          Tunjukkan QR Code ini kepada panitia atau scan melalui sistem presensi kami.
        </p>
      </div>
    `, nama, imageURL, qrCode)
}

func sandboxBannerHTML(email string) string {
	return fmt.Sprintf(`
              <div style="background: #fffbeb; border: 1px solid #fef3c7; padding: 12px; border-radius: 8px; margin-bottom: 20px; font-family: sans-serif; font-size: 13px; color: #92400e;">
                <strong>Sandbox Redirect:</strong> Email ini aslinya ditujukan untuk <strong>%s</strong>, namun dialihkan ke email terverifikasi Anda untuk keperluan testing.
              </div>
              `, html.EscapeString(email))
}

func batchSandboxHTML(participants []model.Peserta) string {
	var list strings.Builder
	for _, p := range participants {
		fmt.Fprintf(&list, "<li>%s (%s) - Code: %s</li>", html.EscapeString(p.Nama), html.EscapeString(p.Email), html.EscapeString(p.QRCode))
	}
	return fmt.Sprintf(`
              <div style="background: #fffbeb; border: 1px solid #fef3c7; padding: 12px; border-radius: 8px; margin-bottom: 20px; font-family: sans-serif; font-size: 13px; color: #92400e;">
                <strong>Sandbox Redirect:</strong> Email batch ini dialihkan ke email terverifikasi Anda untuk keperluan testing. Aslinya ditujukan untuk %d peserta berikut:
              </div>
              <div style="font-family: sans-serif; font-size: 14px;">
                <h3>Daftar Penerima:</h3>
                <ul>%s</ul>
                <p>Silakan lihat profil masing-masing peserta di dashboard untuk melakukan scan QR Code.</p>
              </div>
    `, len(participants), list.String())
}

func fail(c *gin.Context, status int, message string) {
	c.JSON(status, gin.H{"success": false, "message": message})
}
