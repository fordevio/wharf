import { useEffect, useState } from 'react';
import { getAllContainers, pruneContainers } from '../../../api/container';
import { DockerContainer } from '../../../models/container';
import ContainerCard from './Container-card';
import './index.css';
import toast from 'react-hot-toast';
import { create } from 'domain';
import { Link } from 'react-router-dom';

const Containers = () => {
  const [containers, setContainers] = useState<DockerContainer[]>([]);

  const fetchContainers = async () => {
    try {
      const res = await getAllContainers(
        localStorage.getItem('token') as string
      );
      setContainers(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const prune = async () => {
    try {
      const token = localStorage.getItem('token') as string;
      const containerRes = await pruneContainers(token);
      return containerRes.data;
    } catch (e: any) {
      throw e.response ? e.response.data : { error: 'Request failed' };
    }
  };

  const pruneHandler = async () => {
    toast.promise(prune(), {
      loading: 'Pruning containers...',
      success: data => {
        fetchContainers();
        return `Successfully pruned ${data.ContainersDeleted ? data.ContainersDeleted.length : 0} containers and reclaimed ${data.SpaceReclaimed} bytes of space.`;
      },
      error: error => {
        return `${error.message}`;
      },
    });
  };

  useEffect(() => {
    fetchContainers();
  }, []);

  return (
    <>
      <div className="prune-btn">
        <button onClick={pruneHandler} className="btn">
          Prune Containers
        </button>
        <Link to={'/container/create'} className="btn">
          Create
        </Link>
      </div>
      <div className="card-container">
        {containers.map((container, index) => {
          return (
            <ContainerCard
              key={index}
              container={container}
              containers={containers}
              setContainers={setContainers}
            />
          );
        })}
      </div>
    </>
  );
};

export default Containers;
