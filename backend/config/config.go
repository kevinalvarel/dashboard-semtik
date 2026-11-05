package config

import (
	"errors"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	DatabaseURL  string
	JWTSecret    string
	FrontendURL  string
	Port         string
	ResendAPIKey string
	ResendFrom   string
}

func Load() (Config, error) {
	_ = godotenv.Load()

	cfg := Config{
		DatabaseURL:  os.Getenv("DATABASE_URL"),
		JWTSecret:    envOr("JWT_SECRET", os.Getenv("BETTER_AUTH_SECRET")),
		FrontendURL:  os.Getenv("FRONTEND_URL"),
		Port:         envOr("PORT", "3000"),
		ResendAPIKey: os.Getenv("RESEND_API_KEY"),
		ResendFrom:   envOr("RESEND_FROM", "SEMTIK Admin <onboarding@resend.dev>"),
	}

	if cfg.DatabaseURL == "" {
		return cfg, errors.New("DATABASE_URL is required")
	}
	if cfg.JWTSecret == "" {
		return cfg, errors.New("JWT_SECRET or BETTER_AUTH_SECRET is required")
	}
	return cfg, nil
}

func envOr(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
