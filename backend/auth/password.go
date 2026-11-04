package auth

import (
	"crypto/rand"
	"crypto/subtle"
	"encoding/hex"
	"strings"

	"golang.org/x/crypto/scrypt"
	"golang.org/x/text/unicode/norm"
)

const (
	scryptN      = 16384
	scryptR      = 16
	scryptP      = 1
	scryptKeyLen = 64
	saltLen      = 16
)

func HashPassword(password string) (string, error) {
	salt := make([]byte, saltLen)
	if _, err := rand.Read(salt); err != nil {
		return "", err
	}

	saltHex := hex.EncodeToString(salt)
	key, err := deriveKey(password, saltHex, scryptKeyLen)
	if err != nil {
		return "", err
	}
	return saltHex + ":" + hex.EncodeToString(key), nil
}

func VerifyPassword(hash, password string) bool {
	salt, encoded, ok := strings.Cut(hash, ":")
	if !ok || salt == "" || encoded == "" {
		return false
	}

	expected, err := hex.DecodeString(encoded)
	if err != nil || len(expected) == 0 {
		return false
	}

	actual, err := deriveKey(password, salt, len(expected))
	if err != nil {
		return false
	}
	return subtle.ConstantTimeCompare(actual, expected) == 1
}

func deriveKey(password, salt string, keyLen int) ([]byte, error) {
	return scrypt.Key([]byte(norm.NFKC.String(password)), []byte(salt), scryptN, scryptR, scryptP, keyLen)
}
