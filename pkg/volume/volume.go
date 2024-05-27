package dockerVolume

import (
	"context"
	"fmt"

	"github.com/docker/docker/api/types/volume"
	"github.com/docker/docker/client"
	"github.com/wharf/wharf/pkg/errors"
)

func GetVolumes(client *client.Client, ctx context.Context, ch chan *volume.Volume, errCh chan *errors.Error) {

	volumes, err := client.VolumeList(ctx, volume.ListOptions{})
	if err != nil {
		errStruc := &errors.Error{
			Name: "Listing volumes",
			Err:  fmt.Errorf("error while docker volumes listing: %w", err),
		}
		errCh <- errStruc
		close(errCh)
		close(ch)
		return
	}

	close(errCh)
	for _, vol := range volumes.Volumes {
		ch <- vol
	}

	close(ch)
}
