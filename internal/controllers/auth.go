package controllers

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/wharf/wharf/pkg/auth"
	"github.com/wharf/wharf/pkg/helpers"
)

func CheckInitPassword() gin.HandlerFunc{
	return func(c *gin.Context){
		var _, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		var adminRequest auth.AdminUserRequest
		defer cancel()
		if err := c.BindJSON(&adminRequest); err!= nil{
			c.JSON(http.StatusBadRequest, gin.H{"error":err.Error()})
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
			c.JSON(http.StatusBadRequest, gin.H{"error":"InitPassword not matched"})
		}

         
		
	}
}