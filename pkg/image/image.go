package image

import (
	"context"
	"fmt"

	"github.com/docker/docker/api/types/image"
	"github.com/docker/docker/client"
	wharfTypes "github.com/wharf/wharf/types"
)

func GetImages(client *client.Client, ctx context.Context, ch chan *image.Summary, errCh chan *wharfTypes.Error) {
	images, err := client.ImageList(ctx, image.ListOptions{})
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

	for _, img := range images {
		ch <- &img
	}

	close(ch)
}
