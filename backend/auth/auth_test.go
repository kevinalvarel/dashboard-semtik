package auth

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
)

const legacyHash = "d79dc1eed35ef768183697fc120c8342:456c6599107fdb72bc9fe367ca1a9c249e6045aa2d03a0a6307b1ece2fe3a19d706c69d9f4aa7f1968c5db5149dbd918755730191aef765872a824ab80ba5621"

func TestVerifyPasswordLegacyBetterAuth(t *testing.T) {
	if !VerifyPassword(legacyHash, "admin12345") {
		t.Fatal("expected legacy better-auth hash to verify")
	}
	if VerifyPassword(legacyHash, "wrong-password") {
		t.Fatal("expected wrong password to be rejected")
	}
}

func TestHashPasswordRoundTrip(t *testing.T) {
	hash, err := HashPassword("rahasia123")
	if err != nil {
		t.Fatal(err)
	}
	if !VerifyPassword(hash, "rahasia123") {
		t.Fatal("expected fresh hash to verify")
	}
	if VerifyPassword(hash, "rahasia124") {
		t.Fatal("expected different password to be rejected")
	}
}

func TestTokenRoundTrip(t *testing.T) {
	manager := NewTokenManager("test-secret")

	token, expiresAt, err := manager.Issue("user-1", "admin@semtik.id", "Admin")
	if err != nil {
		t.Fatal(err)
	}

	claims, err := manager.Parse(token)
	if err != nil {
		t.Fatal(err)
	}
	if claims.Subject != "user-1" || claims.Email != "admin@semtik.id" || claims.Name != "Admin" {
		t.Fatalf("unexpected claims: %+v", claims)
	}
	if claims.ExpiresAt == nil || claims.ExpiresAt.Time.Unix() != expiresAt.Unix() {
		t.Fatal("unexpected expiry")
	}
	if claims.ID == "" {
		t.Fatal("expected session id")
	}

	if _, err := manager.Parse(token + "x"); err == nil {
		t.Fatal("expected tampered token to be rejected")
	}
}

func TestGetSessionWithoutValidTokenReturnsNull(t *testing.T) {
	gin.SetMode(gin.TestMode)
	handler := NewHandler(nil, NewTokenManager("test-secret"))
	router := gin.New()
	router.GET("/api/auth/get-session", handler.GetSession)

	for _, header := range []string{"", "Bearer invalid"} {
		recorder := httptest.NewRecorder()
		request := httptest.NewRequest(http.MethodGet, "/api/auth/get-session", nil)
		if header != "" {
			request.Header.Set("Authorization", header)
		}
		router.ServeHTTP(recorder, request)

		if recorder.Code != http.StatusOK {
			t.Fatalf("expected 200, got %d", recorder.Code)
		}
		if strings.TrimSpace(recorder.Body.String()) != "null" {
			t.Fatalf("expected null body, got %s", recorder.Body.String())
		}
	}
}

func TestRequireAuthRejectsMissingToken(t *testing.T) {
	gin.SetMode(gin.TestMode)
	handler := NewHandler(nil, NewTokenManager("test-secret"))
	router := gin.New()
	router.GET("/api/overview", handler.RequireAuth, handler.Overview)

	recorder := httptest.NewRecorder()
	router.ServeHTTP(recorder, httptest.NewRequest(http.MethodGet, "/api/overview", nil))

	if recorder.Code != http.StatusUnauthorized {
		t.Fatalf("expected 401, got %d", recorder.Code)
	}
}
