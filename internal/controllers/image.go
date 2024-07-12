package controllers

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/docker/docker/api/types/image"
	"github.com/gin-gonic/gin"
	"github.com/wharf/wharf/conf"
	"github.com/wharf/wharf/pkg/errors"
	dockerImage "github.com/wharf/wharf/pkg/image"
	"github.com/wharf/wharf/pkg/models"
)

func GetImages() gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
		ch := make(chan *image.Summary)
		errCh := make(chan *errors.Error)
		images := []*image.Summary{}
		defer cancel()
		go dockerImage.GetAll(conf.DockerClient, ctx, ch, errCh)
		for err := range errCh {
			log.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Err})
			return
		}

		for img := range ch {
			images = append(images, img)
		}
		c.JSON(200, images)
	}
}

func PruneImages() gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()
		ur, _ := c.Get("users")
		reqUser, _ := ur.(*models.User)
		if reqUser.Permission != models.Execute {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid premissions"})
			return
		}
		report, err := dockerImage.Prune(conf.DockerClient, ctx)
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, report)
	}
}
