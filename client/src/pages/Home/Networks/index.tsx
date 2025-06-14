import { useEffect, useState } from 'react';
import './index.css';
import {
  createNetwork,
  getAllNetworks,
  pruneNetworks,
} from '../../../api/network';
import { NetworkResource } from '../../../models/network';
import toast from 'react-hot-toast';
import NetworkCard from './Network-card';

const Networks = () => {
  const [networks, setNetworks] = useState<NetworkResource[]>([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [name, setName] = useState('');
  const [driver, setDriver] = useState('bridge');

  const create = async () => {
    try {
      const token = localStorage.getItem('token') as string;
      const res = await createNetwork(token, name, driver);
      fetchNetworks();
      setName('');
      setDriver('bridge');
      setOpenCreate(false);
      return res.data;
    } catch (e: any) {
      throw e.response ? e.response.data : { error: 'Request failed' };
    }
  };
  const createHandler = async () => {
    if (name.trim() === '') {
      toast.error('Network name cannot be empty');
      return;
    }
    if (driver.trim() === '') {
      toast.error('Driver cannot be empty');
      return;
    }
    toast.promise(create(), {
      loading: 'Creating Network...',
      success: data => {
        return `Network created successfully!`;
      },
      error: error => {
        return `${error.message}`;
      },
    });
  };
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
        <button onClick={() => setOpenCreate(true)} className="btn">
          Create
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
      <div
        className="popup-overlay"
        id="popupOverlay"
        style={openCreate ? { display: 'block' } : { display: 'none' }}
      >
        <div className="popup" id="popup">
          <span
            className="close"
            id="closePopup"
            onClick={() => setOpenCreate(false)}
          >
            &times;
          </span>

          <div className="popup-content">
            <input
              type="text"
              placeholder="New name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div className="popup-content">
            <input
              type="text"
              placeholder="Driver"
              value={driver}
              onChange={e => setDriver(e.target.value)}
            />
          </div>
          <button className="submit" onClick={createHandler}>
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

export default Networks;
