import { useState } from 'react';
import './index.css';
import { DockerContainer } from '../../../models/container';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllContainers } from '../../../api/container';
import { useQuery } from 'react-query';

const ContainerNetworks = () => {
  const [container, setContainer] = useState<DockerContainer | null>(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const fetchContainer = async () => {
    try {
      const containers = await getAllContainers(
        localStorage.getItem('token') as string
      );
      let s = 0;
      containers.data.forEach(cont => {
        if (cont.Id === id) {
          console.log(cont);
          setContainer(cont);
          s = 1;
          return;
        }
      });
      if (s === 0) {
        navigate('/');
      }
    } catch (e) {
      console.log(e);
      return navigate('/');
    }
  };

  useQuery('container' + id, fetchContainer, {
    retry: false,
  });

  if (id === undefined) {
    return <></>;
  }

  return (
    <>
      <div className="con-net-det">
        <div className="ports">
          <div className="title">Ports</div>
          <div className="port-container">
            {container?.Ports.map((port, index) => (
              <div key={index} className="port">
                <div className="port-name">Port Type: {port.Type}</div>
                <div className="port-name">Port IP: {port?.IP}</div>
                <div className="port-name">
                  PrivatePort: {port?.PrivatePort}
                </div>
                <div className="port-name">PublicPort: {port?.PublicPort}</div>
              </div>
            ))}
          </div>

          <div className="title mode">
            Network Mode: {container?.HostConfig.NetworkMode}
          </div>
          <div className="title">Network Settings</div>
          <div className="port-container">
            {Object.entries(container?.NetworkSettings.Networks || {}).map(
              ([networkName, network], index) => (
                <div key={index} className="port">
                  <div className="port-name">Network Name: {networkName}</div>
                  <div className="network-details">
                    <div>IPAM Config: {JSON.stringify(network.IPAMConfig)}</div>
                    <div>Mac Address: {network.MacAddress}</div>
                    <div>Network ID: {network.NetworkID}</div>
                    <div>Endpoint ID: {network.EndpointID}</div>
                    <div>Gateway: {network.Gateway}</div>
                    <div>IPAddress: {network.IPAddress}</div>
                    <div>IPPrefixLen: {network.IPPrefixLen}</div>
                    <div>IPv6 Gateway: {network.IPv6Gateway}</div>
                    <div>Global IPv6 Address: {network.GlobalIPv6Address}</div>
                    <div>
                      Global IPv6 Prefix Len: {network.GlobalIPv6PrefixLen}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ContainerNetworks;
