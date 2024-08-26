package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/wharf/wharf/internal/controllers"
)

func VolumeRoutes(incommingRoutes *gin.RouterGroup) {
	incommingRoutes.GET("/volume/getAll", controllers.GetVolumes())
	incommingRoutes.DELETE("/volume/remove/:id", controllers.RemoveVolume())
	incommingRoutes.DELETE("/volume/prune/:id", controllers.PruneVolumes())
	incommingRoutes.POST("/volume/create", controllers.CreateVolume())
}
