package dockerVolume

type RemoveVolumeRequest struct {
	Force bool `json:"force" validate:"required"`
}
