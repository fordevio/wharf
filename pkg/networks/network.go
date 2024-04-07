package networks

import (
	"context"
	"fmt"

	dockerTypes "github.com/docker/docker/api/types"
	"github.com/docker/docker/client"
	"github.com/wharf/wharf/types"
)




func GetNetworks(client *client.Client, ctx context.Context, ch chan *Network,errCh chan *types.Error) {

	networks, err := client.NetworkList(ctx, dockerTypes.NetworkListOptions{}) 
	if err != nil {
		errStruc := &types.Error{
			Name : "Listing images",
			Err:   fmt.Errorf("error while docker images listing: %w", err),
			Panic:  false,
		}
		errCh <- errStruc
		close(errCh)
		close(ch)
		return
	}

	for _, network := range networks {
		networkStruct := &Network{
			Name: network.Name,
			ID:    network.ID,
			Created: network.Created,
			Scope: network.Scope,
			Driver: network.Driver,
			EnableIPv6: network.EnableIPv6,
			IPAM: network.IPAM,
			Internal: network.Internal,
			Ingress: network.Ingress,
			Attachable: network.Attachable,
			ConfigFrom: network.ConfigFrom,
			ConfigOnly:  network.ConfigOnly,
			Containers: network.Containers,
			Options: network.Options,
			Labels: network.Labels,
			Peers: network.Peers,
			Services: network.Services,
		}
		ch <- networkStruct
	}

	close(errCh)
	close(ch)
}