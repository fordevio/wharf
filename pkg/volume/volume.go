package volume

import (
	"context"
	"fmt"

	"github.com/docker/docker/api/types/volume"
	"github.com/docker/docker/client"
	"github.com/wharf/wharf/types"
)

func GetVolumes(client *client.Client, ctx context.Context, ch chan *volume.Volume, errCh chan *types.Error ){
   
	volumes, err := client.VolumeList(ctx, volume.ListOptions{})
	if err != nil {
    	errStruc := &types.Error{
			Name : "Listing volumes",
			Err:   fmt.Errorf("error while docker volumes listing: %w", err),
			Panic:  false,
		}
		errCh <- errStruc
		close(errCh)
		close(ch)
		return
	}

	for _, vol := range volumes.Volumes {
       ch <- vol 
	}
	close(errCh)
	close(ch)
}