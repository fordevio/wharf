package auth

import (
	"net/http"
	"regexp"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/wharf/wharf/pkg/store"
)

func PasswordValidation(fl validator.FieldLevel) bool {
	password := fl.Field().String()

	// Check length
	if len(password) < 8 || len(password) > 20 {
		return false
	}

	// Check if contains at least one letter and one number
	letter := regexp.MustCompile(`[a-zA-Z]`).MatchString
	number := regexp.MustCompile(`[0-9]`).MatchString

	return letter(password) && number(password)
}

func AuthMiddleWare() gin.HandlerFunc {
	return func(c *gin.Context) {
		clientToken := c.Request.Header.Get("token")
		if clientToken == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "No Authorization token header provided"})
			c.Abort()
			return
		}
		claims, err := VerifyToken(clientToken)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			c.Abort()
			return
		}
		uid := claims["sub"].(int)
		user, err := store.GetUserById(uid)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			c.Abort()
			return
		}
		c.Set("user", user)
		c.Next()
	}
}
