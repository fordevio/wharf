import { useEffect, useState } from 'react';
import './index.css';
import { Volume } from '../../../models/volume';
import { getAllVolumes, pruneVolumes } from '../../../api/volume';
import toast from 'react-hot-toast';
import VolumeCard from './Volume-card';
import { Link } from 'react-router-dom';

const Volumes = () => {
  const [volumes, setVolumes] = useState<Volume[]>([]);

  const fetchVolumes = async () => {
    try {
      const res = await getAllVolumes(localStorage.getItem('token') as string);
      setVolumes(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const prune = async () => {
    try {
      const token = localStorage.getItem('token') as string;
      const res = await pruneVolumes(token);
      return res.data;
    } catch (e: any) {
      throw e.response ? e.response.data : { error: 'Request failed' };
    }
  };

  const pruneHandler = async () => {
    toast.promise(prune(), {
      loading: 'Pruning Volumes...',
      success: data => {
        fetchVolumes();
        return `Successfully pruned ${data.VolumesDeleted ? data.VolumesDeleted.length : 0} volumes and reclaimed ${data.SpaceReclaimed} bytes of space.`;
      },
      error: error => {
        return `${error.message}`;
      },
    });
  };

  useEffect(() => {
    fetchVolumes();
  }, []);

  return (
    <>
      <div className="prune-btn">
        <button onClick={pruneHandler} className="btn">
          Prune Volumes
        </button>
        <Link to="/volume/create" className="btn create-btn">
          Create
        </Link>
      </div>
      <div className="card-container">
        {volumes.map((vol, index) => {
          return (
            <VolumeCard
              key={index}
              volume={vol}
              volumes={volumes}
              setVolumes={setVolumes}
            />
          );
        })}
      </div>
    </>
  );
};

export default Volumes;
