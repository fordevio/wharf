package dockerNetwork

import (
	"context"
	"fmt"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/filters"
	"github.com/docker/docker/client"
	"github.com/wharf/wharf/pkg/errors"
)

func GetAll(client *client.Client, ctx context.Context, ch chan *types.NetworkResource, errCh chan *errors.Error) {

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

func Prune(client *client.Client, ctx context.Context) (types.NetworksPruneReport, error) {
	pruneReport, err := client.NetworksPrune(ctx, filters.Args{})
	return pruneReport, err
}
