package routes

import (
	"github.com/docker/docker/client"
	"github.com/gin-gonic/gin"
	"github.com/wharf/wharf/internal/controllers"
)

func NetworkRoutes(incommingRoutes *gin.RouterGroup, dockerClient *client.Client) {
	incommingRoutes.GET("/network/getAll", controllers.GetNetworks(dockerClient))
	incommingRoutes.DELETE("/network/prune", controllers.PruneNetwork(dockerClient))
	incommingRoutes.PUT("/network/disconnect/:id", controllers.DisconnectNetwork(dockerClient))
	incommingRoutes.PUT("/network/connect/:id", controllers.ConnectNetwork(dockerClient))
	incommingRoutes.POST("/network/create", controllers.CreateNetwork(dockerClient))
	incommingRoutes.DELETE("/network/remove/:id", controllers.RemoveNetwork(dockerClient))
}
