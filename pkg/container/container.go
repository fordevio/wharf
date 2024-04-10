package pkg

import (
	"context"
	"fmt"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
	wharfTypes "github.com/wharf/wharf/types"
)

func GetContainers(client *client.Client, ctx context.Context, ch chan *types.Container, errCh chan *wharfTypes.Error) {
	containers, err := client.ContainerList(ctx, container.ListOptions{})
	if err != nil {
		errStruct := &wharfTypes.Error{
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


func StopContainer(client *client.Client, ctx context.Context, containerId string , errCh chan *wharfTypes.Error) {
    
	err := client.ContainerStop(ctx, containerId, container.StopOptions{})
	if err != nil {

		errStruct := &wharfTypes.Error{
			Name: err.Error(),
			Err:  fmt.Errorf("error while docker container stoping: %w", err),
		}
		errCh <- errStruct
		close(errCh)
		return 
	}
	close(errCh)
}