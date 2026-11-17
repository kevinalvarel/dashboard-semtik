package model

import "time"

type PesertaMahasiswa struct {
	ID             string     `gorm:"column:id;primaryKey" json:"id"`
	NIM            string     `gorm:"column:nim" json:"nim"`
	Nama           string     `gorm:"column:nama" json:"nama"`
	Email          string     `gorm:"column:email" json:"email"`
	Fakultas       string     `gorm:"column:fakultas" json:"fakultas"`
	Prodi          string     `gorm:"column:prodi" json:"prodi"`
	Universitas    string     `gorm:"column:universitas" json:"universitas"`
	QRCode         string     `gorm:"column:qr_code" json:"qrCode"`
	JenisKehadiran string     `gorm:"column:jenis_kehadiran" json:"jenisKehadiran"`
	IsCheckedIn    bool       `gorm:"column:is_checked_in" json:"isCheckedIn"`
	CheckedInAt    *time.Time `gorm:"column:checked_in_at" json:"checkedInAt"`
	IsEmailSent    bool       `gorm:"column:is_email_sent" json:"isEmailSent"`
	EmailSentAt    *time.Time `gorm:"column:email_sent_at" json:"emailSentAt"`
	CreatedAt      *time.Time `gorm:"column:created_at" json:"createdAt"`
	UpdatedAt      *time.Time `gorm:"column:updated_at" json:"updatedAt"`
}

func (PesertaMahasiswa) TableName() string { return "peserta_mahasiswa" }

type PesertaUMKM struct {
	ID             string     `gorm:"column:id;primaryKey" json:"id"`
	Nama           string     `gorm:"column:nama" json:"nama"`
	Email          string     `gorm:"column:email" json:"email"`
	Bidang         string     `gorm:"column:bidang" json:"bidang"`
	Kota           string     `gorm:"column:kota" json:"kota"`
	QRCode         string     `gorm:"column:qr_code" json:"qrCode"`
	JenisKehadiran string     `gorm:"column:jenis_kehadiran" json:"jenisKehadiran"`
	IsCheckedIn    bool       `gorm:"column:is_checked_in" json:"isCheckedIn"`
	CheckedInAt    *time.Time `gorm:"column:checked_in_at" json:"checkedInAt"`
	CreatedAt      *time.Time `gorm:"column:created_at" json:"createdAt"`
	UpdatedAt      *time.Time `gorm:"column:updated_at" json:"updatedAt"`
}

func (PesertaUMKM) TableName() string { return "peserta_umkm" }

// Peserta is retained for backward compatibility with existing code
type Peserta = PesertaMahasiswa
	ID          string     `gorm:"column:id;primaryKey" json:"id"`
	NIM         string     `gorm:"column:nim" json:"nim"`
	Nama        string     `gorm:"column:nama" json:"nama"`
	Email       string     `gorm:"column:email" json:"email"`
	Universitas string     `gorm:"column:universitas" json:"universitas"`
	Fakultas    string     `gorm:"column:fakultas" json:"fakultas"`
	Prodi       string     `gorm:"column:prodi" json:"prodi"`
	QRCode      string     `gorm:"column:qr_code" json:"qrCode"`
	IsCheckedIn bool       `gorm:"column:is_checked_in" json:"isCheckedIn"`
	IsEmailSent bool       `gorm:"column:is_email_sent" json:"isEmailSent"`
	EmailSentAt *time.Time `gorm:"column:email_sent_at" json:"emailSentAt"`
	CheckedInAt *time.Time `gorm:"column:checked_in_at" json:"checkedInAt"`
	CreatedAt   time.Time  `gorm:"column:created_at" json:"createdAt"`
	UpdatedAt   time.Time  `gorm:"column:updated_at" json:"updatedAt"`
}

func (PesertaMahasiswa) TableName() string { return "peserta_mahasiswa" }

type PesertaUMKM struct {
	ID          string     `gorm:"column:id;primaryKey" json:"id"`
	Nama        string     `gorm:"column:nama" json:"nama"`
	Email       string     `gorm:"column:email" json:"email"`
	Bidang      string     `gorm:"column:bidang" json:"bidang"`
	Kota        string     `gorm:"column:kota" json:"kota"`
	QRCode      string     `gorm:"column:qr_code" json:"qrCode"`
	IsCheckedIn bool       `gorm:"column:is_checked_in" json:"isCheckedIn"`
	CheckedInAt *time.Time `gorm:"column:checked_in_at" json:"checkedInAt"`
	CreatedAt   time.Time  `gorm:"column:created_at" json:"createdAt"`
	UpdatedAt   time.Time  `gorm:"column:updated_at" json:"updatedAt"`
}

func (PesertaUMKM) TableName() string { return "peserta_umkm" }
