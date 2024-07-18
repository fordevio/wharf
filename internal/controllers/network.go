package controllers

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/errdefs"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
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
		if reqUser.Permission != models.Execute {
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

func RemoveNetwork() gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()
		ur, _ := c.Get("user")
		reqUser, _ := ur.(*models.User)
		if reqUser.Permission != models.Execute {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid permissions"})
			return
		}
		id := c.Param("id")
		err := dockerNetwork.Remove(conf.DockerClient, ctx, id)
		if err != nil {
			if errdefs.IsNotFound(err) {
				c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
				return
			}
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": id + " network removed"})

	}
}

func DisconnectNetwork() gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()
		id := c.Param("id")
		ur, _ := c.Get("user")
		reqUser, _ := ur.(*models.User)
		if reqUser.Permission == models.Execute {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid permissions"})
			return
		}

		var reqBody dockerNetwork.DisconnectNetworkRequest

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

		err := dockerNetwork.Disconnect(conf.DockerClient, ctx, id, reqBody.ContainerID, reqBody.Force)
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}
		msg := fmt.Sprintf("%s connection lost with %s", reqBody.ContainerID, id)

		c.JSON(http.StatusOK, gin.H{"message": msg})

	}
}

func ConnectNetwork() gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()
		id := c.Param("id")
		ur, _ := c.Get("user")
		reqUser, _ := ur.(*models.User)

		if reqUser.Permission == models.Read {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Permission"})
			return
		}

		var reqBody dockerNetwork.ConnectNetworkRequest
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

		err := dockerNetwork.Connect(conf.DockerClient, ctx, id, reqBody.ContainerID)
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}
		msg := fmt.Sprintf("%s connection created with %s", reqBody.ContainerID, id)

		c.JSON(http.StatusOK, gin.H{"message": msg})

	}
}
