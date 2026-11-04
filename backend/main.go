package main

import (
	"log"

	"github.com/gin-gonic/gin"

	"semtik.id/backend/auth"
	"semtik.id/backend/config"
	"semtik.id/backend/database"
	"semtik.id/backend/middleware"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatal(err)
	}

	db, err := database.Open(cfg.DatabaseURL)
	if err != nil {
		log.Fatal(err)
	}

	handler := auth.NewHandler(db, auth.NewTokenManager(cfg.JWTSecret))

	router := gin.New()
	router.Use(gin.Logger(), gin.Recovery(), middleware.CORS(cfg.FrontendURL))

	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok", "message": "SEMTIK API running"})
	})

	authRoutes := router.Group("/api/auth")
	authRoutes.POST("/sign-up/email", handler.SignUp)
	authRoutes.POST("/sign-in/email", handler.SignIn)
	authRoutes.GET("/get-session", handler.GetSession)
	authRoutes.POST("/get-session", handler.GetSession)
	authRoutes.POST("/sign-out", handler.SignOut)

	protected := router.Group("/api", handler.RequireAuth)
	protected.GET("/overview", handler.Overview)
	protected.GET("/profile", handler.Profile)

	log.Printf("SEMTIK API listening on :%s", cfg.Port)
	if err := router.Run(":" + cfg.Port); err != nil {
		log.Fatal(err)
	}
}
