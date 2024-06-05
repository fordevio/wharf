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
