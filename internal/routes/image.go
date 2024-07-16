package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/wharf/wharf/internal/controllers"
	"github.com/wharf/wharf/pkg/auth"
)

func ImageRoutes(incommingRoutes *gin.Engine) {
	incommingRoutes.Use(auth.AuthMiddleWare())
	incommingRoutes.GET("/api/image/getAll", controllers.GetImages())
	incommingRoutes.DELETE("/api/image/prune", controllers.PruneImages())
	incommingRoutes.DELETE("/api/image/remove/:id", controllers.RemoveImage())
	incommingRoutes.PUT("/api/image/tag/:id", controllers.TagImage())
}
