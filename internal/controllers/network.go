package controllers

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/docker/docker/api/types"
	"github.com/gin-gonic/gin"
	"github.com/wharf/wharf/conf"
	"github.com/wharf/wharf/pkg/errors"
	"github.com/wharf/wharf/pkg/models"
	dockerNetwork "github.com/wharf/wharf/pkg/networks"
)

func GetNetworks() gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
		ch := make(chan *types.NetworkResource)
		errCh := make(chan *errors.Error)
		networks := []*types.NetworkResource{}
		defer cancel()
		go dockerNetwork.GetAll(conf.DockerClient, ctx, ch, errCh)
		for err := range errCh {
			log.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Err})
			return
		}
		for network := range ch {
			networks = append(networks, network)
		}
		c.JSON(200, networks)
	}
}

func PruneNetwork() gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()
		ur, _ := c.Get("user")
		reqUser, _ := ur.(*models.User)
		if reqUser.Permission != models.Write {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid permissions"})
			return
		}
		report, err := dockerNetwork.Prune(conf.DockerClient, ctx)
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, report)
	}
}
