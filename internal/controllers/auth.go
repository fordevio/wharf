package controllers

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/wharf/wharf/pkg/auth"
	"github.com/wharf/wharf/pkg/helpers"
	"github.com/wharf/wharf/pkg/models"
	"github.com/wharf/wharf/pkg/store"
)

func CheckInitPassword() gin.HandlerFunc {
	return func(c *gin.Context) {
		var _, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		var adminRequest auth.AdminUserRequest
		defer cancel()
		if err := c.BindJSON(&adminRequest); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		validate := validator.New()
		if err := validate.Struct(adminRequest); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		password, err := helpers.GetInitPassword()
		if err != nil {
			log.Panicln(err)
		}
		if password == nil {
			log.Panicln("InitPassword not found in wharf.txt")
		}

		if adminRequest.Password != *password {
			c.JSON(http.StatusBadRequest, gin.H{"error": "InitPassword not matched"})
			return
		}
		isAdminPresent, err := store.GetAdminUser()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		if isAdminPresent != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Admin user already created"})
			return
		}

		isUsernamePresent, err := store.GetUserByUsername(adminRequest.Username)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		if isUsernamePresent != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Username already taken"})
		}

		var user = models.User{
			Username:   &adminRequest.Username,
			Password:   &adminRequest.Password,
			IsAdmin:    true,
			Permission: models.Execute,
		}
		err = store.CreateUser(&user)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}
}
