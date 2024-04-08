package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/wharf/wharf/internal/controllers"
)

func VolumeRoutes(incommingRoutes *gin.Engine) {
	incommingRoutes.GET("/api/volumes", controllers.GetVolumes())
}
