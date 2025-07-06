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

package dockernetwork

type DisconnectNetworkRequest struct {
	ContainerID string `json:"containerID" validate:"required"`
	Force       *bool  `json:"force"`
}

type ConnectNetworkRequest struct {
	ContainerID string `json:"containerId" validate:"required"`
}

type CreateNetworkRequest struct {
	Name   string `json:"name" validate:"required"`
	Driver string `json:"driver" validate:"required"`
}

type UpdateNetworkLabelsRequest struct {
	Labels map[string]string `json:"labels" validate:"required"`
}
