// Copyright 2025 The wharf Authors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package controllers

import (
	"context"
	"strconv"

	"log"
	"net/http"

	"time"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
	"github.com/docker/docker/errdefs"
	"github.com/docker/go-connections/nat"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"

	dockerContainer "github.com/wharf/wharf/pkg/container"
	"github.com/wharf/wharf/pkg/errors"
	"github.com/wharf/wharf/pkg/models"
)

func GetContainers(dockerClient *client.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		ch := make(chan *types.Container)
		errCh := make(chan *errors.Error)
		containers := []*types.Container{}
		defer cancel()
		go dockerContainer.List(ctx, dockerClient, ch, errCh)
		for err := range errCh {
			log.Println(err)
			c.JSON(http.StatusForbidden, gin.H{"error": err.Err})
			return
		}

		for cont := range ch {
			containers = append(containers, cont)
		}
		c.JSON(200, containers)
	}
}

func StopContainer(dockerClient *client.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()
		ur, _ := c.Get("user")
		reqUser, _ := ur.(models.User)

		if reqUser.Permission == models.Read {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid permissions"})
			return
		}
		errCh := make(chan *errors.Error)

		go dockerContainer.Stop(ctx, dockerClient, id, errCh)
		for err := range errCh {
			if err != nil {
				log.Println(err)
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Name})
				return
			}
		}
		c.JSON(200, gin.H{"message": id + " container stopped"})
	}
}

func UnpauseContainer(dockerClient *client.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()
		ur, _ := c.Get("user")
		reqUser, _ := ur.(models.User)

		if reqUser.Permission == models.Read {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid permissions"})
			return
		}
		err := dockerContainer.Unpause(ctx, dockerClient, id)
		if err != nil {
			if errdefs.IsNotFound(err) {
				c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
				return
			}
			log.Println(err)
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": id + " container unpause"})

	}
}

func RemoveContainer(dockerClient *client.Client) gin.HandlerFunc {
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
		reqUser, _ := ur.(models.User)

		if reqUser.Permission != models.Execute {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid permissions"})
			return
		}
		opts := container.RemoveOptions{
			RemoveVolumes: false,
			RemoveLinks:   false,
			Force:         false,
		}
		if requestBody.Force != nil {
			opts.Force = *requestBody.Force
		}
		if requestBody.RemoveVolumes != nil {
			opts.RemoveVolumes = *requestBody.RemoveVolumes
		}
		err := dockerContainer.Remove(ctx, dockerClient, id, opts)

		if err != nil {
			if errdefs.IsNotFound(err) {
				c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
				return
			}
			log.Println(err)
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": id + "container removed"})
	}
}

func PruneContainers(dockerClient *client.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()
		ur, _ := c.Get("user")
		reqUser, _ := ur.(models.User)

		if reqUser.Permission != models.Execute {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid permissions"})
			return
		}
		report, err := dockerContainer.Prune(ctx, dockerClient)
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, report)
	}
}

func ContainerStats(dockerClient *client.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		id := c.Param("id")
		defer cancel()
		body, err := dockerContainer.Stats(ctx, dockerClient, id)
		if err != nil {
			if errdefs.IsNotFound(err) {
				c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
				return
			}
			log.Println(err)

			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, body)
	}
}

func ContainerLogs(dockerClient *client.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()
		id := c.Param("id")
		daysStr := c.Query("days")
		if daysStr == "" {
			daysStr = "1"
		}
		days, err := strconv.Atoi(daysStr)
		if err != nil || days <= 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid days qeury parameter"})
			return
		}

		body, err := dockerContainer.Logs(ctx, dockerClient, id, days)
		if err != nil {
			if errdefs.IsNotFound(err) {
				c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
				return
			}
			log.Println(err)
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, body)
	}
}

func ContainerRename(dockerClient *client.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()
		id := c.Param("id")
		ur, _ := c.Get("user")
		reqUser, _ := ur.(models.User)

		if reqUser.Permission == models.Read {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid permissions"})
			return
		}
		var requestBody dockerContainer.ContainerRenameRequest
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

		err := dockerContainer.Rename(ctx, dockerClient, id, requestBody.NewName)

		if err != nil {
			if errdefs.IsNotFound(err) {
				c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
				return
			}
			log.Println(err)
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": id + ": name changed successfully"})

	}
}

func ContainerCreate(dockerClient *client.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()
		ur, _ := c.Get("user")
		reqUser, _ := ur.(models.User)

		if reqUser.Permission == models.Read {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid permissions"})
			return
		}
		var requestBody dockerContainer.ContainerCreateRequest
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
		config := container.Config{
			Image: requestBody.Image,
		}

		hostConfig := container.HostConfig{}
		if vol := requestBody.Volumes; vol != nil {
			config.Volumes = *vol
		}
		if user := requestBody.User; user != nil {
			config.User = *user
		}
		if domainName := requestBody.DomainName; domainName != nil {
			config.Domainname = *domainName
		}
		if exposedPorts := requestBody.ExposedPorts; exposedPorts != nil {
			portsMap := nat.PortSet{}
			for _, port := range *exposedPorts {
				portsMap[nat.Port(port)] = struct{}{}
			}
			config.ExposedPorts = portsMap
		}
		if cmd := requestBody.Cmd; cmd != nil {
			config.Cmd = *cmd
		}
		if env := requestBody.Env; env != nil {
			config.Env = *env
		}
		if entryPoint := requestBody.Entrypoint; entryPoint != nil {
			config.Entrypoint = *entryPoint
		}

		if binds := requestBody.Bind; binds != nil {
			hostConfig.Binds = *binds
		}

		if netMode := requestBody.NetworkMode; netMode != nil {
			hostConfig.NetworkMode = container.NetworkMode(*netMode)
		}
		if restartsPolicy := requestBody.RestartPolicy; restartsPolicy != nil {
			hostConfig.RestartPolicy = *restartsPolicy
		}

		if autoRem := requestBody.AutoRemove; autoRem != nil {
			hostConfig.AutoRemove = *autoRem
		}

		if portBindings := requestBody.PortBindings; portBindings != nil {
			pmap := nat.PortMap{}
			for k, v := range *portBindings {
				pmap[nat.Port(k)] = []nat.PortBinding{
					{
						HostIP:   "0.0.0.0",
						HostPort: v,
					},
				}
			}
			hostConfig.PortBindings = pmap
		}

		res, err := dockerContainer.Create(ctx, dockerClient, &config, &hostConfig, requestBody.Name)
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, res)

	}
}

func ContainerPause(dockerClient *client.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()
		ur, _ := c.Get("user")
		reqUser, _ := ur.(models.User)

		if reqUser.Permission == models.Read {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid permissions"})
			return
		}
		err := dockerContainer.Pause(ctx, dockerClient, id)
		if err != nil {
			if errdefs.IsNotFound(err) {
				c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
				return
			}
			log.Println(err)
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": id + " container paused"})
	}
}

func ContainerStart(dockerClient *client.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()
		ur, _ := c.Get("user")
		reqUser, _ := ur.(models.User)

		if reqUser.Permission == models.Read {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid permissions"})
			return
		}
		err := dockerContainer.Start(ctx, dockerClient, id)
		if err != nil {
			if errdefs.IsNotFound(err) {
				c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
				return
			}
			log.Println(err)
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": id + " container started"})
	}
}
