package auth

import (
	"crypto/rand"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"semtik.id/backend/model"
)

const sessionCookieName = "better-auth.session_token"

type Handler struct {
	db     *gorm.DB
	tokens *TokenManager
}

func NewHandler(db *gorm.DB, tokens *TokenManager) *Handler {
	return &Handler{db: db, tokens: tokens}
}

type credentials struct {
	Email       string `json:"email"`
	Password    string `json:"password"`
	Name        string `json:"name"`
	CallbackURL string `json:"callbackURL"`
	RememberMe  *bool  `json:"rememberMe"`
}

type userResponse struct {
	ID            string    `json:"id"`
	Name          string    `json:"name"`
	Email         string    `json:"email"`
	EmailVerified bool      `json:"emailVerified"`
	Image         *string   `json:"image"`
	CreatedAt     time.Time `json:"createdAt"`
	UpdatedAt     time.Time `json:"updatedAt"`
}

func (h *Handler) SignUp(c *gin.Context) {
	var body credentials
	if err := c.ShouldBindJSON(&body); err != nil {
		fail(c, http.StatusBadRequest, "Invalid request body")
		return
	}

	email := strings.ToLower(strings.TrimSpace(body.Email))
	if !validEmail(email) {
		fail(c, http.StatusBadRequest, "Email tidak valid")
		return
	}
	if len(body.Password) < 8 {
		fail(c, http.StatusBadRequest, "Password minimal 8 karakter")
		return
	}

	var existing int64
	if err := h.db.Model(&model.User{}).Where("email = ?", email).Count(&existing).Error; err != nil {
		fail(c, http.StatusInternalServerError, "Internal server error")
		return
	}
	if existing > 0 {
		fail(c, http.StatusUnprocessableEntity, "Email sudah terdaftar")
		return
	}

	hash, err := HashPassword(body.Password)
	if err != nil {
		fail(c, http.StatusInternalServerError, "Internal server error")
		return
	}

	name := strings.TrimSpace(body.Name)
	if name == "" {
		name = strings.SplitN(email, "@", 2)[0]
	}

	now := time.Now()
	user := model.User{ID: rand.Text(), Name: name, Email: email, CreatedAt: now, UpdatedAt: now}
	account := model.Account{
		ID:         rand.Text(),
		AccountID:  user.ID,
		ProviderID: "credential",
		UserID:     user.ID,
		Password:   &hash,
		CreatedAt:  now,
		UpdatedAt:  now,
	}

	if err := h.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(&user).Error; err != nil {
			return err
		}
		return tx.Create(&account).Error
	}); err != nil {
		fail(c, http.StatusUnprocessableEntity, "Gagal membuat akun")
		return
	}

	token, expiresAt, err := h.tokens.Issue(user.ID, user.Email, user.Name)
	if err != nil {
		fail(c, http.StatusInternalServerError, "Internal server error")
		return
	}

	h.setSessionCookie(c, token, expiresAt)
	c.JSON(http.StatusOK, gin.H{"token": token, "user": toUserResponse(user)})
}

func (h *Handler) SignIn(c *gin.Context) {
	var body credentials
	if err := c.ShouldBindJSON(&body); err != nil {
		fail(c, http.StatusBadRequest, "Invalid request body")
		return
	}

	email := strings.ToLower(strings.TrimSpace(body.Email))
	var user model.User
	if err := h.db.Where("email = ?", email).First(&user).Error; err != nil {
		fail(c, http.StatusUnauthorized, "Email atau password salah")
		return
	}

	var account model.Account
	if err := h.db.Where("user_id = ? AND provider_id = ?", user.ID, "credential").First(&account).Error; err != nil || account.Password == nil {
		fail(c, http.StatusUnauthorized, "Email atau password salah")
		return
	}
	if !VerifyPassword(*account.Password, body.Password) {
		fail(c, http.StatusUnauthorized, "Email atau password salah")
		return
	}

	token, expiresAt, err := h.tokens.Issue(user.ID, user.Email, user.Name)
	if err != nil {
		fail(c, http.StatusInternalServerError, "Internal server error")
		return
	}

	h.setSessionCookie(c, token, expiresAt)
	c.JSON(http.StatusOK, gin.H{
		"redirect": body.CallbackURL != "",
		"token":    token,
		"url":      body.CallbackURL,
		"user":     toUserResponse(user),
	})
}

