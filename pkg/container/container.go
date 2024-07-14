package dockerContainer

import (
	"context"
	"fmt"
	"io"
	"time"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/filters"
	"github.com/docker/docker/api/types/network"
	"github.com/docker/docker/client"
	"github.com/opencontainers/image-spec/specs-go/v1"
	"github.com/wharf/wharf/pkg/errors"
)

func GetAll(client *client.Client, ctx context.Context, ch chan *types.Container, errCh chan *errors.Error) {
	containers, err := client.ContainerList(ctx, container.ListOptions{})
	if err != nil {
		errStruct := &errors.Error{
			Name: "Container Listing",
			Err:  fmt.Errorf("error while docker containers listing: %w", err),
		}
		errCh <- errStruct
		close(errCh)
		close(ch)
		return
	}
	close(errCh)

	for _, container := range containers {

		ch <- &container
	}
	close(ch)
}

func Stop(client *client.Client, ctx context.Context, containerId string, errCh chan *errors.Error) {

	err := client.ContainerStop(ctx, containerId, container.StopOptions{})
	if err != nil {

		errStruct := &errors.Error{
			Name: err.Error(),
			Err:  fmt.Errorf("error while docker container stoping: %w", err),
		}
		errCh <- errStruct
		close(errCh)
		return
	}
	close(errCh)
}

func Unpause(client *client.Client, ctx context.Context, containerId string) error {
	err := client.ContainerUnpause(ctx, containerId)
	return err
}

func Remove(client *client.Client, ctx context.Context, containerId string, options container.RemoveOptions) error {
	err := client.ContainerRemove(ctx, containerId, options)
	return err
}

func Prune(client *client.Client, ctx context.Context) (types.ContainersPruneReport, error) {
	report, err := client.ContainersPrune(ctx, filters.Args{})
	return report, err
}

func Stats(client *client.Client, ctx context.Context, containerId string) (string, error) {
	stats, err := client.ContainerStatsOneShot(ctx, containerId)
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

func Logs(client *client.Client, ctx context.Context, containerId string, days int) (string, error) {

	since := time.Now().Add(-24 * time.Duration(days) * time.Hour).Format(time.RFC3339)

	options := container.LogsOptions{
		ShowStdout: true,
		ShowStderr: true,
		Since:      since,
		Timestamps: true,
	}
	logs, err := client.ContainerLogs(ctx, containerId, options)
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

func Rename(client *client.Client, ctx context.Context, containerId string, name string) error {
	err := client.ContainerRename(ctx, containerId, name)
	return err
}

func Create(client *client.Client, ctx context.Context, config *container.Config, hostConfig *container.HostConfig, containerName string) (container.CreateResponse, error) {
	res, err := client.ContainerCreate(ctx, config, hostConfig, &network.NetworkingConfig{}, &v1.Platform{}, containerName)
	return res, err
}
