package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/wharf/wharf/internal/controllers"
	"github.com/wharf/wharf/pkg/auth"
)

func ContainerRoutes(incommingRoutes *gin.Engine) {
	incommingRoutes.Use(auth.AuthMiddleWare())
	incommingRoutes.GET("/api/containers", controllers.GetContainers())
	incommingRoutes.PUT("/api/container/stop/:id", controllers.StopContainer())
	incommingRoutes.PUT("/api/container/unpause/:id", controllers.UnpauseContainer())
	incommingRoutes.DELETE("/api/container/remove/:id", controllers.RemoveContainer())
	incommingRoutes.DELETE("api/container/prune", controllers.PruneContainers())
}
