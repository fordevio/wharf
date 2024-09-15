package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/wharf/wharf/internal/controllers"
)

func UserRoutes(incommingRoutes *gin.RouterGroup) {
	incommingRoutes.GET("/user/getAll", controllers.ListUsers())
	incommingRoutes.POST("/user/create", controllers.CreateUser())
	incommingRoutes.PUT("/user/update/:id", controllers.UpdateUser())
	incommingRoutes.DELETE("/user/delete/:id", controllers.DeleteUser())
	incommingRoutes.GET("/user/get", controllers.GetUser())
}
