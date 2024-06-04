package controllers

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
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
			log.Println()
		}
		if err := c.BindJSON(&createUserRequest); err != nil {
			log.Println(err)
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		validate := validator.New()
		validate.RegisterValidation("password", auth.PasswordValidation)
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
		reqUser, _ := ur.(*models.User)

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
