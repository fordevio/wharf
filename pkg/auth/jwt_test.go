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
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func TestGenerateToken(t *testing.T) {
	userID := 123

	tokenStr, err := GenerateToken(userID)
	if err != nil {
		t.Fatalf("Expected no error, got: %v", err)
	}
	if tokenStr == nil || *tokenStr == "" {
		t.Fatal("Expected a non-empty token string, got nil or empty")
	}
}

func TestVerifyToken_Valid(t *testing.T) {
	userID := 456

	tokenStr, err := GenerateToken(userID)
	if err != nil {
		t.Fatalf("Failed to generate token: %v", err)
	}

	claims, err := VerifyToken(*tokenStr)
	if err != nil {
		t.Fatalf("Expected valid token, got error: %v", err)
	}

	// Validate claim values
	sub, ok := claims["sub"].(float64)
	if !ok || int(sub) != userID {
		t.Errorf("Expected 'sub' to be %d, got %v", userID, claims["sub"])
	}
}

func TestVerifyToken_Invalid(t *testing.T) {
	invalidToken := "this.is.an.invalid.token"

	_, err := VerifyToken(invalidToken)
	if err == nil {
		t.Fatal("Expected error for invalid token, got nil")
	}
}

func TestVerifyToken_Expired(t *testing.T) {
	// Use same secretKey as in auth.go
	key := []byte("secret-key")

	expiredToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": 999,
		"iss": "wharf",
		"exp": time.Now().Add(-1 * time.Hour).Unix(), // expired
		"iat": time.Now().Add(-2 * time.Hour).Unix(),
	})

	tokenStr, err := expiredToken.SignedString(key)
	if err != nil {
		t.Fatalf("Failed to sign expired token: %v", err)
	}

	_, err = VerifyToken(tokenStr)
	if err == nil {
		t.Fatal("Expected error for expired token, got nil")
	}
}