package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/wharf/wharf/internal/controllers"
)

func ContainerRoutes(incommingRoutes *gin.Engine) {
	incommingRoutes.GET("/api/containers", controllers.GetContainers())
	incommingRoutes.PUT("/api/container/stop/:id", controllers.StopContainer())

}
