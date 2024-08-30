package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/wharf/wharf/internal/controllers"
)

func AuthRoutes(incommingRoutes *gin.Engine) {
	incommingRoutes.POST("/api/auth/init", controllers.CheckInitPassword())
	incommingRoutes.GET("/api/auth/isAdmin", controllers.IsAdminAvailable())
	incommingRoutes.POST("/api/auth/login", controllers.Login())
}
