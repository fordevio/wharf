package routes

import (
	"github.com/docker/docker/client"
	"github.com/gin-gonic/gin"
	"github.com/wharf/wharf/internal/controllers"
)

func ContainerRoutes(incommingRoutes *gin.RouterGroup, dockerClient *client.Client) {
	incommingRoutes.GET("/container/getAll", controllers.GetContainers(dockerClient))
	incommingRoutes.PUT("/container/stop/:id", controllers.StopContainer(dockerClient))
	incommingRoutes.PUT("/container/start/:id", controllers.ContainerStart(dockerClient))
	incommingRoutes.PUT("/container/pause/:id", controllers.ContainerPause(dockerClient))
	incommingRoutes.PUT("/container/unpause/:id", controllers.UnpauseContainer(dockerClient))
	incommingRoutes.DELETE("/container/remove/:id", controllers.RemoveContainer(dockerClient))
	incommingRoutes.DELETE("/container/prune", controllers.PruneContainers(dockerClient))
	incommingRoutes.GET("/container/stats/:id", controllers.ContainerStats(dockerClient))
	incommingRoutes.GET("/container/logs/:id", controllers.ContainerLogs(dockerClient))
	incommingRoutes.PUT("/container/rename/:id", controllers.ContainerRename(dockerClient))
	incommingRoutes.POST("/container/create", controllers.ContainerCreate(dockerClient))
}
