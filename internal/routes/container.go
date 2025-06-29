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

package routes

import (
	"github.com/docker/docker/client"
	"github.com/gin-gonic/gin"
	"github.com/wharf/wharf/internal/controllers"
)

func ContainerRoutes(incommingRoutes *gin.RouterGroup, dockerClient *client.Client) {
	incommingRoutes.GET("/container/getAll", controllers.GetContainers(dockerClient))
	incommingRoutes.PUT("/container/stop/:id", controllers.StopContainer(dockerClient))
	incommingRoutes.GET("/container/get/:id", controllers.GetContainer(dockerClient))
	incommingRoutes.PUT("/container/start/:id", controllers.ContainerStart(dockerClient))
	incommingRoutes.PUT("/container/pause/:id", controllers.ContainerPause(dockerClient))
	incommingRoutes.PUT("/container/unpause/:id", controllers.UnpauseContainer(dockerClient))
	incommingRoutes.DELETE("/container/remove/:id", controllers.RemoveContainer(dockerClient))
	incommingRoutes.DELETE("/container/prune", controllers.PruneContainers(dockerClient))
	incommingRoutes.GET("/container/stats/:id", controllers.ContainerStats(dockerClient))
	incommingRoutes.GET("/container/logs/:id", controllers.ContainerLogs(dockerClient))
	incommingRoutes.PUT("/container/rename/:id", controllers.ContainerRename(dockerClient))
	incommingRoutes.POST("/container/create", controllers.ContainerCreate(dockerClient))
	incommingRoutes.PUT("/container/updateLabels/:id", controllers.UpdateContainerLabels(dockerClient))
}
