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

func ImageRoutes(incommingRoutes *gin.RouterGroup, dockerClient *client.Client) {
	incommingRoutes.GET("/image/getAll", controllers.GetImages(dockerClient))
	incommingRoutes.DELETE("/image/prune", controllers.PruneImages(dockerClient))
	incommingRoutes.DELETE("/image/remove/:id", controllers.RemoveImage(dockerClient))
	incommingRoutes.PUT("/image/tag/:id", controllers.TagImage(dockerClient))
}
