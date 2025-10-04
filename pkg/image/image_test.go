package dockerimage

import (
	"context"
	"testing"

	"github.com/docker/docker/api/types/image"
	"github.com/docker/docker/client"
)

func TestGetAll(t *testing.T) {
	contextValue := context.Background()
	dockerClient, _ := client.NewClientWithOpts(client.FromEnv)

	_, err := GetAll(contextValue, dockerClient)
	if err != nil {
		t.Log("GetAll returned error:", err)
	}
}

func TestPrune(t *testing.T) {
	contextValue := context.Background()
	dockerClient, _ := client.NewClientWithOpts(client.FromEnv)

	_, err := Prune(contextValue, dockerClient)
	if err != nil {
		t.Log("Prune returned error:", err)
	}
}

func TestRemove(t *testing.T) {
	contextValue := context.Background()
	dockerClient, _ := client.NewClientWithOpts(client.FromEnv)

	_, err := Remove(contextValue, dockerClient, "sample-image", image.RemoveOptions{})
	if err != nil {
		t.Log("Remove returned error:", err)
	}
}

func TestTag(t *testing.T) {
	contextValue := context.Background()
	dockerClient, _ := client.NewClientWithOpts(client.FromEnv)

	err := Tag(contextValue, dockerClient, "image1", "latest")
	if err != nil {
		t.Log("Tag returned error:", err)
	}
}
