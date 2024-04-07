package container

import (
	"context"
	"fmt"

	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
	"github.com/wharf/wharf/types"
)

func GetContainers(dockerClient *client.Client, ctx context.Context, ch chan *Container, errCh chan *types.Error) {
     containers,err  := dockerClient.ContainerList(ctx, container.ListOptions{})
     if err!=nil {
		errStruct := &types.Error{
           Name : "Container Listing",
		   Err:  fmt.Errorf("error while docker containers listing: %w", err),
		   Panic: false,
		}
        errCh <- errStruct
		close(ch)
		return
	 }

	 for _, container := range containers {
		contStruct := &Container{
			ID:       container.ID,
			Names:    container.Names,
			Image:    container.Image,
			ImageID:  container.ImageID,
			Command:  container.Command,
			Created:  container.Created,
			Ports:    container.Ports,
			SizeRw:   container.SizeRw,
			SizeRootFs: container.SizeRootFs,
			Labels:    container.Labels,
			State:    container.State,
			Status:   container.Status,
			HostConfig: container.HostConfig,
			NetworkSettings: container.NetworkSettings,
			Mounts : container.Mounts,
		}
		ch <- contStruct
	 }
	 close(ch)
}