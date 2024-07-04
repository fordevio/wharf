package controllers

import (
	"context"

	"log"
	"net/http"

	"time"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/wharf/wharf/conf"

	dockerContainer "github.com/wharf/wharf/pkg/container"
	"github.com/wharf/wharf/pkg/errors"
	"github.com/wharf/wharf/pkg/models"
)

func GetContainers() gin.HandlerFunc {
	return func(c *gin.Context) {
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		ch := make(chan *types.Container)
		errCh := make(chan *errors.Error)
		containers := []*types.Container{}
		defer cancel()
		go dockerContainer.GetAll(conf.DockerClient, ctx, ch, errCh)
		for err := range errCh {
			log.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Err})
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
		defer cancel()
		ur, _ := c.Get("user")
		reqUser, _ := ur.(*models.User)

		if reqUser.Permission == models.Read {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid permissions"})
			return
		}
		errCh := make(chan *errors.Error)

		go dockerContainer.Stop(conf.DockerClient, ctx, id, errCh)
		for err := range errCh {
			if err != nil {
				log.Println(err)
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Name})
				return
			}
		}
		c.JSON(200, "Container stopped")
	}
}

func UnpauseContainer() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()
		ur, _ := c.Get("user")
		reqUser, _ := ur.(*models.User)

		if reqUser.Permission == models.Read {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid permissions"})
			return
		}
		err := dockerContainer.Unpause(conf.DockerClient, ctx, id)
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, "Container unpause")

	}
}

func RemoveContainer() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		var requestBody dockerContainer.ContainerRemoveRequest
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()
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
		reqUser, _ := ur.(*models.User)

		if reqUser.Permission != models.Execute {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid permissions"})
			return
		}
		err := dockerContainer.Remove(conf.DockerClient, ctx, id, container.RemoveOptions{
			RemoveVolumes: requestBody.RemoveVolumes,
			RemoveLinks:   requestBody.RemoveLinks,
			Force:         requestBody.Force,
		})
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, "Container removed")
	}
}

func PruneContainers() gin.HandlerFunc {
	return func(c *gin.Context) {
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()
		ur, _ := c.Get("user")
		reqUser, _ := ur.(*models.User)

		if reqUser.Permission != models.Execute {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid permissions"})
			return
		}
		report, err := dockerContainer.Prune(conf.DockerClient, ctx)
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, report)
	}
}

func ContainerStats() gin.HandlerFunc {
	return func(c *gin.Context) {
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		id := c.Param("id")
		defer cancel()
		body, err := dockerContainer.Stats(conf.DockerClient, ctx, id)
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, body)

	}
}
