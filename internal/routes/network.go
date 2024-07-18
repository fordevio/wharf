package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/wharf/wharf/internal/controllers"
	"github.com/wharf/wharf/pkg/auth"
)

func NetworkRoutes(incommingRoutes *gin.Engine) {
	incommingRoutes.Use(auth.AuthMiddleWare())
	incommingRoutes.GET("/api/network/getAll", controllers.GetNetworks())
	incommingRoutes.DELETE("/api/network/prune", controllers.PruneNetwork())
	incommingRoutes.PUT("/api/network/disconnect/:id", controllers.DisconnectNetwork())
	incommingRoutes.PUT("/api/network/connect/:id", controllers.ConnectNetwork())
}
