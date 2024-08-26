package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/wharf/wharf/internal/controllers"
)

func ImageRoutes(incommingRoutes *gin.RouterGroup) {
	incommingRoutes.GET("/image/getAll", controllers.GetImages())
	incommingRoutes.DELETE("/image/prune", controllers.PruneImages())
	incommingRoutes.DELETE("/image/remove/:id", controllers.RemoveImage())
	incommingRoutes.PUT("/image/tag/:id", controllers.TagImage())
}
