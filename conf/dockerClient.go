package conf

import (
	"log"

	"github.com/docker/docker/client"
)

func InitDockerClient() *client.Client {
	client, err := client.NewClientWithOpts(client.WithAPIVersionNegotiation())
	if err != nil {
		client.Close()
		log.Println("Error while initializing DockerClient: %w", err)
		panic(err)
	}
	log.Println("DockerClient succefully initialized")
	return client
}
