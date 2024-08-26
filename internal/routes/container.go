package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/wharf/wharf/internal/controllers"
)

func ContainerRoutes(incommingRoutes *gin.RouterGroup) {
	incommingRoutes.GET("/container/getAll", controllers.GetContainers())
	incommingRoutes.PUT("/container/stop/:id", controllers.StopContainer())
	incommingRoutes.PUT("/container/unpause/:id", controllers.UnpauseContainer())
	incommingRoutes.DELETE("/container/remove/:id", controllers.RemoveContainer())
	incommingRoutes.DELETE("api/container/prune", controllers.PruneContainers())
	incommingRoutes.GET("/container/stats/:id", controllers.ContainerStats())
	incommingRoutes.GET("/container/logs/:id", controllers.ContainerLogs())
	incommingRoutes.GET("/container/rename/:id", controllers.ContainerRename())
	incommingRoutes.POST("/container/create", controllers.ContainerCreate())
}