func (h *Handler) GetSession(c *gin.Context) {
	claims, user, token, ok := h.session(c)
	if !ok {
		c.JSON(http.StatusOK, nil)
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"session": sessionResponse(claims, token, c),
		"user":    toUserResponse(user),
	})
}

func (h *Handler) SignOut(c *gin.Context) {
	h.clearSessionCookie(c)
	c.JSON(http.StatusOK, gin.H{"success": true})
}

func (h *Handler) RequireAuth(c *gin.Context) {
	claims, user, token, ok := h.session(c)
	if !ok {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}
	c.Set("claims", claims)
	c.Set("user", user)
	c.Set("token", token)
	c.Next()
}

func (h *Handler) Overview(c *gin.Context) {
	user := c.MustGet("user").(model.User)
	c.JSON(http.StatusOK, gin.H{"user": toUserResponse(user)})
}

func (h *Handler) Profile(c *gin.Context) {
	claims := c.MustGet("claims").(*Claims)
	user := c.MustGet("user").(model.User)
	c.JSON(http.StatusOK, gin.H{
		"session": sessionResponse(claims, c.GetString("token"), c),
		"user":    toUserResponse(user),
	})
}

func (h *Handler) session(c *gin.Context) (*Claims, model.User, string, bool) {
	for _, token := range h.tokensFrom(c) {
		claims, err := h.tokens.Parse(token)
		if err != nil {
			continue
		}

		var user model.User
		if err := h.db.First(&user, "id = ?", claims.Subject).Error; err != nil {
			continue
		}
		return claims, user, token, true
	}
	return nil, model.User{}, "", false
}

func (h *Handler) setSessionCookie(c *gin.Context, token string, expiresAt time.Time) {
	secure := secureRequest(c)
	name := sessionCookieName
	if secure {
		name = "__Secure-" + sessionCookieName
		c.SetSameSite(http.SameSiteNoneMode)
	} else {
		c.SetSameSite(http.SameSiteLaxMode)
	}
	c.SetCookie(name, token, int(time.Until(expiresAt).Seconds()), "/", "", secure, true)
}

func (h *Handler) clearSessionCookie(c *gin.Context) {
	secure := secureRequest(c)
	if secure {
		c.SetSameSite(http.SameSiteNoneMode)
	} else {
		c.SetSameSite(http.SameSiteLaxMode)
	}
	c.SetCookie(sessionCookieName, "", -1, "/", "", secure, true)
	c.SetCookie("__Secure-"+sessionCookieName, "", -1, "/", "", secure, true)
}

func (h *Handler) tokensFrom(c *gin.Context) []string {
	var tokens []string
	if header := c.GetHeader("Authorization"); strings.HasPrefix(header, "Bearer ") {
		if token := strings.TrimSpace(strings.TrimPrefix(header, "Bearer ")); token != "" {
			tokens = append(tokens, token)
		}
	}
	for _, name := range []string{sessionCookieName, "__Secure-" + sessionCookieName} {
		if value, err := c.Cookie(name); err == nil && value != "" {
			tokens = append(tokens, value)
		}
	}
	return tokens
}

func toUserResponse(user model.User) userResponse {
	return userResponse{
		ID:            user.ID,
		Name:          user.Name,
		Email:         user.Email,
		EmailVerified: user.EmailVerified,
		Image:         user.Image,
		CreatedAt:     user.CreatedAt,
		UpdatedAt:     user.UpdatedAt,
	}
}

func sessionResponse(claims *Claims, token string, c *gin.Context) gin.H {
	var issuedAt, expiresAt time.Time
	if claims.IssuedAt != nil {
		issuedAt = claims.IssuedAt.Time
	}
	if claims.ExpiresAt != nil {
		expiresAt = claims.ExpiresAt.Time
	}

	return gin.H{
		"id":        claims.ID,
		"userId":    claims.Subject,
		"token":     token,
		"expiresAt": expiresAt,
		"createdAt": issuedAt,
		"updatedAt": issuedAt,
		"ipAddress": c.ClientIP(),
		"userAgent": c.Request.UserAgent(),
	}
}

func secureRequest(c *gin.Context) bool {
	return c.Request.TLS != nil || c.GetHeader("X-Forwarded-Proto") == "https"
}

func validEmail(email string) bool {
	at := strings.LastIndexByte(email, '@')
	return at > 0 && at < len(email)-1 && !strings.ContainsAny(email, " \t\r\n")
}

func fail(c *gin.Context, status int, message string) {
	c.JSON(status, gin.H{"message": message})
}
