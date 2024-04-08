package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/wharf/wharf/internal/controllers"
)

func ImageRoutes(incommingRoutes *gin.Engine) {
	incommingRoutes.GET("/api/images", controllers.GetImages())
}
