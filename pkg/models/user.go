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

package models

type Permission string

const (
	Read    Permission = "r"
	Write   Permission = "w"
	Execute Permission = "x"
)

type User struct {
	ID         int        `json:"id"`
	Username   *string    `json:"username"`
	Password   *string    `json:"password"`
	IsAdmin    bool       `json:"isAdmin"`
	Permission Permission `json:"permissions"`
}

func (p Permission) IsValid() bool {
	switch p {
	case Read, Write, Execute:
		return true
	default:
		return false
	}
}
