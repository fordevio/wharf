package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/wharf/wharf/internal/controllers"
	"github.com/wharf/wharf/pkg/auth"
)

func VolumeRoutes(incommingRoutes *gin.Engine) {
	incommingRoutes.Use(auth.AuthMiddleWare())
	incommingRoutes.GET("/api/volume/getAll", controllers.GetVolumes())
	incommingRoutes.DELETE("/api/volume/remove/:id", controllers.RemoveVolume())
	incommingRoutes.DELETE("/api/volume/prune/:id", controllers.PruneVolumes())
	incommingRoutes.POST("/api/volume/create", controllers.CreateVolume())
}
