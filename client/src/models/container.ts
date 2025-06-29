// Copyright 2025 The wharf Authors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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

export type RestartPolicyMode =
  | 'no'
  | 'always'
  | 'on-failure'
  | 'unless-stopped';

export interface RestartPolicy {
  /**
   * Restart policy name.
   * One of: "no", "always", "on-failure", "unless-stopped".
   */
  name: RestartPolicyMode;

  /**
   * Maximum number of retry attempts for "on-failure" policy.
   */
  maximumRetryCount: number;
}

export interface ContainerCreateRequest {
  /**
   * Container name (required).
   */
  name: string;

  /**
   * Image name (required).
   */
  image: string;

  /**
   * Optional list of environment variables.
   */
  env?: string[];

  /**
   * Optional user.
   */
  user?: string;

  /**
   * Optional domain name.
   */
  domainName?: string;

  /**
   * Optional list of exposed ports.
   */
  exposedPorts?: string[];

  /**
   * Optional command to run.
   */
  cmd?: string[];

  /**
   * Optional working directory.
   */
  workingDir?: string;

  /**
   * Optional entry point command.
   */
  entryPoint?: string[];

  /**
   * Optional bind mount configurations.
   */
  bind?: string[];

  /**
   * Optional Docker network mode (e.g., "bridge", "host", "none").
   */
  networkMode?: string;

  /**
   * Optional port bindings (containerPort: hostPort).
   */
  portBindings?: Record<string, string>;

  /**
   * Optional flag to remove container after it exits.
   */
  autoRemove?: boolean;

  /**
   * Optional restart policy.
   */
  restartPolicy?: RestartPolicy;
}

export interface CreateResponse {
  /**
   * The ID of the created container.
   */
  Id: string;

  /**
   * Warnings encountered when creating the container.
   */
  Warnings: string[];
}

export interface LabelsUpdateResponse {
  /**
   * The ID of the created container.
   */
  Id: string;

  /**
   * Warnings encountered when creating the container.
   */
  Warnings: string[];
}
