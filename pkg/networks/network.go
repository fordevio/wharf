package dockernetwork

import (
	"context"
	"fmt"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/filters"
	"github.com/docker/docker/client"
	"github.com/wharf/wharf/pkg/errors"
)

func GetAll(ctx context.Context, client *client.Client, ch chan *types.NetworkResource, errCh chan *errors.Error) {

	networks, err := client.NetworkList(ctx, types.NetworkListOptions{})
	if err != nil {
		errStruc := &errors.Error{
			Name: "Listing images",
			Err:  fmt.Errorf("error while docker images listing: %w", err),
		}
		errCh <- errStruc
		close(errCh)
		close(ch)
		return
	}
	close(errCh)

	for _, network := range networks {

		ch <- &network
	}

	close(ch)
}

func Prune(ctx context.Context, client *client.Client) (types.NetworksPruneReport, error) {
	pruneReport, err := client.NetworksPrune(ctx, filters.Args{})
	return pruneReport, err
}

func Remove(ctx context.Context, client *client.Client, id string) error {
	err := client.NetworkRemove(ctx, id)
	return err
}

func Disconnect(ctx context.Context, client *client.Client, networkID string, containerID string, force bool) error {
	err := client.NetworkDisconnect(ctx, networkID, containerID, force)
	return err
}

func Connect(ctx context.Context, client *client.Client, networkID string, containerID string) error {
	err := client.NetworkConnect(ctx, networkID, containerID, nil)
	return err
}

func Create(ctx context.Context, client *client.Client, name string, options types.NetworkCreate) (types.NetworkCreateResponse, error) {
	res, err := client.NetworkCreate(ctx, name, options)
	return res, err
}
