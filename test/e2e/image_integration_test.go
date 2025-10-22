//go:build integration

package e2e

import (
	"context"
	"io"
	"os"
	"testing"

	"github.com/docker/docker/api/types/image"
	"github.com/docker/docker/client"
	dockerimage "github.com/wharf/wharf/pkg/image" // aliased to avoid clash
)

func TestIntegration_ImageOperations(t *testing.T) {
	if os.Getenv("E2E_DOCKER") == "" {
		t.Skip("set E2E_DOCKER=1 to run integration tests")
	}

	ctx := context.Background()
	dockerClient, err := client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
	if err != nil {
		t.Fatalf("failed to create docker client: %v", err)
	}

	if _, err := dockerClient.Ping(ctx); err != nil {
		t.Skipf("docker not available: %v", err)
	}

	rc, err := dockerClient.ImagePull(ctx, "alpine:latest", image.PullOptions{})
	if err != nil {
		t.Fatalf("failed to pull image: %v", err)
	}
	io.Copy(io.Discard, rc)
	rc.Close()

	images, err := dockerimage.GetAll(ctx, dockerClient)
	if err != nil {
		t.Fatalf("GetAll failed: %v", err)
	}

	if len(images) == 0 {
		t.Fatal("expected at least one image after pull")
	}

	if err := dockerimage.Tag(ctx, dockerClient, "alpine:latest", "alpine:test-tag"); err != nil {
		t.Fatalf("Tag failed: %v", err)
	}

	if _, err := dockerimage.Remove(ctx, dockerClient, "alpine:test-tag", image.RemoveOptions{Force: true}); err != nil {
		t.Fatalf("Remove failed: %v", err)
	}

	if _, err := dockerimage.Prune(ctx, dockerClient); err != nil {
		t.Fatalf("Prune failed: %v", err)
	}
}
