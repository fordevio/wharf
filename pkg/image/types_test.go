package dockerimage

import "testing"

func TestImageRemoveRequest_Default(t *testing.T) {
	request := ImageRemoveRequest{}

	if request.Force != nil {
		t.Error("expected Force to be nil")
	}

	if request.PruneChildren != nil {
		t.Error("expected PruneChildren to be nil")
	}
}

func TestImageTagRequest_Value(t *testing.T) {
	expectedTag := "latest"
	request := ImageTagRequest{Tag: expectedTag}

	if request.Tag != expectedTag {
		t.Errorf("expected %s, got %s", expectedTag, request.Tag)
	}
}
