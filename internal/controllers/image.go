package controllers

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/docker/docker/api/types/image"
	"github.com/gin-gonic/gin"
	"github.com/wharf/wharf/conf"
	dockerImage "github.com/wharf/wharf/pkg/image"
	wharfTypes "github.com/wharf/wharf/types"
)

func GetImages() gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
		ch := make(chan *image.Summary)
		errCh := make(chan *wharfTypes.Error)
		images := []*image.Summary{}
		defer cancel()
		go dockerImage.GetImages(conf.DockerClient, ctx, ch, errCh)
		for err := range errCh {
			log.Println(err.Err)
			c.JSON(http.StatusInternalServerError, "Internal server error")
			return
		}

		for img := range ch {
			images = append(images, img)
		}
		c.JSON(200, images)
	}
}
