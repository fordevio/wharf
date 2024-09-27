package routes

import (
	"github.com/docker/docker/client"
	"github.com/gin-gonic/gin"
	"github.com/wharf/wharf/internal/controllers"
)

func ImageRoutes(incommingRoutes *gin.RouterGroup, dockerClient *client.Client) {
	incommingRoutes.GET("/image/getAll", controllers.GetImages(dockerClient))
	incommingRoutes.DELETE("/image/prune", controllers.PruneImages(dockerClient))
	incommingRoutes.DELETE("/image/remove/:id", controllers.RemoveImage(dockerClient))
	incommingRoutes.PUT("/image/tag/:id", controllers.TagImage(dockerClient))
}
