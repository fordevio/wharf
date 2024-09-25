package auth

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var secretKey = []byte("secret-key")

func GenerateToken(userID int) (*string, error) {
	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": userID,                                // Subject (user identifier)
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

func VerifyToken(tokenString string) (jwt.MapClaims, error) {
	token, err := jwt.Parse(tokenString, func(_ *jwt.Token) (interface{}, error) {
		return secretKey, nil
	})
	if err != nil {
		return nil, err
	}
	if !token.Valid {
		return nil, fmt.Errorf("invalid token")
	}
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return claims, nil
	}
	return nil, fmt.Errorf("invalid token")
}
