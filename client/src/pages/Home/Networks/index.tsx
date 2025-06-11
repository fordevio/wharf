import { useEffect, useState } from 'react';
import './index.css';
import { getAllNetworks, pruneNetworks } from '../../../api/network';
import { NetworkResource } from '../../../models/network';
import toast from 'react-hot-toast';
import NetworkCard from './Network-card';

const Networks = () => {
  const [networks, setNetworks] = useState<NetworkResource[]>([]);

  const fetchNetworks = async () => {
    try {
      const res = await getAllNetworks(localStorage.getItem('token') as string);
      setNetworks(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const prune = async () => {
    try {
      const token = localStorage.getItem('token') as string;
      const res = await pruneNetworks(token);
      return res.data;
    } catch (e: any) {
      throw e.response ? e.response.data : { error: 'Request failed' };
    }
  };

  const pruneHandler = async () => {
    toast.promise(prune(), {
      loading: 'Pruning Volumes...',
      success: data => {
        fetchNetworks();
        return `Successfully pruned ${data.NetworksDeleted ? data.NetworksDeleted.length : 0} volumes,`;
      },
      error: error => {
        return `${error.message}`;
      },
    });
  };

  useEffect(() => {
    fetchNetworks();
  }, []);

  return (
    <>
      <div className="prune-btn">
        <button onClick={pruneHandler} className="btn">
          Prune Networks
        </button>
      </div>
      <div className="card-container">
        {networks.map((network, index) => {
          return (
            <NetworkCard
              key={index}
              network={network}
              networks={networks}
              setNetworks={setNetworks}
            />
          );
        })}
      </div>
    </>
  );
};

export default Networks;
