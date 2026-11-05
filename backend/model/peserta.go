package model

import "time"

type Peserta struct {
	ID          string     `gorm:"column:id;primaryKey" json:"id"`
	NIM         string     `gorm:"column:nim" json:"nim"`
	Nama        string     `gorm:"column:nama" json:"nama"`
	Email       string     `gorm:"column:email" json:"email"`
	Fakultas    string     `gorm:"column:fakultas" json:"fakultas"`
	Prodi       string     `gorm:"column:prodi" json:"prodi"`
	QRCode      string     `gorm:"column:qr_code" json:"qrCode"`
	IsCheckedIn bool       `gorm:"column:is_checked_in" json:"isCheckedIn"`
	CheckedInAt *time.Time `gorm:"column:checked_in_at" json:"checkedInAt"`
	IsEmailSent bool       `gorm:"column:is_email_sent" json:"isEmailSent"`
	EmailSentAt *time.Time `gorm:"column:email_sent_at" json:"emailSentAt"`
	CreatedAt   *time.Time `gorm:"column:created_at" json:"createdAt"`
	UpdatedAt   *time.Time `gorm:"column:updated_at" json:"updatedAt"`
}

func (Peserta) TableName() string { return "peserta_semtik" }
