package container

import "github.com/docker/docker/api/types"

type Container struct {
	ID         string   `json:"Id"`
	Names      []string `json:"names"`
	Image      string   `json:"image"`
	ImageID    string   `json:"image_id"`
	Command    string   `json:"command"`
	Created    int64    `json:"created"`
	Ports      []types.Port  `json:"ports,omitempty"`
	SizeRw     int64 `json:"sizeRw,omitempty"`
	SizeRootFs int64 `json:"sizeRootFs,omitempty"`
	Labels     map[string]string `json:"labels,omitempty"`
	State      string `json:"state,omitempty"`
	Status     string  `json:"status,omitempty"`
	HostConfig struct {
		NetworkMode string `json:",omitempty"`
	}
	NetworkSettings *(types.SummaryNetworkSettings)  `json:"network_settings,omitempty"`
	Mounts          []types.MountPoint     `json:"mounts,omitempty"`
}
