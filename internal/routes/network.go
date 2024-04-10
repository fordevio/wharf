package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/wharf/wharf/internal/controllers"
)

func NetworkRoutes(incommingRoutes *gin.Engine) {
	incommingRoutes.GET("/api/networks", controllers.GetNetworks())
}
