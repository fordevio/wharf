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
	"context"
	"fmt"
	"io"
	"reflect"
	"time"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/filters"
	"github.com/docker/docker/api/types/network"
	"github.com/docker/docker/client"
	"github.com/opencontainers/image-spec/specs-go/v1"
)

func List(ctx context.Context, client *client.Client) ([]types.Container, error) {
	containers, err := client.ContainerList(ctx, container.ListOptions{
		All: true,
	})
	return containers, err
}

func Stop(ctx context.Context, client *client.Client, containerID string) error {
	err := client.ContainerStop(ctx, containerID, container.StopOptions{})
	return err
}

func Unpause(ctx context.Context, client *client.Client, containerID string) error {
	err := client.ContainerUnpause(ctx, containerID)
	return err
}

func Pause(ctx context.Context, client *client.Client, containerID string) error {
	err := client.ContainerPause(ctx, containerID)
	return err
}

func Start(ctx context.Context, client *client.Client, containerID string) error {
	err := client.ContainerStart(ctx, containerID, container.StartOptions{})
	return err
}

func Remove(ctx context.Context, client *client.Client, containerID string, options container.RemoveOptions) error {
	err := client.ContainerRemove(ctx, containerID, options)
	return err
}

func Prune(ctx context.Context, client *client.Client) (types.ContainersPruneReport, error) {
	report, err := client.ContainersPrune(ctx, filters.Args{})
	return report, err
}

func Stats(ctx context.Context, client *client.Client, containerID string) (string, error) {
	stats, err := client.ContainerStatsOneShot(ctx, containerID)
	if err != nil {
		return "", err
	}
	defer stats.Body.Close()
	bodyBytes, err := io.ReadAll(stats.Body)

	if err != nil {
		return "", err
	}
	return string(bodyBytes), nil
}

func Logs(ctx context.Context, client *client.Client, containerID string, days int) (string, error) {

	since := time.Now().Add(-24 * time.Duration(days) * time.Hour).Format(time.RFC3339)

	options := container.LogsOptions{
		ShowStdout: true,
		ShowStderr: true,
		Since:      since,
		Timestamps: true,
	}
	logs, err := client.ContainerLogs(ctx, containerID, options)
	if err != nil {
		return "", err
	}
	defer logs.Close()
	bodyBytes, err := io.ReadAll(logs)
	if err != nil {
		return "", err
	}
	return string(bodyBytes), nil
}

func Rename(ctx context.Context, client *client.Client, containerID string, name string) error {
	err := client.ContainerRename(ctx, containerID, name)
	return err
}

func Create(ctx context.Context, client *client.Client, config *container.Config, hostConfig *container.HostConfig, containerName string) (container.CreateResponse, error) {
	res, err := client.ContainerCreate(ctx, config, hostConfig, &network.NetworkingConfig{}, &v1.Platform{}, containerName)
	return res, err
}

func UpdateLabels(ctx context.Context, client *client.Client, containerID string, labels map[string]string) (*container.CreateResponse, error) {
	// Get the current container configuration
	containerJSON, err := client.ContainerInspect(ctx, containerID)
	if err != nil {
		return nil, err
	}

	config := containerJSON.Config
	hostConfig := containerJSON.HostConfig
	networkingEndpoint := containerJSON.NetworkSettings.Networks

	if reflect.DeepEqual(config.Labels, labels) {
		return nil, fmt.Errorf("no new labels provided")
	}

	config.Labels = labels

	if err = client.ContainerStop(ctx, containerID, container.StopOptions{}); err != nil {
		return nil, err
	}

	if err = client.ContainerRemove(ctx, containerID, container.RemoveOptions{Force: true}); err != nil {
		return nil, err
	}

	res, err := client.ContainerCreate(ctx, config, hostConfig, &network.NetworkingConfig{
		EndpointsConfig: networkingEndpoint,
	}, &v1.Platform{}, containerJSON.Name)
	if err != nil {
		return nil, err
	}

	err = client.ContainerStart(ctx, res.ID, container.StartOptions{})
	return &res, err
}
