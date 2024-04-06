package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/wharf/wharf/conf"
)

func main() {

	port := "9001"

	corsConfig := cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"*"},
		AllowHeaders:     []string{"*"},
		AllowCredentials: true,
	}
    
	conf.InitDir()
	DockerClient := conf.InitDockerClient()
	defer DockerClient.Close()
	router := gin.New()
	router.Use(cors.New(corsConfig))
	router.Use(gin.Logger())
	router.Run(":" + port)
}
