package auth

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var secretKey = []byte("secret-key")

func GenerateToken(userId int) (*string, error) {
	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": userId,                                // Subject (user identifier)
		"iss": "wharf",                               // Issuer// Audience (user role)
		"exp": time.Now().Add(time.Hour * 10).Unix(), // Expiration time = 10Hr
		"iat": time.Now().Unix(),                     // Issued at
	})
	tokenString, err := claims.SignedString(secretKey)
	if err != nil {
		return nil, err
	}
	return &tokenString, nil
}

func VerifyToken(tokenString string) (*jwt.Token, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return secretKey, nil
	})
	if err != nil {
		return nil, err
	}
	if !token.Valid {
		return nil, fmt.Errorf("invalid token")
	}
	return token, nil
}
