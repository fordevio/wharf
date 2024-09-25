package dockercontainer

import (
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/strslice"
)

type ContainerRemoveRequest struct {
	RemoveVolumes *bool `json:"removeVolumes"`
	Force         *bool `json:"force" validate:"required"`
}

type ContainerRenameRequest struct {
	NewName string `json:"newName" validate:"required"`
}

type ContainerCreateRequest struct {
	Name          string                   `json:"name" validate:"required"`
	Image         string                   `json:"image" validate:"required"`
	Volumes       *map[string]struct{}     `json:"volume"`
	Env           *[]string                `json:"env"`
	User          *string                  `json:"user"`
	DomainName    *string                  `json:"domainName"`
	ExposedPorts  *[]string                `json:"exposedPorts"`
	Cmd           *strslice.StrSlice       `json:"cmd"`
	WorkingDir    *string                  `json:"workingDir"`
	Entrypoint    *strslice.StrSlice       `json:"entryPoint"`
	Bind          *[]string                `json:"bind"`
	NetworkMode   *string                  `json:"networkMode"`
	PortBindings  *map[string]string       `json:"portBindings"`
	AutoRemove    *bool                    `json:"autoRemove"`
	RestartPolicy *container.RestartPolicy `json:"restartPolicy"`
}
