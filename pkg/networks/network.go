package networks

import (
	"context"
	"fmt"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/client"
	wharfTypes "github.com/wharf/wharf/types"
)

func GetNetworks(client *client.Client, ctx context.Context, ch chan *types.NetworkResource, errCh chan *wharfTypes.Error) {

	networks, err := client.NetworkList(ctx, types.NetworkListOptions{})
	if err != nil {
		errStruc := &wharfTypes.Error{
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
