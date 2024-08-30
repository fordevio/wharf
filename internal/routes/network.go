package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/wharf/wharf/internal/controllers"
)

func NetworkRoutes(incommingRoutes *gin.RouterGroup) {
	incommingRoutes.GET("/network/getAll", controllers.GetNetworks())
	incommingRoutes.DELETE("/network/prune", controllers.PruneNetwork())
	incommingRoutes.PUT("/network/disconnect/:id", controllers.DisconnectNetwork())
	incommingRoutes.PUT("/network/connect/:id", controllers.ConnectNetwork())
	incommingRoutes.POST("/network/create", controllers.CreateNetwork())
	incommingRoutes.DELETE("/network/remove/:id", controllers.RemoveNetwork())
}
