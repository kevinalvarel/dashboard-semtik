package model

import "time"

type User struct {
	ID            string    `gorm:"column:id;primaryKey"`
	Name          string    `gorm:"column:name"`
	Email         string    `gorm:"column:email"`
	EmailVerified bool      `gorm:"column:email_verified"`
	Image         *string   `gorm:"column:image"`
	CreatedAt     time.Time `gorm:"column:created_at"`
	UpdatedAt     time.Time `gorm:"column:updated_at"`
}

func (User) TableName() string { return "user" }

type Account struct {
	ID         string    `gorm:"column:id;primaryKey"`
	AccountID  string    `gorm:"column:account_id"`
	ProviderID string    `gorm:"column:provider_id"`
	UserID     string    `gorm:"column:user_id"`
	Password   *string   `gorm:"column:password"`
	CreatedAt  time.Time `gorm:"column:created_at"`
	UpdatedAt  time.Time `gorm:"column:updated_at"`
}

func (Account) TableName() string { return "account" }
