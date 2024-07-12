package dockerImage

import (
	"context"
	"fmt"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/filters"
	"github.com/docker/docker/api/types/image"
	"github.com/docker/docker/client"
	"github.com/wharf/wharf/pkg/errors"
)

func GetAll(client *client.Client, ctx context.Context, ch chan *image.Summary, errCh chan *errors.Error) {
	images, err := client.ImageList(ctx, image.ListOptions{})
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

	for _, img := range images {
		ch <- &img
	}

	close(ch)
}

func Prune(client *client.Client, ctx context.Context) (types.ImagesPruneReport, error) {

	pruneReport, err := client.ImagesPrune(ctx, filters.Args{})

	return pruneReport, err
}
