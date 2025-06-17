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

package dockercontainer

import (
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/strslice"
)

type ContainerRemoveRequest struct {
	RemoveVolumes *bool `json:"removeVolumes"`
	Force         *bool `json:"force" validate:"required"`
}

type ContainerRenameRequest struct {
	NewName string `json:"newName" validate:"required"`
}

type ContainerCreateRequest struct {
	Name          string                   `json:"name" validate:"required"`
	Image         string                   `json:"image" validate:"required"`
	Volumes       *map[string]struct{}     `json:"volume"`
	Env           *[]string                `json:"env"`
	User          *string                  `json:"user"`
	DomainName    *string                  `json:"domainName"`
	ExposedPorts  *[]string                `json:"exposedPorts"`
	Cmd           *strslice.StrSlice       `json:"cmd"`
	WorkingDir    *string                  `json:"workingDir"`
	Entrypoint    *strslice.StrSlice       `json:"entryPoint"`
	Bind          *[]string                `json:"bind"`
	NetworkMode   *string                  `json:"networkMode"`
	PortBindings  *map[string]string       `json:"portBindings"`
	AutoRemove    *bool                    `json:"autoRemove"`
	RestartPolicy *container.RestartPolicy `json:"restartPolicy"`
}
