package routes

import (
	"github.com/docker/docker/client"
	"github.com/gin-gonic/gin"
	"github.com/wharf/wharf/internal/controllers"
)

func VolumeRoutes(incommingRoutes *gin.RouterGroup, dockerClient *client.Client) {
	incommingRoutes.GET("/volume/getAll", controllers.GetVolumes(dockerClient))
	incommingRoutes.DELETE("/volume/remove/:id", controllers.RemoveVolume(dockerClient))
	incommingRoutes.DELETE("/volume/prune", controllers.PruneVolumes(dockerClient))
	incommingRoutes.POST("/volume/create", controllers.CreateVolume(dockerClient))
}
