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

func TestVerifyToken(t *testing.T) {
	userID := 456

	// Valid token
	validToken, err := GenerateToken(userID)
	if err != nil {
		t.Fatalf("Failed to generate valid token: %v", err)
	}

	// Expired token
	key := []byte("secret-key")
	expired := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": userID,
		"iss": "wharf",
		"exp": time.Now().Add(-1 * time.Hour).Unix(),
		"iat": time.Now().Add(-2 * time.Hour).Unix(),
	})
	expiredToken, err := expired.SignedString(key)
	if err != nil {
		t.Fatalf("Failed to generate expired token: %v", err)
	}

	tests := []struct {
		name      string
		token     string
		wantErr   bool
		expectSub int
	}{
		{
			name:      "Valid token",
			token:     *validToken,
			wantErr:   false,
			expectSub: userID,
		},
		{
			name:    "Invalid token",
			token:   "this.is.an.invalid.token",
			wantErr: true,
		},
		{
			name:    "Expired token",
			token:   expiredToken,
			wantErr: true,
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			claims, err := VerifyToken(tc.token)

			if tc.wantErr {
				if err == nil {
					t.Errorf("Expected error in test '%s', got none", tc.name)
				}
			} else {
				if err != nil {
					t.Errorf("Unexpected error in test '%s': %v", tc.name, err)
					return
				}
				sub, ok := claims["sub"].(float64)
				if !ok || int(sub) != tc.expectSub {
					t.Errorf("Expected sub to be %d, got %v", tc.expectSub, claims["sub"])
				}
			}
		})
	}
}
