package dockerVolume

import (
	"context"
	"fmt"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/filters"
	"github.com/docker/docker/api/types/volume"
	"github.com/docker/docker/client"
	"github.com/wharf/wharf/pkg/errors"
)

func GetAll(client *client.Client, ctx context.Context, ch chan *volume.Volume, errCh chan *errors.Error) {

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

func Remove(client *client.Client, ctx context.Context, volumeId string, force bool) error {
	err := client.VolumeRemove(ctx, volumeId, force)
	return err
}

func Prune(client *client.Client, ctx context.Context) (types.VolumesPruneReport, error) {
	report, err := client.VolumesPrune(ctx, filters.Args{})
	return report, err
}

func Create(client *client.Client, ctx context.Context, opts volume.CreateOptions) (volume.Volume, error) {
	vol, err := client.VolumeCreate(ctx, opts)
	return vol, err
}
