package dockerImage

type ImageRemoveRequest struct {
	Force         bool `json:"force" validate:"required"`
	PruneChildren bool `json:"pruneChildren" validate:"required"`
}

type ImageTagRequest struct {
	Tag string `json:"tag" validate:"required"`
}
