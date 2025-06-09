import { useState } from 'react';
import './index.css';
import { DockerContainer } from '../../../models/container';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllContainers } from '../../../api/container';
import { useQuery } from 'react-query';

const ContainerVolumes = () => {
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
      <div className="con-vol-det">
        <div className="volumes">
          <div className="title">Mounts</div>
          <div className="volume-container">
            {container?.Mounts.map((volume, index) => (
              <div key={index} className="volume">
                <div className="vol-name">Type: {volume.Type}</div>
                <div className="volume-name">Name: {volume.Name?.trim()}</div>
                <div className="volume-name">Driver: {volume.Driver}</div>
                <div className="volume-name">Source: {volume.Source}</div>
                <div className="volume-name">
                  Destination: {volume.Destination}
                </div>
                <div className="volume-name">Mode: {volume.Mode}</div>
                <div className="volume-name">
                  RW: {volume.RW ? 'true' : 'false'}
                </div>
                <div className="volume-name">
                  Propagation: {volume.Propagation}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ContainerVolumes;
