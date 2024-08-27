package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/wharf/wharf/internal/controllers"
)

func ContainerRoutes(incommingRoutes *gin.RouterGroup) {
	incommingRoutes.GET("/container/getAll", controllers.GetContainers())
	incommingRoutes.PUT("/container/stop/:id", controllers.StopContainer())
	incommingRoutes.PUT("/container/start/:id", controllers.ContainerStart())
	incommingRoutes.PUT("/container/pause/:id", controllers.ContainerPause())
	incommingRoutes.PUT("/container/unpause/:id", controllers.UnpauseContainer())
	incommingRoutes.DELETE("/container/remove/:id", controllers.RemoveContainer())
	incommingRoutes.DELETE("/container/prune", controllers.PruneContainers())
	incommingRoutes.GET("/container/stats/:id", controllers.ContainerStats())
	incommingRoutes.GET("/container/logs/:id", controllers.ContainerLogs())
	incommingRoutes.PUT("/container/rename/:id", controllers.ContainerRename())
	incommingRoutes.POST("/container/create", controllers.ContainerCreate())
}
