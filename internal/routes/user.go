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
	"github.com/gin-gonic/gin"
	"github.com/wharf/wharf/internal/controllers"
)

func UserRoutes(incommingRoutes *gin.RouterGroup) {
	incommingRoutes.GET("/user/getAll", controllers.ListUsers())
	incommingRoutes.POST("/user/create", controllers.CreateUser())
	incommingRoutes.PUT("/user/update/:id", controllers.UpdateUser())
	incommingRoutes.DELETE("/user/delete/:id", controllers.DeleteUser())
	incommingRoutes.GET("/user/get", controllers.GetUser())
}
