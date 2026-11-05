package attendance

import (
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"semtik.id/backend/model"
)

type Handler struct {
	db *gorm.DB
}

func NewHandler(db *gorm.DB) *Handler {
	return &Handler{db: db}
}

func (h *Handler) List(c *gin.Context) {
	var participants []model.Peserta
	if err := h.db.Order("id ASC").Find(&participants).Error; err != nil {
		log.Printf("attendance: list failed: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Internal server error"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "data": participants})
}

func (h *Handler) Scan(c *gin.Context) {
	var body struct {
		QRCode      string `json:"qrCode"`
		Token       string `json:"token"`
		QRCodeSnake string `json:"qr_code"`
		Code        string `json:"code"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "QR Code / Token tidak valid atau tidak boleh kosong"})
		return
	}

	token := strings.TrimSpace(firstNonEmpty(body.QRCode, body.Token, body.QRCodeSnake, body.Code))
	if token == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "QR Code / Token tidak valid atau tidak boleh kosong"})
		return
	}

	status, result := h.checkIn(token)
	c.JSON(status, result)
}

func (h *Handler) checkIn(token string) (int, gin.H) {
	var peserta model.Peserta
	if err := h.db.Where("qr_code = ?", token).First(&peserta).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return http.StatusNotFound, gin.H{"success": false, "message": "Peserta tidak ditemukan atau QR Code tidak terdaftar"}
		}
		log.Printf("attendance: lookup failed: %v", err)
		return http.StatusInternalServerError, gin.H{"success": false, "message": "Terjadi kesalahan internal server saat memproses check-in"}
	}

	if peserta.IsCheckedIn {
		return http.StatusConflict, gin.H{
			"success": false,
			"message": fmt.Sprintf("Peserta %s (NIM: %s) sudah check-in pada %s", peserta.Nama, peserta.NIM, formatTime(peserta.CheckedInAt)),
			"data":    peserta,
		}
	}

	now := time.Now()
	updated := h.db.Model(&model.Peserta{}).
		Where("id = ? AND is_checked_in = ?", peserta.ID, false).
		Updates(map[string]any{"is_checked_in": true, "checked_in_at": now, "updated_at": now})
	if updated.Error != nil {
		log.Printf("attendance: update failed: %v", updated.Error)
		return http.StatusInternalServerError, gin.H{"success": false, "message": "Terjadi kesalahan internal server saat memproses check-in"}
	}
	if updated.RowsAffected == 0 {
		if err := h.db.First(&peserta, "id = ?", peserta.ID).Error; err == nil && peserta.IsCheckedIn {
			return http.StatusConflict, gin.H{
				"success": false,
				"message": fmt.Sprintf("Peserta %s (NIM: %s) sudah check-in pada %s", peserta.Nama, peserta.NIM, formatTime(peserta.CheckedInAt)),
				"data":    peserta,
			}
		}
		return http.StatusConflict, gin.H{"success": false, "message": "Peserta sudah check-in"}
	}

	if err := h.db.First(&peserta, "id = ?", peserta.ID).Error; err != nil {
		log.Printf("attendance: reload failed: %v", err)
	}

	return http.StatusOK, gin.H{
		"success": true,
		"message": fmt.Sprintf("Check-in berhasil untuk %s (NIM: %s)", peserta.Nama, peserta.NIM),
		"data":    peserta,
	}
}

func firstNonEmpty(values ...string) string {
	for _, value := range values {
		if value != "" {
			return value
		}
	}
	return ""
}

func formatTime(value *time.Time) string {
	if value == nil {
		return "-"
	}
	return value.Format("02/01/2006 15:04:05")
}
