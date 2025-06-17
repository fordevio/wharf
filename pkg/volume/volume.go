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
