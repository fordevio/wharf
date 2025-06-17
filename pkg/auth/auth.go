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

package auth

import (
	"net/http"
	"regexp"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/wharf/wharf/conf"
	"github.com/wharf/wharf/pkg/models"
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

func MiddleWare() gin.HandlerFunc {
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
		uidFloat := claims["sub"].(float64)
		uid := int(uidFloat)

		if conf.Cache != nil {
			userCache := conf.Cache.Get(strconv.Itoa(uid))
			if userCache != nil {
				user, ok := userCache.(models.User)
				if ok {
					c.Set("user", user)
					c.Next()
				}
			}
		}
		user, err := store.GetUserByID(uid)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			c.Abort()
			return
		}
		if user == nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized request"})
			c.Abort()
			return
		}
		if conf.Cache != nil {
			_ = conf.Cache.Set(strconv.Itoa(uid), *user)
		}
		c.Set("user", *user)
		c.Next()
	}
}
