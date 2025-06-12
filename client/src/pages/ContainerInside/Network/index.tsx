import { useState } from 'react';
import './index.css';
import { DockerContainer } from '../../../models/container';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllContainers } from '../../../api/container';
import { useQuery } from 'react-query';
import {
  connectContainerToNetwork,
  disconnectContainerFromNetwork,
} from '../../../api/network';
import toast from 'react-hot-toast';

const ContainerNetworks = () => {
  const [container, setContainer] = useState<DockerContainer | null>(null);
  const [openDl, setOpenDl] = useState(false);
  const [openCn, setOpenCn] = useState(false);
  const [conNetId, setConNetId] = useState('');
  const navigate = useNavigate();
  const [force, setForce] = useState<boolean>(false);
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

  const disconnectNet = async (netId: string) => {
    if (container === null) {
      return;
    }
    try {
      const res = await disconnectContainerFromNetwork(
        localStorage.getItem('token') as string,
        netId,
        container?.Id,
        force
      );
      return res.data;
    } catch (e: any) {
      throw e.response ? e.response.data : { error: 'Request failed' };
    }
  };

  const DisconnectHandler = async (netId: string) => {
    toast.promise(disconnectNet(netId), {
      loading: 'Disconnecting from network...',
      success: data => {
        setOpenDl(false);
        fetchContainer();
        return `Successfully disconnected from network `;
      },
      error: error => {
        setOpenDl(false);
        return `${error.error}`;
      },
    });
  };

  const connectNet = async () => {
    if (container === null || conNetId === '') {
      return;
    }
    try {
      const res = await connectContainerToNetwork(
        localStorage.getItem('token') as string,
        conNetId,
        container?.Id
      );
      setOpenCn(false);
      return res.data;
    } catch (e: any) {
      throw e.response ? e.response.data : { error: 'Request failed' };
    }
  };

  const ConnectHandler = async () => {
    if (conNetId === '') {
      toast.error('Please fill all fields');
      return;
    }
    toast.promise(connectNet(), {
      loading: 'Connecting to network...',
      success: data => {
        fetchContainer();
        return `Successfully connected to network `;
      },
      error: error => {
        setOpenCn(false);
        return `${error.error}`;
      },
    });
  };

  useQuery('container' + id, fetchContainer, {
    retry: false,
  });

  if (id === undefined || container === null) {
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
          <div className=" connect-btn">
            <button className="btn cn" onClick={() => setOpenCn(true)}>
              Connect Network
            </button>
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
                  <div>
                    <button className="btn" onClick={() => setOpenDl(true)}>
                      Disconnect
                    </button>
                  </div>
                  <div
                    className="popup-overlay"
                    id="popupOverlay"
                    style={openDl ? { display: 'block' } : { display: 'none' }}
                  >
                    <div className="popup" id="popup">
                      <span
                        className="close"
                        id="closePopup"
                        onClick={() => setOpenDl(false)}
                      >
                        &times;
                      </span>

                      <div className="popup-content">
                        <div className="checkbox-container">
                          <label>
                            <input
                              type="checkbox"
                              checked={force}
                              onChange={() => setForce(!force)}
                            />
                            force Disconnect
                          </label>
                        </div>

                        <button
                          className="submit"
                          onClick={() => DisconnectHandler(network.NetworkID)}
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
        <div
          className="popup-overlay"
          id="popupOverlay"
          style={openCn ? { display: 'block' } : { display: 'none' }}
        >
          <div className="popup" id="popup">
            <span
              className="close"
              id="closePopup"
              onClick={() => setOpenCn(false)}
            >
              &times;
            </span>

            <div className="popup-content">
              <input
                type="text"
                placeholder="Network ID"
                value={conNetId}
                onChange={e => setConNetId(e.target.value)}
              />

              <button className="submit" onClick={() => ConnectHandler()}>
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContainerNetworks;
