// Copyright 2025 The wharf Authors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package dockerimage

import (
	"context"
	"fmt"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/filters"
	"github.com/docker/docker/api/types/image"
	"github.com/docker/docker/client"

	"github.com/wharf/wharf/pkg/errors"
)

func GetAll(ctx context.Context, client *client.Client, ch chan *image.Summary, errCh chan *errors.Error) {
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

func Prune(ctx context.Context, client *client.Client) (types.ImagesPruneReport, error) {

	pruneReport, err := client.ImagesPrune(ctx, filters.Args{})
	return pruneReport, err
}

func Remove(ctx context.Context, client *client.Client, imageID string, options image.RemoveOptions) ([]image.DeleteResponse, error) {

	removeReport, err := client.ImageRemove(ctx, imageID, options)
	return removeReport, err
}

func Tag(ctx context.Context, client *client.Client, imageID string, tag string) error {
	err := client.ImageTag(ctx, imageID, tag)
	return err
}
