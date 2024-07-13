package dockerImage

type ImageRemoveRequest struct {
	Force         bool `json:"force" validate:"required"`
	PruneChildren bool `json:"pruneChildren" validate:"required"`
}
