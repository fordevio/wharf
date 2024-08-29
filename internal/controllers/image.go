package controllers

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/docker/docker/api/types/image"
	"github.com/docker/docker/errdefs"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
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
		reqUser, _ := ur.(models.User)
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

func RemoveImage() gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()
		id := c.Param("id")
		var requestBody dockerImage.ImageRemoveRequest
		if err := c.BindJSON(&requestBody); err != nil {
			log.Println(err)
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		validate := validator.New()
		if err := validate.Struct(requestBody); err != nil {
			log.Println(err)
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		ur, _ := c.Get("user")
		reqUser, _ := ur.(models.User)
		if reqUser.Permission != models.Execute {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid permissions"})
			return
		}

		opts := image.RemoveOptions{
			Force:         false,
			PruneChildren: false,
		}

		if requestBody.Force != nil {
			opts.Force = *requestBody.Force
		}

		if requestBody.PruneChildren != nil {
			opts.PruneChildren = *requestBody.PruneChildren
		}
		report, err := dockerImage.Remove(conf.DockerClient, ctx, id, opts)
		if err != nil {
			if errdefs.IsNotFound(err) {
				c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
				return
			}
			log.Println(err)
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, report)
	}
}

func TagImage() gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()
		id := c.Param("id")
		ur, _ := c.Get("user")
		reqUser, _ := ur.(models.User)
		if reqUser.Permission == models.Read {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid permissions"})
			return
		}
		var reqBody dockerImage.ImageTagRequest
		if err := c.BindJSON(&reqBody); err != nil {
			log.Println(err)
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		validate := validator.New()
		if err := validate.Struct(reqBody); err != nil {
			log.Println(err)
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		err := dockerImage.Tag(conf.DockerClient, ctx, id, reqBody.Tag)

		if err != nil {
			if errdefs.IsNotFound(err) {
				c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
				return
			}
			log.Println(err)
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, id+" tagged successfully")

	}
}
