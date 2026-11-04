package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

var defaultOrigins = []string{
	"https://admin-semtik26.netlify.app",
	"http://localhost:5173",
	"http://localhost:3000",
}

func CORS(frontendURL string) gin.HandlerFunc {
	allowed := map[string]struct{}{}
	for _, origin := range defaultOrigins {
		allowed[origin] = struct{}{}
	}
	for _, origin := range strings.Split(frontendURL, ",") {
		if origin = strings.TrimRight(strings.TrimSpace(origin), "/"); origin != "" {
			allowed[origin] = struct{}{}
		}
	}

	return func(c *gin.Context) {
		origin := strings.TrimRight(c.GetHeader("Origin"), "/")
		if _, ok := allowed[origin]; ok && origin != "" {
			c.Header("Access-Control-Allow-Origin", origin)
			c.Header("Access-Control-Allow-Credentials", "true")
			c.Header("Vary", "Origin")
		}

		if c.Request.Method == http.MethodOptions {
			c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
			c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization, Cookie")
			c.Header("Access-Control-Expose-Headers", "Set-Cookie")
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}
