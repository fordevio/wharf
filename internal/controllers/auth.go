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
			log.Println(err)
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		validate := validator.New()
		validate.RegisterValidation("password", auth.PasswordValidation)
		if err := validate.Struct(adminRequest); err != nil {
			log.Println(err)
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

		if adminRequest.InitPassword != *password {
			c.JSON(http.StatusBadRequest, gin.H{"error": "InitPassword not matched"})
			return
		}

		isAdminPresent, err := store.GetAdminUser()
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		if isAdminPresent != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Admin user already created"})
			return
		}

		isUsernamePresent, err := store.GetUserByUsername(adminRequest.Username)

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
			Username:   &adminRequest.Username,
			Password:   &adminRequest.Password,
			IsAdmin:    true,
			Permission: models.Execute,
		}
		createdUser, err := store.CreateUser(&user)

		if err != nil {
			log.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"username": user.Username, "userId": createdUser.ID})
	}
}

func IsAdminAvailable() gin.HandlerFunc {
	return func(c *gin.Context) {
		var _, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()
		isAdminPresent, err := store.GetAdminUser()
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		if isAdminPresent == nil {
			c.JSON(http.StatusNotFound, gin.H{"msg": "Admin not found"})
			return
		}
		c.JSON(http.StatusFound, gin.H{"username": isAdminPresent.Username, "userId": isAdminPresent.ID})
	}
}

func Login() gin.HandlerFunc {
	return func(c *gin.Context) {
		var _, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		var loginRequest auth.LoginRequest
		defer cancel()
		if err := c.BindJSON(&loginRequest); err != nil {
			log.Println(err)
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		validate := validator.New()
		validate.RegisterValidation("password", auth.PasswordValidation)
		if err := validate.Struct(loginRequest); err != nil {
			log.Println(err)
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		user, err := store.GetUserByUsername(loginRequest.Username)
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		if user == nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Invalid Credentials"})
			return
		}
		if loginRequest.Password != *user.Password {
			c.JSON(http.StatusNotFound, gin.H{"error": "Invalid Credentials"})
			return
		}
		token, err := auth.GenerateToken(user.ID)
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusFound, gin.H{"token": token, "usernam": user.Username, "userId": user.ID})
	}
}
