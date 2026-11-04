package auth

import (
	"crypto/rand"
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

const tokenTTL = 7 * 24 * time.Hour

type Claims struct {
	Email string `json:"email"`
	Name  string `json:"name"`
	jwt.RegisteredClaims
}

type TokenManager struct {
	secret []byte
}

func NewTokenManager(secret string) *TokenManager {
	return &TokenManager{secret: []byte(secret)}
}

func (m *TokenManager) Issue(userID, email, name string) (string, time.Time, error) {
	now := time.Now()
	expiresAt := now.Add(tokenTTL)

	claims := Claims{
		Email: email,
		Name:  name,
		RegisteredClaims: jwt.RegisteredClaims{
			ID:        rand.Text(),
			Subject:   userID,
			IssuedAt:  jwt.NewNumericDate(now),
			ExpiresAt: jwt.NewNumericDate(expiresAt),
		},
	}

	token, err := jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString(m.secret)
	return token, expiresAt, err
}

func (m *TokenManager) Parse(tokenString string) (*Claims, error) {
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (any, error) {
		if token.Method != jwt.SigningMethodHS256 {
			return nil, errors.New("unexpected signing method")
		}
		return m.secret, nil
	})
	if err != nil || !token.Valid {
		return nil, errors.New("invalid token")
	}
	return claims, nil
}
