package dockervolume

import (
	"context"
	"fmt"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/filters"
	"github.com/docker/docker/api/types/volume"
	"github.com/docker/docker/client"
	"github.com/wharf/wharf/pkg/errors"
)

func GetAll(ctx context.Context, client *client.Client, ch chan *volume.Volume, errCh chan *errors.Error) {

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

func Remove(ctx context.Context, client *client.Client, volumeID string, force bool) error {
	err := client.VolumeRemove(ctx, volumeID, force)
	return err
}

func Prune(ctx context.Context, client *client.Client) (types.VolumesPruneReport, error) {
	report, err := client.VolumesPrune(ctx, filters.Args{})
	return report, err
}

func Create(ctx context.Context, client *client.Client, opts volume.CreateOptions) (volume.Volume, error) {
	vol, err := client.VolumeCreate(ctx, opts)
	return vol, err
}
