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

func NetworkRoutes(incommingRoutes *gin.RouterGroup, dockerClient *client.Client) {
	incommingRoutes.GET("/network/getAll", controllers.GetNetworks(dockerClient))
	incommingRoutes.DELETE("/network/prune", controllers.PruneNetwork(dockerClient))
	incommingRoutes.PUT("/network/disconnect/:id", controllers.DisconnectNetwork(dockerClient))
	incommingRoutes.PUT("/network/connect/:id", controllers.ConnectNetwork(dockerClient))
	incommingRoutes.POST("/network/create", controllers.CreateNetwork(dockerClient))
	incommingRoutes.DELETE("/network/remove/:id", controllers.RemoveNetwork(dockerClient))
	incommingRoutes.PUT("/network/updateLabels/:id", controllers.UpdateNetworkLabels(dockerClient))
}
