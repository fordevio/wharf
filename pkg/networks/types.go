package dockerNetwork

type DisconnectNetworkRequest struct {
	ContainerID string `json:"containerID" validate:"required"`
	Force       bool   `json:"force" validate:"required"`
}

type ConnectNetworkRequest struct {
	ContainerID string `json:"containerId" validate:"required"`
}

type CreateNetworkRequest struct {
	Name   string `json:"name" validate:"required"`
	Driver string `json:"driver" validate:"required"`
}
