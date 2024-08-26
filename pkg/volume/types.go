package dockerVolume

type RemoveVolumeRequest struct {
	Force bool `json:"force" validate:"required"`
}

type CreateVolumeRequest struct {
	Name   string             `json:"name" validate:"required"`
	Labels *map[string]string `json:"labels"`
}
