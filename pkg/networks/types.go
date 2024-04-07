package networks

import (
	"time"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/network"
)

type Network struct {
	Name       string                         `json:"name"`
	ID         string                         `json:"Id"` 
	Created    time.Time                      `json:"created"`
	Scope      string                         `json:"scope"`
	Driver     string                         `json:"driver"`
	EnableIPv6 bool                           `json:"enable_ipv6"`
	IPAM       network.IPAM                   `json:",omitempty"`
	Internal   bool                           `json:"internal"`
	Attachable bool                           `json:"attachable"`
	Ingress    bool                           `json:"ingress"`
	ConfigFrom network.ConfigReference        `json:",omitempty"`
	ConfigOnly bool                           `json:"config_only,omitempty"`
	Containers map[string]types.EndpointResource  `json:",omitempty"`
	Options    map[string]string              `json:"options,omitempty"`
	Labels     map[string]string              	`json:"labels,omitempty"`
	Peers      []network.PeerInfo             `json:",omitempty"` 
	Services   map[string]network.ServiceInfo `json:",omitempty"`
}
