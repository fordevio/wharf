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

package framework

import (
	"github.com/wharf/wharf/conf"
	"github.com/wharf/wharf/pkg/models"
	"github.com/wharf/wharf/pkg/store"
	"k8s.io/utils/ptr"
)

func InitAdminUser() {
	conf.InitDir()
	conf.InitPassword()
	_, _ = store.CreateUser(&models.User{
		Username:   ptr.To("admin"),
		Password:   ptr.To("1234Admin"),
		IsAdmin:    true,
		Permission: models.Execute,
	})
}
