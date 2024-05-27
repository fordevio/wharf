package controllers

import (
	"context"

	"log"
	"net/http"

	"time"

	"github.com/docker/docker/api/types"
	"github.com/gin-gonic/gin"
	"github.com/wharf/wharf/conf"
	"github.com/wharf/wharf/pkg/container"
	"github.com/wharf/wharf/pkg/errors"
)

func GetContainers() gin.HandlerFunc {
	return func(c *gin.Context) {
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		ch := make(chan *types.Container)
		errCh := make(chan *errors.Error)
		containers := []*types.Container{}
		defer cancel()
		go container.GetContainers(conf.DockerClient, ctx, ch, errCh)
		for err := range errCh {
			log.Println(err.Err)
			c.JSON(http.StatusInternalServerError, "Internal server error")
			return
		}

		for cont := range ch {
			containers = append(containers, cont)
		}
		c.JSON(200, containers)
	}
}

func StopContainer() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		errCh := make(chan *errors.Error)
		defer cancel()
		go container.StopContainer(conf.DockerClient, ctx, id, errCh)
		for err := range errCh {
			if err != nil {
				log.Println(err.Err)
				c.JSON(http.StatusBadRequest, err.Name)
				return
			}
		}
		c.JSON(200, "Container stopped")
	}
}
