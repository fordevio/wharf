export interface DockerContainer {
  Id: string;
  Names: string[];
  Image: string;
  ImageID: string;
  Command: string;
  Created: number; // Timestamp in seconds
  Ports: DockerPort[];
  Labels: Map<string, string>;
  State: string;
  Status: string;
  HostConfig: DockerHostConfig;
  NetworkSettings: DockerNetworkSettings;
  Mounts: DockerMount[];
}

export interface DockerPort {
  IP?: string; // Optional, as it may not be present in all ports
  PrivatePort: number;
  PublicPort?: number; // Optional, as it may not be present in all ports
  Type: string;
}

export interface DockerHostConfig {
  NetworkMode: string;
}

export interface DockerNetworkSettings {
  Networks: Record<string, DockerNetwork>;
}

export interface DockerNetwork {
  IPAMConfig: null;
  Links: null;
  Aliases: null;
  MacAddress: string;
  NetworkID: string;
  EndpointID: string;
  Gateway: string;
  IPAddress: string;
  IPPrefixLen: number;
  IPv6Gateway: string;
  GlobalIPv6Address: string;
  GlobalIPv6PrefixLen: number;
  DriverOpts: null;
  DNSNames: null;
}

export interface DockerMount {
  Type: string;
  Source: string;
  Destination: string;
  Mode?: string; // Optional, as it may not be present
  RW: boolean;
  Propagation?: string; // Optional, as it may not be present
  Name?: string; // Optional, only for volume mounts
  Driver?: string; // Optional, only for volume mounts
}

export interface ContainersPruneReport {
  ContainersDeleted: string[];
  SpaceReclaimed: number;
}
