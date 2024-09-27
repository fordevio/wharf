package dockerimage

type ImageRemoveRequest struct {
	Force         *bool `json:"force"`
	PruneChildren *bool `json:"pruneChildren" validate:"required"`
}

type ImageTagRequest struct {
	Tag string `json:"tag" validate:"required"`
}
