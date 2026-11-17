package email

import (
	"errors"
	"fmt"
	"html"
	"log"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/resend/resend-go/v4"
	"gorm.io/gorm"

	"semtik.id/backend/model"
)

const (
	defaultFrom  = "SEMTIK Admin <admin@semtik.id>"
	emailSubject = "QR Code Presensi SEMTIK"
	batchLimit   = 100
)

type Handler struct {
	db     *gorm.DB
	client *resend.Client
	from   string
}

func NewHandler(db *gorm.DB, client *resend.Client, from string) *Handler {
	if from == "" {
		from = defaultFrom
	}
	return &Handler{
		db:     db,
		client: client,
		from:   from,
	}
}

func NewClient(apiKey string) *resend.Client {
	return resend.NewClient(apiKey)
}

type recipient struct {
	Nama   string
	Email  string
	QRCode string
}

func (h *Handler) participantName(email string) (string, error) {
	var mahasiswa model.PesertaMahasiswa
	err := h.db.Where("email = ?", email).First(&mahasiswa).Error
	if err == nil {
		return mahasiswa.Nama, nil
	}
	if !errors.Is(err, gorm.ErrRecordNotFound) {
		return "", err
	}

	var umkm model.PesertaUMKM
	err = h.db.Where("email = ?", email).First(&umkm).Error
	if err == nil {
		return umkm.Nama, nil
	}
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return "", nil
	}
	return "", err
}

func (h *Handler) participants() ([]recipient, error) {
	var mahasiswa []model.PesertaMahasiswa
	if err := h.db.Where("is_email_sent = ?", false).Find(&mahasiswa).Error; err != nil {
		return nil, err
	}

	participants := make([]recipient, 0, len(mahasiswa))
	for _, p := range mahasiswa {
		participants = append(participants, recipient{Nama: p.Nama, Email: p.Email, QRCode: p.QRCode})
	}
	return participants, nil
}

func (h *Handler) Send(c *gin.Context) {
	if h.client == nil || h.client.ApiKey == "" {
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

	nama, err := h.participantName(to)
	if err != nil {
		fail(c, http.StatusInternalServerError, "Internal server error")
		return
	}
	if nama == "" {
		nama = "Peserta"
	}

	params := &resend.SendEmailRequest{
		From:    h.from,
		To:      []string{to},
		Subject: emailSubject,
		Html:    qrEmailHTML(nama, qrCode),
	}

	sent, err := h.client.Emails.SendWithContext(c.Request.Context(), params)
	if err != nil {
		log.Printf("email: failed to send email to %s: %v", to, err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": fmt.Sprintf("Gagal mengirim email: %v", err),
		})
		return
	}

	h.markSent([]string{to})
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Email sent successfully",
		"data":    sent,
	})
}

func (h *Handler) SendAll(c *gin.Context) {
	if h.client == nil || h.client.ApiKey == "" {
		fail(c, http.StatusInternalServerError, "RESEND_API_KEY is not configured in worker environment")
		return
	}

	participants, err := h.participants()
	if err != nil {
		fail(c, http.StatusInternalServerError, "Internal server error")
		return
	}
	if len(participants) == 0 {
		c.JSON(http.StatusOK, gin.H{"success": true, "message": "Semua peserta sudah menerima email."})
		return
	}

	var allResponses []resend.SendEmailResponse
	sentEmails := make([]string, 0, len(participants))

	for start := 0; start < len(participants); start += batchLimit {
		end := min(start+batchLimit, len(participants))
		chunk := participants[start:end]

		batchParams := make([]*resend.SendEmailRequest, len(chunk))
		chunkEmails := make([]string, len(chunk))
		for i, p := range chunk {
			batchParams[i] = &resend.SendEmailRequest{
				From:    h.from,
				To:      []string{p.Email},
				Subject: emailSubject,
				Html:    qrEmailHTML(p.Nama, p.QRCode),
			}
			chunkEmails[i] = p.Email
		}

		batchResp, err := h.client.Batch.SendWithContext(c.Request.Context(), batchParams)
		if err != nil {
			log.Printf("email: batch send failed at chunk %d-%d: %v", start, end, err)
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"message": fmt.Sprintf("Gagal mengirim email batch: %v", err),
			})
			return
		}

		h.markSent(chunkEmails)
		allResponses = append(allResponses, batchResp.Data...)
		sentEmails = append(sentEmails, chunkEmails...)
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": fmt.Sprintf("Emails sent successfully to %d participants", len(sentEmails)),
		"data":    allResponses,
	})
}

func (h *Handler) markSent(emails []string) {
	if len(emails) == 0 {
		return
	}
	now := time.Now()
	if err := h.db.Model(&model.PesertaMahasiswa{}).
		Where("email IN ?", emails).
		Updates(map[string]any{"is_email_sent": true, "email_sent_at": now}).Error; err != nil {
		log.Printf("email: failed to update sent status: %v", err)
	}
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

func fail(c *gin.Context, status int, message string) {
	c.JSON(status, gin.H{"success": false, "message": message})
}
