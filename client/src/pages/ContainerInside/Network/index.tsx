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
                <div className="port-name">{port.Type}</div>
                <div className="port-name">{port?.IP}</div>
                <div className="port-name">{port?.PrivatePort}</div>
                <div className="port-name">{port?.PublicPort}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ContainerNetworks;
