package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/wharf/wharf/internal/controllers"
	"github.com/wharf/wharf/pkg/auth"
)

func UserRoutes(incommingRoutes *gin.Engine) {
	incommingRoutes.Use(auth.AuthMiddleWare())
	incommingRoutes.POST("/api/user/create", controllers.Create())
	incommingRoutes.PUT("/api/user/update/:id", controllers.Update())
	incommingRoutes.DELETE("/api/user/delete/:id", controllers.Delete())
}
