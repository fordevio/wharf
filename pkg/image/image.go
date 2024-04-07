package image

import (
	"context"
	"fmt"

	"github.com/docker/docker/api/types/image"
	"github.com/docker/docker/client"
	"github.com/wharf/wharf/types"
)

func GetImages(client *client.Client, ctx context.Context, ch chan *image.Summary, errCh chan *types.Error) {
   images, err := client.ImageList(ctx, image.ListOptions{})
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
   for _, img := range images {
	ch <- &img
   }
   close(errCh)
   close(ch)
}