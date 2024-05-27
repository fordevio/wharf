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
		go dockerNetwork.GetNetworks(conf.DockerClient, ctx, ch, errCh)
		for err := range errCh {
			log.Println(err.Err)
			c.JSON(http.StatusInternalServerError, "Internal server error")
			return
		}
		for network := range ch {
			networks = append(networks, network)
		}
		c.JSON(200, networks)
	}
}
