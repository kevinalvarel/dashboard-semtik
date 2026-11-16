package attendance

import (
	"errors"
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

type mahasiswaItem struct {
	model.PesertaMahasiswa
	Type string `json:"type"`
}

type umkmItem struct {
	model.PesertaUMKM
	Type string `json:"type"`
}

func (h *Handler) List(c *gin.Context) {
	var mahasiswa []model.PesertaMahasiswa
	if err := h.db.Order("id ASC").Find(&mahasiswa).Error; err != nil {
		log.Printf("attendance: list mahasiswa failed: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Internal server error"})
		return
	}

	var umkm []model.PesertaUMKM
	if err := h.db.Order("id ASC").Find(&umkm).Error; err != nil {
		log.Printf("attendance: list umkm failed: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Internal server error"})
		return
	}

	participants := make([]any, 0, len(mahasiswa)+len(umkm))
	for _, p := range mahasiswa {
		participants = append(participants, mahasiswaItem{PesertaMahasiswa: p, Type: "mahasiswa"})
	}
	for _, p := range umkm {
		participants = append(participants, umkmItem{PesertaUMKM: p, Type: "umkm"})
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

type checkInInfo struct {
	table       string
	id          string
	nama        string
	detail      string
	isCheckedIn bool
	checkedInAt *time.Time
}

func (h *Handler) checkIn(token string) (int, gin.H) {
	var mahasiswa model.PesertaMahasiswa
	err := h.db.Where("qr_code = ?", token).First(&mahasiswa).Error
	if err == nil {
		return h.doCheckIn(checkInInfo{
			table:       "peserta_mahasiswa",
			id:          mahasiswa.ID,
			nama:        mahasiswa.Nama,
			detail:      " (NIM: " + mahasiswa.NIM + ")",
			isCheckedIn: mahasiswa.IsCheckedIn,
			checkedInAt: mahasiswa.CheckedInAt,
		}, &mahasiswa)
	}
	if !errors.Is(err, gorm.ErrRecordNotFound) {
		log.Printf("attendance: lookup mahasiswa failed: %v", err)
		return http.StatusInternalServerError, gin.H{"success": false, "message": "Terjadi kesalahan internal server saat memproses check-in"}
	}

	var umkm model.PesertaUMKM
	if err := h.db.Where("qr_code = ?", token).First(&umkm).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return http.StatusNotFound, gin.H{"success": false, "message": "Peserta tidak ditemukan atau QR Code tidak terdaftar"}
		}
		log.Printf("attendance: lookup umkm failed: %v", err)
		return http.StatusInternalServerError, gin.H{"success": false, "message": "Terjadi kesalahan internal server saat memproses check-in"}
	}

	return h.doCheckIn(checkInInfo{
		table:       "peserta_umkm",
		id:          umkm.ID,
		nama:        umkm.Nama,
		isCheckedIn: umkm.IsCheckedIn,
		checkedInAt: umkm.CheckedInAt,
	}, &umkm)
}

func (h *Handler) doCheckIn(info checkInInfo, data any) (int, gin.H) {
	if info.isCheckedIn {
		return http.StatusConflict, gin.H{
			"success": false,
			"message": fmt.Sprintf("Peserta %s%s sudah check-in pada %s", info.nama, info.detail, formatTime(info.checkedInAt)),
			"data":    data,
		}
	}

	now := time.Now()
	updated := h.db.Table(info.table).
		Where("id = ? AND is_checked_in = ?", info.id, false).
		Updates(map[string]any{"is_checked_in": true, "checked_in_at": now, "updated_at": now})
	if updated.Error != nil {
		log.Printf("attendance: update failed: %v", updated.Error)
		return http.StatusInternalServerError, gin.H{"success": false, "message": "Terjadi kesalahan internal server saat memproses check-in"}
	}
	if updated.RowsAffected == 0 {
		return http.StatusConflict, gin.H{"success": false, "message": "Peserta sudah check-in"}
	}

	if err := h.db.First(data, "id = ?", info.id).Error; err != nil {
		log.Printf("attendance: reload failed: %v", err)
	}

	return http.StatusOK, gin.H{
		"success": true,
		"message": fmt.Sprintf("Check-in berhasil untuk %s%s", info.nama, info.detail),
		"data":    data,
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
