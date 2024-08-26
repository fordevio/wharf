package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/wharf/wharf/conf"
	"github.com/wharf/wharf/internal/routes"
	"github.com/wharf/wharf/pkg/auth"
	"github.com/wharf/wharf/pkg/store"
)

func main() {

	port := "9001"

	corsConfig := cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"*"},
		AllowHeaders:     []string{"*"},
		AllowCredentials: true,
	}

	router := gin.New()
	router.Use(cors.New(corsConfig))
	router.Use(gin.Logger())
	api := router.Group("/api")
    {
		api.Use(auth.AuthMiddleWare())
		routes.UserRoutes(api)
		routes.ContainerRoutes(api)
		routes.ImageRoutes(api)
		routes.VolumeRoutes(api)
		routes.NetworkRoutes(api)
	}
	
	

	routes.AuthRoutes(router)
	conf.InitDir()
	go conf.InitPassword()
	go store.InitStore()
	conf.InitCache()
	router.Run(":" + port)
}
