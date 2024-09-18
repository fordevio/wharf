export interface DockerContainer {
    Id: string;
    Names: string[];
    Image: string;
    ImageID: string;
    Command: string;
    Created: number;
    Ports: Port[];
    Labels: {
      [key: string]: string;
    };
    State: string;
    Status: string;
    HostConfig: {
      NetworkMode: string;
    };
    NetworkSettings: {
      Networks: {
        [networkName: string]: Network;
      };
    };
    Mounts: any[];
  }
  
  interface Port {
    PrivatePort: number;
    Type: string;
  }
  
  interface Network {
    IPAMConfig: any;
    Links: any;
    Aliases: any;
    MacAddress: string;
    NetworkID: string;
    EndpointID: string;
    Gateway: string;
    IPAddress: string;
    IPPrefixLen: number;
    IPv6Gateway: string;
    GlobalIPv6Address: string;
    GlobalIPv6PrefixLen: number;
    DriverOpts: any;
    DNSNames: any;
  }
  