package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/wharf/wharf/internal/controllers"
)

func AuthRoutes(incommingRoutes *gin.Engine) {
	incommingRoutes.POST("/auth/init", controllers.CheckInitPassword())
	incommingRoutes.GET("/auth/isAdmin", controllers.IsAdminAvailable())
	incommingRoutes.GET("/auth/login", controllers.Login())
}
