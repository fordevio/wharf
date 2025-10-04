//go:build integration

package dockerimage

import (
	"context"
	"io"
	"os"
	"testing"

	"github.com/docker/docker/api/types/image"
	"github.com/docker/docker/client"
)

func TestIntegration_ImageOperations(t *testing.T) {
	if os.Getenv("E2E_DOCKER") == "" {
		t.Skip("set E2E_DOCKER=1 to run integration tests")
	}

	contextValue := context.Background()
	dockerClient, err := client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
	if err != nil {
		t.Fatalf("failed to create docker client: %v", err)
	}

	if _, err := dockerClient.Ping(contextValue); err != nil {
		t.Skipf("docker not available: %v", err)
	}

	rc, err := dockerClient.ImagePull(contextValue, "alpine:latest", image.PullOptions{})
	if err != nil {
		t.Fatalf("failed to pull image: %v", err)
	}
	io.Copy(io.Discard, rc)
	rc.Close()

	images, err := GetAll(contextValue, dockerClient)
	if err != nil {
		t.Fatalf("GetAll failed: %v", err)
	}

	if len(images) == 0 {
		t.Fatal("expected at least one image after pull")
	}

	if err := Tag(contextValue, dockerClient, "alpine:latest", "alpine:test-tag"); err != nil {
		t.Fatalf("Tag failed: %v", err)
	}

	if _, err := Remove(contextValue, dockerClient, "alpine:test-tag", image.RemoveOptions{Force: true}); err != nil {
		t.Fatalf("Remove failed: %v", err)
	}

	if _, err := Prune(contextValue, dockerClient); err != nil {
		t.Fatalf("Prune failed: %v", err)
	}
}
