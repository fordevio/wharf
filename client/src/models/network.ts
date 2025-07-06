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

export interface ConfigReference {
  Network: string;
}

export interface IPAMConfig {
  // Add fields if you want to specify them later, else keep it as `any` or a placeholder.
  [key: string]: any;
}

export interface IPAM {
  Driver: string;
  Options: Record<string, string>;
  Config: IPAMConfig[];
}

export interface EndpointResource {
  Name: string;
  EndpointID: string;
  MacAddress: string;
  IPv4Address: string;
  IPv6Address: string;
}

export interface PeerInfo {
  Name: string;
  IP: string;
}

export interface Task {
  [key: string]: any; // Placeholder for Task structure if needed
}

export interface ServiceInfo {
  VIP: string;
  Ports: string[];
  LocalLBIndex: number;
  Tasks: Task[];
}

export interface NetworkResource {
  /**
   * Requested name of the network.
   */
  Name: string;

  /**
   * Unique network ID on the machine.
   */
  Id: string;

  /**
   * Time when the network was created.
   */
  Created: string; // ISO string format of `time.Time` in Go

  /**
   * Scope of the network: `local`, `swarm`, etc.
   */
  Scope: string;

  /**
   * Driver used to create the network.
   */
  Driver: string;

  EnableIPv6: boolean;
  IPAM: IPAM;
  Internal: boolean;
  Attachable: boolean;
  Ingress: boolean;
  ConfigFrom: ConfigReference;
  ConfigOnly: boolean;

  Containers: Record<string, EndpointResource>;
  Options: Record<string, string>;
  Labels: Record<string, string>;

  Peers?: PeerInfo[]; // optional due to `omitempty`
  Services?: Record<string, ServiceInfo>; // optional due to `omitempty`
}

export interface NetworksPruneReport {
  /**
   * List of network IDs or names that were deleted.
   */
  NetworksDeleted: string[];
}

export interface NetworkCreateResponse {
  /**
   * Unique ID of the created network.
   */
  Id: string;

  /**
   * Optional warning message returned by the server.
   */
  Warning: string;
}

export interface LabelsUpdateResponse {
  /**
   * Unique ID of the created network.
   */
  Id: string;

  /**
   * Optional warning message returned by the server.
   */
  Warning: string;
}
