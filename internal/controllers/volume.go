package controllers

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/docker/docker/api/types/volume"
	"github.com/gin-gonic/gin"
	"github.com/wharf/wharf/conf"
	"github.com/wharf/wharf/pkg/errors"
	dockerVolume "github.com/wharf/wharf/pkg/volume"
)

func GetVolumes() gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
		ch := make(chan *volume.Volume)
		errCh := make(chan *errors.Error)
		volumes := []*volume.Volume{}
		defer cancel()
		go dockerVolume.GetVolumes(conf.DockerClient, ctx, ch, errCh)
		for err := range errCh {
			log.Println(err.Err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Err})
			return
		}

		for vol := range ch {
			volumes = append(volumes, vol)
		}
		c.JSON(200, volumes)
	}
}
