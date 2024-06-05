package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/wharf/wharf/internal/controllers"
	"github.com/wharf/wharf/pkg/auth"
)

func UserRoutes(incommingRoutes *gin.Engine) {
	incommingRoutes.Use(auth.AuthMiddleWare())
	incommingRoutes.POST("/api/user/create", controllers.CreateUser())
	incommingRoutes.PUT("/api/user/update/:id", controllers.UpdateUser())
	incommingRoutes.DELETE("/api/user/delete/:id", controllers.DeleteUser())
}
