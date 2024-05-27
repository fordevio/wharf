package dockerImage

import (
	"context"
	"fmt"

	"github.com/docker/docker/api/types/image"
	"github.com/docker/docker/client"
	"github.com/wharf/wharf/pkg/errors"
)

func GetImages(client *client.Client, ctx context.Context, ch chan *image.Summary, errCh chan *errors.Error) {
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
