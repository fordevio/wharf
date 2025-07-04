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

	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/wharf/wharf/conf"
	"github.com/wharf/wharf/pkg/auth"
	"github.com/wharf/wharf/pkg/models"
	"github.com/wharf/wharf/pkg/store"
	"github.com/wharf/wharf/pkg/user"
)

func CreateUser() gin.HandlerFunc {
	return func(c *gin.Context) {
		var _, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		var createUserRequest user.CreateUserRequest
		defer cancel()
		if err := c.BindJSON(&createUserRequest); err != nil {
			log.Println(err)
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		validate := validator.New()
		if err := validate.RegisterValidation("password", auth.PasswordValidation); err != nil {
			log.Println(err)
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		if err := validate.Struct(createUserRequest); err != nil {
			log.Println(err)
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		if isValid := createUserRequest.Permission.IsValid(); !isValid {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Permisssion"})
			return
		}

		ur, _ := c.Get("user")
		reqUser, _ := ur.(models.User)

		if !reqUser.IsAdmin {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Request not sent by admin"})
			return
		}
		isUsernamePresent, err := store.GetUserByUsername(createUserRequest.Username)
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		if isUsernamePresent != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Username already taken"})
			return
		}
		var user = models.User{
			Username:   &createUserRequest.Username,
			Password:   &createUserRequest.Password,
			IsAdmin:    false,
			Permission: createUserRequest.Permission,
		}
		createdUser, err := store.CreateUser(&user)
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, createdUser)

	}
}

func UpdateUser() gin.HandlerFunc {
	return func(c *gin.Context) {
		var _, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		var updateUserRequest user.UpdateUserRequest
		defer cancel()
		idParam := c.Param("id")
		id, err := strconv.Atoi(idParam)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
			return
		}

		if err := c.BindJSON(&updateUserRequest); err != nil {
			log.Println(err)
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		validate := validator.New()
		if err := validate.RegisterValidation("password", auth.PasswordValidation); err != nil {
			log.Println(err)
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		if err := validate.Struct(updateUserRequest); err != nil {
			log.Println(err)
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		if isValid := updateUserRequest.Permission.IsValid(); !isValid {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Permisssion"})
			return
		}

		ur, _ := c.Get("user")
		reqUser, _ := ur.(models.User)

		if !reqUser.IsAdmin {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Request not sent by admin"})
			return
		}
		isUser, err := store.GetUserByID(id)
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		if isUser == nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "User not exists"})
			return
		}
		isUsernamePresent, err := store.GetUserByUsername(updateUserRequest.Username)
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		if (isUsernamePresent != nil) && (updateUserRequest.Username != *isUser.Username) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Username already taken"})
			return
		}

		if isUser.IsAdmin && updateUserRequest.Username != "admin" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Admin username cannot be other than admin"})
			return
		}

		isUser.Username = &updateUserRequest.Username
		isUser.Password = &updateUserRequest.Password
		isUser.Permission = updateUserRequest.Permission
		_, err = store.UpdateUser(isUser)
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		conf.Cache.Invalidate(strconv.Itoa(id))
		c.JSON(http.StatusOK, isUser)
	}
}

func DeleteUser() gin.HandlerFunc {
	return func(c *gin.Context) {
		var _, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()
		idParam := c.Param("id")
		id, err := strconv.Atoi(idParam)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
			return
		}

		ur, _ := c.Get("user")
		reqUser, _ := ur.(models.User)

		if !reqUser.IsAdmin {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Request not sent by admin"})
			return
		}
		isUser, err := store.GetUserByID(id)
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		if isUser == nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "User not exists"})
			return
		}

		err = store.DeleteUser(id)
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		conf.Cache.Invalidate(strconv.Itoa(id))
		c.JSON(http.StatusOK, gin.H{"message": "user deleted"})
	}
}

func ListUsers() gin.HandlerFunc {
	return func(c *gin.Context) {
		var _, cancel = context.WithTimeout(context.Background(), 100*time.Second)

		defer cancel()

		ur, _ := c.Get("user")
		reqUser, _ := ur.(models.User)

		if !reqUser.IsAdmin {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Request not sent by admin"})
			return
		}
		users, err := store.GetAllUsers()
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, users)
	}
}

func GetUser() gin.HandlerFunc {
	return func(c *gin.Context) {

		var _, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()

		ur, _ := c.Get("user")
		reqUser, _ := ur.(models.User)
		res := user.GetUserResponse{
			Username:   *reqUser.Username,
			Permission: reqUser.Permission,
			IsAdmin:    reqUser.IsAdmin,
			ID:         reqUser.ID,
		}
		c.JSON(http.StatusOK, res)
	}
}
